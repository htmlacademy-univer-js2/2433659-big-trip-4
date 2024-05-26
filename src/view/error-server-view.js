import AbstractView from '../framework/view/abstract-view.js';

const createTemplateErrorServer = () => (
  `<p class="trip-events__msg">
  Error loading data, try again later.
  </p>`);

export default class ErrorServerView extends AbstractView {
  get template() {
    return createTemplateErrorServer();
  }
}
