export default class CourseModel {
  constructor({ id, title, description, price }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
  }

  static fromJson(id, data) {
    return new CourseModel({
      id,
      title: data.title,
      description: data.description,
      price: data.price,
    });
  }

  toJson() {
    return {
      title: this.title,
      description: this.description,
      price: this.price,
    };
  }
}
