import { render } from './framework/render.js';
import ModelOfPoints from './models/points-model.js';
import ModelOfFilter from './models/filter-model.js';
import ModelOfOffers from './models/offers-model.js';
import ModelOfDestinations from './models/destinations-model.js';
import TripPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './models/points-api-service.js';
import { AUTHORIZATION, END_POINT } from './mock/const.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.trip-main');
const newPointButtonComponent = new NewPointButtonView();
const modelOfPoints = new ModelOfPoints(new PointsApiService(END_POINT, AUTHORIZATION));
const modelOfDestinations = new ModelOfDestinations(new PointsApiService(END_POINT, AUTHORIZATION));
const modelOfOffers = new ModelOfOffers(new PointsApiService(END_POINT, AUTHORIZATION));
const modelOfFilter = new ModelOfFilter();
const filterPresenter = new FilterPresenter(siteHeaderElement.querySelector('.trip-controls__filters'), modelOfFilter, modelOfPoints);
filterPresenter.init();
const tripPresenter = new TripPresenter(siteHeaderElement.querySelector('.trip-main__trip-info'), siteMainElement.querySelector('.trip-events'), modelOfPoints, modelOfFilter, modelOfDestinations, modelOfOffers);
tripPresenter.init();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

modelOfOffers.init().finally(() => {
  modelOfDestinations.init().finally(() => {
    modelOfPoints.init().finally(() => {
      render(newPointButtonComponent, siteHeaderElement);
      newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
    });
  });
});
