import EventListView from '../view/view-event-list.js';
import EmptyView from '../view/view-empty.js';
import ErrorView from '../view/view-error.js';
import PointOfPresenter from './presenter-point.js';
import NewPointOfPresenter from './presenter-new-point.js';
import SortPresenter from './presenter-sort.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import { filter, sort } from '../utils/common.js';
import LoadingView from '../view/view-load.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {FilterTypes, PointSorts, UpdateType, UserAction} from '../constants.js';

const LimitOfTime = {
  MIN: 350,
  MAX: 1000,
};

export default class BoardPresenter {
  #sortPresenter = null;
  #emptyListElement = null;
  #loadingElement = new LoadingView();
  #eventListElement = new EventListView();
  #errorElement = new ErrorView();
  #pointOfPresenters = new Map();
  #modelOfDestinations;
  #offersOfModel;
  #filterOfModel;
  #pointsOfModel;
  #newPointButtonPresenter;
  #currentSortType = PointSorts.DAY;
  #isCreating = false;
  #container;
  #isLoading = true;
  #isError = false;
  #newPointOfPresenter;
  #uiBlocker = new UiBlocker({
    lowerLimit: LimitOfTime.LOWER_LIMIT,
    upperLimit: LimitOfTime.UPPER_LIMIT
  });

  constructor({container, modelOfDestinations, offersOfModel, pointsOfModel, filterOfModel, newPointButtonPresenter}) {
    this.#container = container;
    this.#modelOfDestinations = modelOfDestinations;
    this.#offersOfModel = offersOfModel;
    this.#pointsOfModel = pointsOfModel;
    this.#filterOfModel = filterOfModel;
    this.#newPointButtonPresenter = newPointButtonPresenter;

    this.#newPointOfPresenter = new NewPointOfPresenter({
      container: this.#eventListElement.element,
      modelOfDestinations: this.#modelOfDestinations,
      offersOfModel: this.#offersOfModel,
      onDataChange: this.#onPointChangeHandler,
      onDestroy: this.#handleNewPointDestroy
    });

    this.#pointsOfModel.addObserver(this.#modelEventHandler);
    this.#filterOfModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    const filterType = this.#filterOfModel.get();
    const filteredPoints = filter[filterType](this.#pointsOfModel.getAll());

    return sort(filteredPoints, this.#currentSortType);
  }

  init(){
    this.#renderBoard();
  }

  #renderBoard = () =>{
    if (this.#isError) {
      this.#renderError();
      this.#clearBoard({ resetSortType: true });
      return;
    }
    if (this.#isLoading) {
      this.#renderLoader();
      return;
    }

    if (!this.points.length && !this.#isCreating) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    render(this.#eventListElement, this.#container);
    this.#renderPointList();
  };

  #renderEmptyList = () => {
    this.#emptyListElement = new EmptyView({
      filterType: this.#filterOfModel.get(),
    });
    render(this.#emptyListElement, this.#container);
  };

  #renderError = () => {
    render(this.#errorElement, this.#container, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#clearTaskList();
    remove(this.#emptyListElement);
    remove(this.#loadingElement);
    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }
    if (resetSortType) {
      this.#currentSortType = PointSorts.DAY;
    }
  };

  #renderPointList = () =>{
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderSort = () =>{
    this.#sortPresenter = new SortPresenter({
      container: this.#container,
      currentSortType: this.#currentSortType,
      handleSortChange: this.#handleSortChange,
    });
    this.#sortPresenter.init();
  };

  #renderLoader = () => {
    render(this.#loadingElement, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderPoint(point){
    const pointOfPresenter = new PointOfPresenter({
      container: this.#eventListElement.element,
      modelOfDestinations: this.#modelOfDestinations,
      offersOfModel: this.#offersOfModel,
      onPointsChange: this.#onPointChangeHandler,
      handleModeChange: this.#handleModeChange
    });
    pointOfPresenter.init(point);
    this.#pointOfPresenters.set(point.id, pointOfPresenter);
  }

  #onPointChangeHandler = async (action, updateType, point) => {
    this.#uiBlocker.block();
    switch (action) {
      case UserAction.ADD_POINT:
        this.#newPointOfPresenter.setSaving();
        try {
          await this.#pointsOfModel.add(updateType, point);
        } catch {
          this.#newPointOfPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointOfPresenters.get(point.id).setSaving();
        try{
          await this.#pointsOfModel.update(updateType, point);
        }
        catch{
          this.#pointOfPresenters.get(point.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointOfPresenters.get(point.id).setDeleting();
        try {
          await this.#pointsOfModel.delete(updateType, point);
        } catch {
          this.#pointOfPresenters.get(point.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #clearTaskList = () => {
    this.#pointOfPresenters.forEach((presenter) => presenter.destroy());
    this.#pointOfPresenters.clear();
    this.#newPointOfPresenter.destroy();
  };

  #handleSortChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearTaskList();
    this.#renderPointList();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        if (data.error) {
          this.#isError = true;
        } else {
          this.#isLoading = false;
          this.#isError = false;
          remove(this.#loadingElement);
        }
        this.#renderBoard();
        break;
      case UpdateType.PATCH:
        this.#pointOfPresenters.get(data.id).init(data);
        this.#pointOfPresenters.get(data.id).resetView();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointOfPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointOfPresenter.destroy();
  };

  handleNewPointClick = () => {
    this.#isCreating = true;
    this.#currentSortType = PointSorts.DAY;
    this.#filterOfModel.set(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointButtonPresenter.disableButton();
    this.#newPointOfPresenter.init();
  };

  #handleNewPointDestroy = ({isCanceled}) => {
    this.#isCreating = false;
    this.#newPointButtonPresenter.enableButton();
    if (!this.points.length && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };
}
