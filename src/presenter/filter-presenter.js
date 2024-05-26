import { remove, replace, render } from '../framework/render.js';
import { TypeOfFilter, TypeOfUpdate } from '../mock/const.js';
import { filter } from '../utils/filter';
import FilterView from '../view/filter-view.js';


export default class FilterPresenter {
  #filterContainer = null;
  #modelOfFilter = null;
  #modelOfPoints = null;
  #filterComponent = null;

  constructor(filterContainer, modelOfFilter, modelOfPoints) {
    this.#filterContainer = filterContainer;
    this.#modelOfFilter = modelOfFilter;
    this.#modelOfPoints = modelOfPoints;
    this.#modelOfPoints.addObserver(this.#handleModelEvent);
    this.#modelOfFilter.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#modelOfPoints.points;

    return [
      {
        type: TypeOfFilter.EVERYTHING,
        name: 'EVERYTHING',
        count: filter[TypeOfFilter.EVERYTHING](points).length,
      },
      {
        type: TypeOfFilter.PAST,
        name: 'PAST',
        count: filter[TypeOfFilter.PAST](points).length,
      },
      {
        type: TypeOfFilter.FUTURE,
        name: 'FUTURE',
        count: filter[TypeOfFilter.FUTURE](points).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#modelOfFilter.filter);
    this.#filterComponent.setTypeOfFilterChangeHandler(this.#handleTypeOfFilterChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleTypeOfFilterChange = (TypeOfFilter) => {
    if (this.#modelOfFilter.filter === TypeOfFilter) {
      return;
    }

    this.#modelOfFilter.setFilter(TypeOfUpdate.MAJOR, TypeOfFilter);
  };
}
