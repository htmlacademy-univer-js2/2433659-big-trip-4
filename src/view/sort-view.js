import AbstractView from '../framework/view/abstract-view.js';
import { TypeOfSort } from '../mock/const.js';

const createTemplateSort = (currentTypeOfSort) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--${TypeOfSort.DAY}">
      <input ${currentTypeOfSort === TypeOfSort.DAY ? 'checked' : ''} id="sort-${TypeOfSort.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${TypeOfSort.DAY}" data-sort-type="${TypeOfSort.DAY}" checked>
        <label class="trip-sort__btn" for="sort-${TypeOfSort.DAY}">Day</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--event">
      <input ${currentTypeOfSort === TypeOfSort.EVENT ? 'checked' : ''} id="sort-${TypeOfSort.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${TypeOfSort.EVENT}" data-sort-type=${TypeOfSort.EVENT} disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--${TypeOfSort.TIME}">
      <input ${currentTypeOfSort === TypeOfSort.TIME ? 'checked' : ''} id="sort-${TypeOfSort.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${TypeOfSort.TIME}" data-sort-type="${TypeOfSort.TIME}">
        <label class="trip-sort__btn" for="sort-${TypeOfSort.TIME}">Time</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--${TypeOfSort.PRICE}">
      <input ${currentTypeOfSort === TypeOfSort.PRICE ? 'checked' : ''} id="sort-${TypeOfSort.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${TypeOfSort.PRICE}" data-sort-type="${TypeOfSort.PRICE}">
        <label class="trip-sort__btn" for="sort-${TypeOfSort.PRICE}">Price</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--offer">
      <input ${currentTypeOfSort === TypeOfSort.OFFER ? 'checked' : ''} id="sort-${TypeOfSort.OFFER}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${TypeOfSort.OFFER}" data-sort-type=${TypeOfSort.OFFER} disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
);

export default class SortView extends AbstractView {
  #currentTypeOfSort = null;

  constructor(currentTypeOfSort) {
    super();
    this.#currentTypeOfSort = currentTypeOfSort;
  }

  get template() {
    return createTemplateSort(this.#currentTypeOfSort);
  }

  setTypeOfSortChangeHandler = (callback) => {
    this._callback.typeOfSortChange = callback;

    this.element.addEventListener('click', this.#typeOfSortChangeHandler);
  };

  #typeOfSortChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.typeOfSortChange(evt.target.dataset.typeOfSort);
  };

}
