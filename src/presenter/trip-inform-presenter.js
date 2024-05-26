import { render, remove } from '../framework/render.js';
import TripInformView from '../view/trip-inform-view.js';

export default class TripInformPresenter {
  #points = null;
  #tripInformComponent = null;
  #tripInformContainer = null;
  #modelOfDestinations = null;
  #modelOfOffers = null;
  #destinations = null;
  #offers = null;

  constructor(tripInformContainer, modelOfDestinations, modelOfOffers) {
    this.#tripInformContainer = tripInformContainer;
    this.#modelOfDestinations = modelOfDestinations;
    this.#modelOfOffers = modelOfOffers;
  }

  init = (points) => {
    this.#points = points;
    this.#destinations = [...this.#modelOfDestinations.destinations];
    this.#offers = [...this.#modelOfOffers.offers];

    this.#tripInformComponent = new TripInformView(this.#points, this.#destinations, this.#offers);

    render(this.#tripInformComponent, this.#tripInformContainer);
  };

  destroy = () => {
    remove(this.#tripInformComponent);
  };
}
