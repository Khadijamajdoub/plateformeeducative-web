export default class VisitorModel {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  static fromJson(id, data) {
    return new VisitorModel({
      id,
      name: data.name,
    });
  }

  toJson() {
    return {
      name: this.name,
    };
  }
}
