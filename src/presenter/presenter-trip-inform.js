import { RenderPosition, remove, render, replace } from '../framework/render.js';
import { getTotalCost, getRouteOfTrip, getDatesOfTrip } from '../utils/utils-trip-inform.js';
import TripInformView from '../view/view-trip-inform.js';

export default class TripInformPresenter {

  #pointsOfModel = null;
  #modelOfDestinations = null;
  #offersOfModel = null;
  #container = null;
  #tripInformElement = null;

  constructor({ container, pointsOfModel, modelOfDestinations, offersOfModel }) {
    this.#container = container;
    this.#pointsOfModel = pointsOfModel;
    this.#modelOfDestinations = modelOfDestinations;
    this.#offersOfModel = offersOfModel;
  }

  init() {
    this.#renderTripInform();
    this.#pointsOfModel.addObserver(this.#handleModelChange);
  }

  #renderTripInform = () => {
    const points = this.#pointsOfModel.getAll();
    const destinations = this.#modelOfDestinations.getAll();
    const offers = this.#offersOfModel.getAll();
    const preTripInformElement = this.#tripInformElement;
    this.#tripInformElement = new TripInformView({
      route: getRouteOfTrip(points, destinations),
      dates: getDatesOfTrip(points),
      cost: getTotalCost(points, offers),
      isEmpty: !points.length,
    });

    if (!preTripInformElement) {
      render(
        this.#tripInformElement,
        this.#container,
        RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this.#tripInformElement, preTripInformElement);
    remove(preTripInformElement);
  };

  #handleModelChange = () => {
    this.#renderTripInform();
  };
}
