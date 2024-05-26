import AbstractView from '../framework/view/abstract-view.js';

const createTemplateFilterItem = (filter, currentTypeOfFilter) => {
  const { type, name, count } = filter;

  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}"
    class="trip-filters__filter-input
    visually-hidden" type="radio"
    name="trip-filter"
    value="${type}"
    ${type === currentTypeOfFilter ? 'checked' : ''}
    ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createTemplateFilter = (filterItems, currentTypeOfFilter) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createTemplateFilterItem(filter, currentTypeOfFilter))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentTypeOfFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentTypeOfFilter;
  }

  get template() {
    return createTemplateFilter(this.#filters, this.#currentFilter);
  }

  setTypeOfFilterChangeHandler = (callback) => {
    this._callback.typeOfFilterChange = callback;
    this.element.addEventListener('change', this.#typeOfFilterChangeHandler);
  };

  #typeOfFilterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.typeOfFilterChange(evt.target.value);
  };
}
