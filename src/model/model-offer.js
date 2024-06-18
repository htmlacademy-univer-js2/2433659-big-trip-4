export default class OffersOfModel {
  #offer;
  #service;

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#offer = await this.#service.getOffers();
    return this.#offer;
  }

  getAll() {
    return this.#offer;
  }

  getByType(type) {
    return this.#offer.find((offer) => offer.type === type);
  }
}
