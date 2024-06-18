export default class ModelOfDestinations {
  #service;
  #destination;

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#destination = await this.#service.getDestinations();
    return this.#destination;
  }

  getAll() {
    return this.#destination;
  }

  getById(id) {
    return this.#destination.find((destination) => destination.id === id);
  }
}
