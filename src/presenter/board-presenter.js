import { render, PositionOfRender, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventsView from '../view/trip-events-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './new-point-presenter.js';
import { TypeOfSort, TypeOfFilter, UserAction, TypeOfUpdate, Time, TypeOfUpdateLimit } from '../mock/const.js';
import { sorting } from '../utils/sorting.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInformPresenter from './trip-inform-presenter.js';
import ErrorServerView from '../view/error-server-view.js';

export default class TripPresenter {
  #tripInformContainer = null;
  #tripContainer = null;
  #modelOfPoints = null;
  #modelOfFilter = null;
  #modelOfDestinations = null;
  #modelOfOffers = null;

  #currentTypeOfSort = TypeOfSort.DAY;
  #typeOfFilter = TypeOfFilter.EVERYTHING;

  #pointsListComponent = new TripEventsView();
  #sortComponent = null;
  #noPointComponent = null;
  #loadingComponent = new LoadingView();
  #errorServer = new ErrorServerView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #isLoading = true;
  #tripInformPresenter = null;

  #uiBlocker = new UiBlocker(LimitOfTime.LOWER_LIMIT, LimitOfTime.UPPER_LIMIT);

  constructor(tripInformContainer, tripContainer, modelOfPoints, modelOfFilter, modelOfDestinations, modelOfOffers) {
    this.#tripInformContainer = tripInformContainer;
    this.#tripContainer = tripContainer;
    this.#modelOfPoints = modelOfPoints;
    this.#modelOfFilter = modelOfFilter;
    this.#modelOfDestinations = modelOfDestinations;
    this.#modelOfOffers = modelOfOffers;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointsListComponent.element, this.#handleViewAction, this.#modelOfDestinations, this.#modelOfOffers);

    this.#modelOfDestinations.addObserver(this.#handleModelEvent);
    this.#modelOfOffers.addObserver(this.#handleModelEvent);
    this.#modelOfPoints.addObserver(this.#handleModelEvent);
    this.#modelOfFilter.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    this.#typeOfFilter = this.#modelOfFilter.filter;
    const filteredPoints = filter[this.#typeOfFilter](this.#modelOfPoints.points);
    sorting[this.#currentTypeOfSort](filteredPoints);

    return filteredPoints;
  }

  createPoint = (callback) => {
    this.#currentTypeOfSort = TypeOfSort.DAY;
    this.#modelOfFilter.setFilter(TypeOfUpdate.MAJOR, TypeOfFilter.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#modelOfOffers.offers.length === 0 || this.#modelOfDestinations.destinations.length === 0) {
      this.#renderErrorServer();
      return;
    }

    const pointCount = this.points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList(this.points);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentTypeOfSort);

    this.#sortComponent.setTypeOfSortChangeHandler(this.#handleTypeOfSortChange);
    render(this.#sortComponent, this.#tripContainer, PositionOfRender.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#typeOfFilter);
    render(this.#noPointComponent, this.#tripContainer, PositionOfRender.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(
      this.#pointsListComponent.element, this.#handleViewAction, this.#handleModeChange, this.#modelOfDestinations, this.#modelOfOffers
    );

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderPointList = (points) => {
    render(this.#pointsListComponent, this.#tripContainer);
    this.#renderPoints(points);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, PositionOfRender.AFTERBEGIN);
  };

  #renderTripInform = () => {
    this.#tripInformPresenter = new TripInformPresenter(this.#tripInformContainer, this.#modelOfDestinations, this.#modelOfOffers);
    const sortedPoints = sorting[TypeOfSort.DAY](this.points);
    this.#tripInformPresenter.init(sortedPoints);
  };

  #renderErrorServer = () => {
    render(this.#errorServer, this.#tripContainer, PositionOfRender.AFTERBEGIN);
  };

  #clearTripInform = () => {
    this.#tripInformPresenter.destroy();
  };

  #clearAll = ({ resetTypeOfSort = false } = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetTypeOfSort) {
      this.#currentTypeOfSort = TypeOfSort.DAY;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleTypeOfSortChange = (TypeOfSort) => {
    if (this.#currentTypeOfSort === TypeOfSort) {
      return;
    }

    this.#currentTypeOfSort = TypeOfSort;
    this.#clearAll();
    this.#renderBoard();
  };

  #handleViewAction = async (actionType, typeOfUpdate, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#modelOfPoints.updatePoint(typeOfUpdate, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#modelOfPoints.addPoint(typeOfUpdate, update);
        } catch (err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#modelOfPoints.deletePoint(typeOfUpdate, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (typeOfUpdate, data) => {
    switch (typeOfUpdate) {
      case TypeOfUpdate.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case TypeOfUpdate.MINOR:
        this.#clearAll();
        this.#renderBoard();
        this.#clearTripInform();
        this.#renderTripInform();
        break;
      case TypeOfUpdate.MAJOR:
        this.#clearAll({ resetTypeOfSort: true });
        this.#renderBoard();
        break;
      case TypeOfUpdate.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#noPointComponent);
        this.#renderBoard();
        this.#renderTripInform();
        break;
    }
  };

}
