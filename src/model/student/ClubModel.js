export default class ClubModel {
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromJson(id, data) {
    return new ClubModel({
      id,
      name: data.name,
      description: data.description,
    });
  }

  toJson() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}
