export default class PromoModel {
  constructor({ id, code, discount }) {
    this.id = id;
    this.code = code;
    this.discount = discount;
  }

  static fromJson(id, data) {
    return new PromoModel({
      id,
      code: data.code,
      discount: data.discount,
    });
  }

  toJson() {
    return {
      code: this.code,
      discount: this.discount,
    };
  }
}
