export default class UserModel {
  constructor({ id, name, email, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role || "student";
  }

  static fromJson(id, data) {
    return new UserModel({
      id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  }

  toJson() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
