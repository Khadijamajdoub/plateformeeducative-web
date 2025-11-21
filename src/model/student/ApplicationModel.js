export default class ApplicationModel {
  constructor({ id, userId, clubId, cvUrl }) {
    this.id = id;
    this.userId = userId;
    this.clubId = clubId;
    this.cvUrl = cvUrl;
  }

  static fromJson(id, data) {
    return new ApplicationModel({
      id,
      userId: data.userId,
      clubId: data.clubId,
      cvUrl: data.cvUrl,
    });
  }

  toJson() {
    return {
      userId: this.userId,
      clubId: this.clubId,
      cvUrl: this.cvUrl,
    };
  }
}
