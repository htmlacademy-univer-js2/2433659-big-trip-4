import Observable from '../framework/observable.js';
import { updateItem } from '../utils/common.js';
import {UpdateType} from '../constants.js';
import { adaptToClient, adaptToServer } from '../utils/adapter.js';

export default class PointsModel extends Observable {
  #point = [];
  #service;
  #modelOfDestinations;
  #offersOfModel;

  constructor({service, modelOfDestinations, offersOfModel}) {
    super();
    this.#service = service;
    this.#modelOfDestinations = modelOfDestinations;
    this.#offersOfModel = offersOfModel;
  }

  async init() {
    try {

      await Promise.all([
        this.#modelOfDestinations.init(),
        this.#offersOfModel.init(),
      ]);
      const points = await this.#service.getPoints();
      this.#point = points.map(adaptToClient);
      this._notify(UpdateType.INIT, {isError : false});
    } catch (error) {

      this.#point = [];
      this._notify(UpdateType.INIT, {isError : true, error });
    }
  }

  getAll() {
    return this.#point;
  }

  getById(id) {
    return this.#point.find((point) => point.id === id);
  }

  async add(type, point) {
    try {
      const adaptedToServerPoint = adaptToServer(point);
      const newPoint = await this.#service.addPoint(adaptedToServerPoint);
      const adaptedToClientPoint = adaptToClient(newPoint);

      this.#point.push(adaptedToClientPoint);
      this._notify(type, adaptedToClientPoint);
    } catch {
      throw new Error('Can\'t add point');
    }
  }

  async update(type, point) {
    try{
      const updatedPoint = await this.#service.updatePoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(updatedPoint);
      this.#point = updateItem(this.#point, adaptedPoint);
      this._notify(type, adaptedPoint);
    }
    catch {
      throw new Error('Can\'t update point');
    }
  }

  async delete(type, deletedPoint) {
    try {
      const adaptedToServerPoint = adaptToServer(deletedPoint);
      await this.#service.deletePoint(adaptedToServerPoint);
      this.#point = this.#point.filter((point) => point.id !== deletedPoint.id);
      this._notify(type);
    } catch {
      throw new Error('Can\'t delete point');
    }
  }
}
