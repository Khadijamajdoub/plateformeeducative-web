/**
 * Paymee Sandbox + Firestore (Firebase Functions v2)
 */

const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall, onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions"); // ✅ pour functions.config()
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ maxInstances: 10 });

/**
 * ✅ Utils config
 */
function getPaymeeConfig() {
  // 1) priorité aux env (si un jour tu migres vers dotenv)
  const envKey = process.env.PAYMEE_KEY;
  const envMode = process.env.PAYMEE_ENV;

  // 2) fallback vers functions.config() (ce que tu utilises maintenant)
  const cfg = functions.config?.() || {};
  const cfgKey = cfg.paymee?.key;
  const cfgEnv = cfg.paymee?.env;

  const apiKey = envKey || cfgKey;
  const mode = (envMode || cfgEnv || "sandbox").toLowerCase();

  if (!apiKey) throw new Error("PAYMEE key missing in Firebase config");

  const base =
    mode === "prod" || mode === "production"
      ? "https://app.paymee.tn"
      : "https://sandbox.paymee.tn";

  return { apiKey, base, mode };
}

/**
 * 1) ✅ Callable Function
 * React -> Firebase Function -> Paymee Sandbox
 *
 * Ton front l'appelle via httpsCallable("createPaymeePayment")
 */
exports.createPaymeePayment = onCall(async (request) => {
  const { apiKey, base } = getPaymeeConfig();

  const payload = request.data; // ce que tu envoies depuis React

  // sécurité: payload minimal (tu peux ajouter d'autres checks)
  if (!payload?.amount || !payload?.return_url || !payload?.cancel_url) {
    throw new Error("Payload Paymee incomplet");
  }

  const url = `${base}/api/v2/payments/create`;

  const res = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
  });

  const raw = res.data;

  if (raw?.status === false) {
    throw new Error(raw?.message || "Paymee create failed");
  }

  // Paymee renvoie souvent {status:true, data:{...}}
  return raw?.data || raw;
});

/**
 * 2) ✅ Webhook HTTP
 * Paymee -> Firebase Function -> Firestore
 *
 * URL à donner à Paymee :
 * https://<region>-<project>.cloudfunctions.net/paymeeWebhook
 */
exports.paymeeWebhook = onRequest(async (req, res) => {
  try {
    const { apiKey } = getPaymeeConfig();

    const { token, payment_status, order_id, check_sum } = req.body || {};

    if (!token || payment_status == null || !order_id || !check_sum) {
      return res.status(400).send("Missing webhook fields");
    }

    // ✅ Vérif checksum Paymee (selon ta doc actuelle)
    const raw = token + payment_status + apiKey;
    const md5 = crypto.createHash("md5").update(raw).digest("hex");

    if (md5 !== check_sum) {
      return res.status(400).send("Invalid checksum");
    }

    // ✅ Aligné sur ton front
    const status = Number(payment_status) === 1 ? "SUCCESS" : "FAILED";

    await db.collection("payments").doc(order_id).update({
      status,
      paymeeToken: token,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ✅ Si succès, tu débloques le cours ici (exemple simple)
    if (status === "SUCCESS") {
      await db.collection("tickets").add({
        paymentId: order_id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return res.sendStatus(200);
  } catch (e) {
    console.error("Webhook error:", e.message);
    return res.sendStatus(500);
  }
});
