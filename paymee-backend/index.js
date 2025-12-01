import express from "express";
import axios from "axios";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";
import crypto from "crypto";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

/* =========================
   1) MIDDLEWARES
   ========================= */

app.use(cors());

// JSON normal
app.use(express.json());
// x-www-form-urlencoded (webhook Paymee)
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  if (req.method !== "GET") console.log("BODY =", req.body);
  next();
});

/* =========================
   2) FIREBASE
   ========================= */
console.log("FIREBASE_PROJECT_ID =", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL =", process.env.FIREBASE_CLIENT_EMAIL);
console.log(
  "FIREBASE_PRIVATE_KEY starts with =",
  process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30)
);

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  console.error("❌ Firebase env manquantes. Vérifie paymee-backend/.env");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

/* =========================
   3) PAYMEE CONFIG
   ========================= */
const PAYMEE_ENV = process.env.PAYMEE_ENV || "sandbox";
const PAYMEE_BASE =
  PAYMEE_ENV === "prod"
    ? "https://app.paymee.tn"
    : "https://sandbox.paymee.tn";

const PAYMEE_CREATE_URL = `${PAYMEE_BASE}/api/v2/payments/create`;
const PAYMEE_KEY = process.env.PAYMEE_KEY;

const FRONT_PUBLIC_URL = (process.env.FRONT_PUBLIC_URL || "").trim();
const BACKEND_PUBLIC_URL = (process.env.BACKEND_PUBLIC_URL || "").trim();

if (!PAYMEE_KEY) console.warn("⚠️ PAYMEE_KEY manquante");
if (!BACKEND_PUBLIC_URL) console.warn("⚠️ BACKEND_PUBLIC_URL manquante");

/* =========================
   4) CREATE PAYMENT
   ========================= */
