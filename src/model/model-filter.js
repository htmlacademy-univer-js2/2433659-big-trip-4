import Observable from '../framework/observable.js';
import {FilterTypes} from '../constants.js';

export default class FilterOfModel extends Observable {
  #filter = FilterTypes.EVERYTHING;
  get() {
    return this.#filter;
  }

  set(updteType, update){
    this.#filter = update;
    this._notify(updteType, update);
  }
}
