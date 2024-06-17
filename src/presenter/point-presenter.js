import { render, replace, remove } from '../framework/render.js';
import WaypointView from '../view/way-point-view.js';
import EditFormView from '../view/create-form-view.js';
import { isEscKeyDown } from '../utils/common.js';
import { Mode, TypeOfUpdate, UserAction } from '../mock/const.js';

export default class PointPresenter {

  #point = null;
  #mode = Mode.DEFAULT;
  #containerOfPointsList = null;
  #changeData = null;
  #changeMode = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #modelOfDestinations = null;
  #modelOfOffers = null;
  #destinations = null;
  #offers = null;

  constructor(containerOfPointsList, changeData, changeMode, modelOfDestinations, modelOfOffers) {
    this.#containerOfPointsList = containerOfPointsList;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#modelOfDestinations = modelOfDestinations;
    this.#modelOfOffers = modelOfOffers;
  }

  init = (point) => {
    this.#point = point;
    this.#destinations = [...this.#modelOfDestinations.destinations];
    this.#offers = [...this.#modelOfOffers.offers];

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new WaypointView(point, this.#destinations, this.#offers);
    this.#pointEditComponent = new EditFormView({
      point,
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: false
    });

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseClick);

    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#containerOfPointsList);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointComponent.shake("hello");
    } else {
      this.#pointComponent.shake();
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (isEscKeyDown(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      TypeOfUpdate.MINOR,
      point,
    );
  };

  #handleCloseClick = () => {
    this.resetView();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      TypeOfUpdate.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      TypeOfUpdate.MINOR,
      point,
    );
  };

}