app.post("/api/payments/create", async (req, res) => {
  try {
    const {
      courseId,
      amount,
      phone,
      userId,
      email,
      firstName,
      lastName,
      baseUrl,
    } = req.body || {};

    if (!courseId || !amount || !userId) {
      return res.status(400).json({
        message: "courseId, amount, userId requis",
      });
    }

    const cleanBaseUrl = String(
      baseUrl || FRONT_PUBLIC_URL || BACKEND_PUBLIC_URL || "http://localhost:5181"
    )
      .trim()
      .replace(/\/+$/, "");

    const paymentRef = await db.collection("payments").add({
      userId,
      courseId,
      amount: Number(amount),
      status: "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const paymentId = paymentRef.id;

    const paymeePayload = {
      amount: Math.round(Number(amount)),
      note: `Achat du cours : ${courseId}`,
      first_name: String(firstName || "User").trim(),
      last_name: String(lastName || "Demo").trim(),
      email: String(email || "demo@paymee.tn").trim(),
      phone: String(phone || "11111111")
        .replace(/\D/g, "")
        .slice(0, 8)
        .padEnd(8, "1"),
      order_id: paymentId,

      // un seul "?" → Paymee rajoute &payment_token=...
      return_url: `${cleanBaseUrl}/payment-status?pid=${paymentId}&sandbox=1`,
      cancel_url: `${cleanBaseUrl}/payment-status?pid=${paymentId}&sandbox=1`,

      webhook_url: `${BACKEND_PUBLIC_URL}/api/payments/webhook`,
    };

    console.log("PAYMEE CREATE URL =", PAYMEE_CREATE_URL);
    console.log("WEBHOOK URL SENT TO PAYMEE =", paymeePayload.webhook_url);
    console.log("PAYMEE PAYLOAD SENT =", paymeePayload);

    const paymeeRes = await axios.post(PAYMEE_CREATE_URL, paymeePayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${PAYMEE_KEY}`,
      },
    });

    const raw = paymeeRes.data;
    console.log("PAYMEE RAW RESPONSE =", raw);

    if (raw?.status === false) {
      throw new Error(raw?.message || "Paymee rejected");
    }

    const paymeeData = raw?.data || raw;

    const paymeeToken =
      paymeeData?.token ||
      paymeeData?.payment_token ||
      paymeeData?.pay_token;

    const paymentUrl =
      paymeeData?.payment_url ||
      paymeeData?.url;

    if (!paymeeToken || !paymentUrl) {
      throw new Error("Paymee response incomplete: token/payment_url missing");
    }

    await paymentRef.update({
      paymeeToken,
      paymentUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({
      paymentId,
      payment_url: paymentUrl,
      token: paymeeToken,
    });
  } catch (e) {
    console.error("🔥 CREATE PAYMENT ERROR FULL =", {
      message: e.message,
      stack: e.stack,
      axiosStatus: e.response?.status,
      axiosData: e.response?.data,
    });

    return res.status(500).json({
      message: e.response?.data?.message || e.message,
      details: e.response?.data || null,
    });
  }
});

/* =========================
   5) WEBHOOK
   ========================= */
app.post("/api/payments/webhook", async (req, res) => {
  try {
    const body = req.body || {};
    const {
      token,
      payment_status,
      order_id,
      check_sum,
      transaction_id,
    } = body;

    console.log("✅ WEBHOOK RECEIVED =", body);

    if (!token || payment_status == null || !order_id || !check_sum) {
      console.log("❌ Missing fields", { token, payment_status, order_id, check_sum });
      return res.status(400).send("Missing webhook fields");
    }

    const statusRaw = String(payment_status).trim();

    const candidates = [
      statusRaw,
      statusRaw.toLowerCase(),
      statusRaw === "True" || statusRaw === "true" ? "1" : "0",
    ];

    let checksumOk = false;
    let usedCandidate = null;

    for (const s of candidates) {
      const rawCheck = `${token}${s}${PAYMEE_KEY}`;
      const md5 = crypto.createHash("md5").update(rawCheck, "utf8").digest("hex");

      if (md5 === check_sum) {
        checksumOk = true;
        usedCandidate = s;
        break;
      }
    }

    if (!checksumOk) {
      console.log("❌ INVALID CHECKSUM", {
        candidates,
        expectedCheckSum: check_sum,
        token,
        payment_status,
      });
      return res.status(400).send("Invalid checksum");
    }

    console.log("✅ Checksum OK with candidate =", usedCandidate);

    const success =
      statusRaw === "True" ||
      statusRaw === "true" ||
      statusRaw === "1";

    const status = success ? "SUCCESS" : "FAILED";

    const docRef = db.collection("payments").doc(order_id);
    const snap = await docRef.get();

    if (!snap.exists) {
      console.log("❌ Payment doc not found:", order_id);
      return res.sendStatus(200);
    }

    await docRef.update({
      status,
      transactionId: transaction_id ? String(transaction_id) : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ PAYMENT UPDATED TO", status);
    return res.sendStatus(200);
  } catch (e) {
    console.error("WEBHOOK ERROR:", e.message);
    return res.sendStatus(500);
  }
});

/* =========================
   6) API GET PAYMENT
   ========================= */
app.get("/api/payments/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const snap = await db.collection("payments").doc(pid).get();

    if (!snap.exists) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }

    return res.json({ id: snap.id, ...snap.data() });
  } catch (e) {
    console.error("GET PAYMENT ERROR:", e.message);
    return res.status(500).json({ message: e.message });
  }
});

/* =========================
   6.5) RETURN PAYMEE (PUBLIC)
   ✅ AJOUTÉ : éviter boucle /payment-status
   ========================= */
app.get("/payment-status", (req, res) => {
  const { pid, sandbox, payment_token, transaction } = req.query;
  const FRONT_LOCAL_URL = "http://localhost:5181";

  const redirectUrl =
    `${FRONT_LOCAL_URL}/payment-status?pid=${pid || ""}` +
    (sandbox ? `&sandbox=${sandbox}` : "") +
    (payment_token ? `&payment_token=${payment_token}` : "") +
    (transaction ? `&transaction=${transaction}` : "");

  return res.redirect(302, redirectUrl);
});

/* =========================
   7) PROXY VERS VITE
   (pour /, etc.)
   ✅ MODIFIÉ : on exclut /payment-status
   ========================= */
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();

  // ✅ ne pas proxifier /payment-status sinon boucle
  if (req.path.startsWith("/payment-status")) return next();

  return createProxyMiddleware({
    target: "http://localhost:5181",
    changeOrigin: true,
    ws: true,
  })(req, res, next);
});

/* =========================
   8) START SERVER
   ========================= */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Paymee backend running on port", PORT);
});
