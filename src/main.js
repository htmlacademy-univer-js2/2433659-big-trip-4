import { render } from './framework/render.js';
import ModelPoints from './models/points-model.js';
import ModelFilter from './models/filter-model.js';
import ModelOffers from './models/offers-model.js';
import ModelDestinations from './models/destinations-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './models/points-api-service.js';
import { AUTHORIZATION, END_POINT } from './mock/const.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.trip-main');
const newPointButtonComponent = new NewPointButtonView();
const modelPoints = new ModelPoints(new PointsApiService(END_POINT, AUTHORIZATION));
const modelDestinations = new ModelDestinations(new PointsApiService(END_POINT, AUTHORIZATION));
const modelOffers = new ModelOffers(new PointsApiService(END_POINT, AUTHORIZATION));
const modelFilter = new ModelFilter();
const filterPresenter = new FilterPresenter(siteHeaderElement.querySelector('.trip-controls__filters'), modelFilter, modelPoints);
filterPresenter.init();
const tripPresenter = new TripPresenter(siteHeaderElement.querySelector('.trip-main__trip-info'), siteMainElement.querySelector('.trip-events'), modelPoints, modelFilter, modelDestinations, modelOffers);
tripPresenter.init();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

modelOffers.init().finally(() => {
  modelDestinations.init().finally(() => {
    modelPoints.init().finally(() => {
      render(newPointButtonComponent, siteHeaderElement);
      newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
    });
  });
});
