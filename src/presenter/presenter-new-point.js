import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, EditType } from '../constants.js';
import PointEditView from '../view/view-point-edit.js';

export default class NewPointOfPresenter {
  #container;
  #modelOfDestinations;
  #offersOfModel;
  #handleDataChange;
  #handleDestroy;
  #newPointElement = null;

  constructor({
    container,
    modelOfDestinations,
    offersOfModel,
    onDataChange,
    onDestroy,
  }) {
    this.#container = container;
    this.#modelOfDestinations = modelOfDestinations;
    this.#offersOfModel = offersOfModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#newPointElement !== null) {
      return;
    }
    this.#newPointElement = new PointEditView({
      destinations: this.#modelOfDestinations.getAll(),
      offers: this.#offersOfModel.getAll(),
      onSubmiClick: this.#onFormSubmit,
      onCloseEditPoint: this.#onFormClose,
      pointType: EditType.CREATING
    });

    render(this.#newPointElement, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeydownDocument);
  }

  destroy = ({ isCanceled = true } = {}) => {
    if (!this.#newPointElement) {
      return;
    }
    remove(this.#newPointElement);
    this.#newPointElement = null;
    document.removeEventListener('keydown', this.#onEscKeydownDocument);

    this.#handleDestroy({ isCanceled });
  };

  #onFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  setSaving = () => {
    this.#newPointElement.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting() {
    const resetFormState = () => {
      this.#newPointElement.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointElement.shake(resetFormState);
  }

  #onFormClose = () => {
    this.destroy();
  };

  #onEscKeydownDocument = (evt) => {
    if (evt.keyCode === 27 || evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
