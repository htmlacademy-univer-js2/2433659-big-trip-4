import PointEditView from '../view/view-point-edit.js';
import PointView from '../view/view-point.js';
import {render,replace,remove } from '../framework/render.js';
import { Mode, EditType } from '../constants.js';
import { isMinorUpdate } from '../utils/common.js';
import {UpdateType, UserAction} from '../constants.js';


export default class PointOfPresenter {

  #container;
  #modelOfDestinations;
  #offersOfModel;
  #pointElement;
  #editPointElement;
  #point = null;
  #onPointsChangeHandler;
  #handleModeChange;
  #mode = Mode.DEFAULT;

  constructor({
    container,
    modelOfDestinations,
    offersOfModel,
    onPointsChange,
    handleModeChange
  })
  {
    this.#container = container;
    this.#modelOfDestinations = modelOfDestinations;
    this.#offersOfModel = offersOfModel;
    this.#onPointsChangeHandler = onPointsChange;
    this.#handleModeChange = handleModeChange;
  }

  init(point) {
    this.#point = point;

    const prePointElement = this.#pointElement;
    const preEditPointElement = this.#editPointElement;
    this.#pointElement = new PointView({
      point: this.#point,
      pointDestination: this.#modelOfDestinations.getById(point.destination),
      pointOffers: this.#offersOfModel.getByType(point.type),
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#editPointElement = new PointEditView({
      point: this.#point,
      destinations: this.#modelOfDestinations.getAll(),
      offers: this.#offersOfModel.getAll(),
      onCloseEditPoint: this.#onCloseEditClick,
      onSubmiClick: this.#formSubmitHandler,
      onDeleteClick: this.#onEditPointDelete,
      pointType: EditType.EDITING
    });

    if(!preEditPointElement || !prePointElement){
      render(this.#pointElement, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointElement, prePointElement);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointElement, preEditPointElement);
    }


    remove(preEditPointElement);
    remove(prePointElement);
  }

  #onEditClick = () =>{
    this.#replaceToForm();
  };

  #onCloseEditClick = () => {
    if (!this.#editPointElement.isDisabled) {
      this.#editPointElement.reset(this.#point);
      this.#replaceToPoint();
    }
  };

  #escKeydown = (evt) => {
    if (evt.keyCode === 27 || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceToPoint();
    }
  };

  #replaceToForm = () => {
    replace(this.#editPointElement, this.#pointElement);
    document.addEventListener('keydown', this.#escKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceToPoint = () => {
    replace(this.#pointElement, this.#editPointElement);
    document.removeEventListener('keydown', this.#escKeydown);
    this.#mode = Mode.DEFAULT;
  };

  setSaving = () => {
    if(this.#mode === Mode.EDITING){
      this.#editPointElement.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setAborting = () => {
    if(this.#mode === Mode.DEFAULT){
      this.#pointElement.shake();
    }
    else {
      this.#editPointElement.shake(this.#resetFormState);
    }
  };

  resetView = () =>{
    if(this.#mode !== Mode.DEFAULT){
      this.#editPointElement.reset(this.#point);
      this.#replaceToPoint();
    }
  };

  setDeleting = () => {
    this.#editPointElement.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  };

  #resetFormState = () => {
    this.#editPointElement.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  };

  destroy = () => {
    remove(this.#editPointElement);
    remove(this.#pointElement);
  };

  #favoriteClickHandler = () =>{
    this.#onPointsChangeHandler(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
  };

  #formSubmitHandler = (point) => {
    const isMinor = isMinorUpdate(point, this.#point);
    this.#onPointsChangeHandler(
      UserAction.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      point
    );
  };

  #onEditPointDelete = (point) =>{

    this.#onPointsChangeHandler(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
