import BoardPresenter from './presenter/presenter-board.js';
import ModelOfDestinations from './model/model-destination.js';
import OffersOfModel from './model/model-offer.js';
import PointsOfModel from './model/model-point.js';
import TripInformPresenter from './presenter/presenter-trip-inform.js';
import PointsApiService from './service/service-points-api.js';
import FilterOfModel from './model/model-filter.js';
import FilterOfPresenter from './presenter/presenter-filter.js';
import NewPointButtonPresenter from './presenter/presenter-new-point-button.js';


const siteMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic AEKr7bwEH2vHDsFM';
const service = new PointsApiService(END_POINT, AUTHORIZATION);
const modelOfDestinations = new ModelOfDestinations(service);
const offersOfModel = new OffersOfModel(service);
const pointsOfModel = new PointsOfModel({service : service, modelOfDestinations : modelOfDestinations, offersOfModel: offersOfModel});
const filterOfModel = new FilterOfModel();

const newPointButtonPresenter = new NewPointButtonPresenter({
  container: siteMainContainer
});

const tripInformPresenter = new TripInformPresenter({
  container: siteMainContainer,
  pointsOfModel,
  modelOfDestinations,
  offersOfModel,
});

const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  modelOfDestinations,
  offersOfModel,
  pointsOfModel,
  filterOfModel,
  newPointButtonPresenter
});

const filterOfPresenter = new FilterOfPresenter({
  container: filterContainer,
  pointsOfModel,
  filterOfModel,
});

pointsOfModel.init();
filterOfPresenter.init();
boardPresenter.init();
newPointButtonPresenter.init({
  onButtonClick:boardPresenter.handleNewPointClick
});
tripInformPresenter.init();
