import Observable from '../framework/observable.js';
import { TypeOfFilter } from '../mock/const.js';

export default class ModelOfFilter extends Observable {
  #filter = TypeOfFilter.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter = (typeOfSort, filter) => {
    this.#filter = filter;
    this._notify(typeOfSort, filter);
  };
}
