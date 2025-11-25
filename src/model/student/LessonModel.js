// src/model/student/LessonModel.js

export default class LessonModel {
  constructor({ id, type, title, content, videoUrl, pdfUrl }) {
    this.id = id;
    this.type = type; // "video" | "pdf" | "text"
    this.title = title;
    this.content = content ?? "";
    this.videoUrl = videoUrl ?? null;
    this.pdfUrl = pdfUrl ?? null;
  }

  static fromJson(id, data) {
    return new LessonModel({
      id,
      type: data.type,
      title: data.title,
      content: data.content,
      videoUrl: data.videoUrl,
      pdfUrl: data.pdfUrl,
    });
  }
}
