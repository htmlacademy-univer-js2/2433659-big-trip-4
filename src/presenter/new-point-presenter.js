import { render, remove, PositionOfRender } from '../framework/render.js';
import EditFormView from '../view/create-form-view.js';
import { isEscKeyDown } from '../utils/common.js';
import { TypeOfUpdate, UserAction } from '../mock/const.js';

export default class PointNewPresenter {

  #containerOfPointsList = null;
  #changeData = null;
  #destroyCallback = null;
  #pointEditComponent = null;
  #modelOfDestinations = null;
  #modelOfOffers = null;
  #destinations = null;
  #offers = null;

  constructor(containerOfPointsList, changeData, modelOfDestinations, modelOfOffers) {
    this.#containerOfPointsList = containerOfPointsList;
    this.#changeData = changeData;
    this.#modelOfDestinations = modelOfDestinations;
    this.#modelOfOffers = modelOfOffers;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#destinations = [...this.#modelOfDestinations.destinations];
    this.#offers = [...this.#modelOfOffers.offers];

    this.#pointEditComponent = new EditFormView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#containerOfPointsList, PositionOfRender.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#destroyCallback();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #onEscKeyDown = (evt) => {
    if (isEscKeyDown(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      TypeOfUpdate.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}
