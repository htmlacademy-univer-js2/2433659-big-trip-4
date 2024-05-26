import AbstractView from '../framework/view/abstract-view.js';
import { TypeOfFilter } from '../mock/const.js';

const NoPointsTextType = {
  [TypeOfFilter.EVERYTHING]: 'Click New Event to create your first point',
  [TypeOfFilter.PAST]: 'There are no past events now',
  [TypeOfFilter.FUTURE]: 'There are no future events now',
};

const createTemplateNoPoint = (typeOfFilter) => {
  const noTaskTextValue = NoPointsTextType[typeOfFilter];

  return (
    `<p class="trip-events__msg">${noTaskTextValue}</p>`
  );
};

export default class NoPointView extends AbstractView {
  #typeOfFilter = null;

  constructor(typeOfFilter) {
    super();
    this.#typeOfFilter = typeOfFilter;
  }

  get template() {
    return createTemplateNoPoint(this.#typeOfFilter);
  }

}
