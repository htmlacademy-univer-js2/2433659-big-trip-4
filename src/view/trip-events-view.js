import AbstractView from '../framework/view/abstract-view.js';

const createTemplateTripEvents = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripEventsView extends AbstractView {

  get template() {
    return createTemplateTripEvents();
  }
}
