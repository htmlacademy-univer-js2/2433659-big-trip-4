import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render, RenderPosition } from './render.js';

const bodyElement = document.querySelector('body');
const tripInfoElement = bodyElement.querySelector('.trip-main');
const filterElement = bodyElement.querySelector('.trip-controls__filters');
const eventListElement = bodyElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  container: eventListElement
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement);
render(new SortView(), eventListElement);

boardPresenter.init();
