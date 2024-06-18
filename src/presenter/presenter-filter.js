import { UpdateType } from '../constants.js';
import { render, replace, remove } from '../framework/render.js';
import { filter } from '../utils/common.js';
import FilterOfView from '../view/view-filter.js';

export default class FilterOfPresenter {
  #filterElement = null;
  #container = null;
  #pointsOfModel = null;
  #filterOfModel = null;
  #currentFilter = null;

  constructor({ container, pointsOfModel, filterOfModel }) {
    this.#container = container;
    this.#pointsOfModel = pointsOfModel;
    this.#filterOfModel = filterOfModel;

    this.#pointsOfModel.addObserver(this.#handleModelChange);
    this.#filterOfModel.addObserver(this.#handleModelChange);
  }

  get filters() {
    const points = this.#pointsOfModel.getAll();
    return Object.entries(filter)
      .map(([filterType, filterPoints]) => (
        {
          type: filterType,
          isDisabled: filterPoints(points).length === 0,
          isChecked: filterType === this.#currentFilter,
        }));
  }

  init() {
    this.#currentFilter = this.#filterOfModel.get();
    const preFilterElement = this.#filterElement;

    const filters = this.filters;
    this.#filterElement = new FilterOfView({
      items: filters,
      onItemChange: this.#onFilterChange,
    });

    if (!preFilterElement) {
      render(this.#filterElement, this.#container);
      return;
    }

    replace(this.#filterElement, preFilterElement);
    remove(preFilterElement);
  }

  #onFilterChange = (filterType) => {
    this.#filterOfModel.set(UpdateType.MAJOR, filterType);
  };

  #handleModelChange = () => {
    this.init();
  };
}
