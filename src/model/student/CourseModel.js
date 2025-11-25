export default class CourseModel {
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromJson(id, data) {
    return new CourseModel({
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
