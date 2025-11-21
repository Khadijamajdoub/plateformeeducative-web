export default class StudentModel {
  constructor({ id, name, email, cvUrl }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cvUrl = cvUrl || null;
  }

  static fromJson(id, data) {
    return new StudentModel({
      id,
      name: data.name,
      email: data.email,
      cvUrl: data.cvUrl,
    });
  }

  toJson() {
    return {
      name: this.name,
      email: this.email,
      cvUrl: this.cvUrl,
    };
  }
}
