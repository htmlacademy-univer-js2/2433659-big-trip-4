import { POINT_EMPTY, TYPES,EditType, ButtonLabel } from '../constants.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {formatToSlashDate, title} from '../utils/common.js';
import CalendarView from './view-calendar.js';
import he from 'he';

function createTypesElements(typeArray, selectedType){

  let typesElements = '';
  typeArray.forEach((type) => {
    const checked = selectedType === type ? 'checked' : '';
    typesElements += `<div class="event__type-item">
  <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
  <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-1">${title(type)}</label>
</div>`;
  });

  return typesElements;

}

function createDestinationPhotos(pointDestination){
  let photos = '<div class="event__photos-tape">';
  pointDestination?.pictures.forEach((picture) =>{
    photos += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return `${photos}</div>`;
}

function createDestinationList(destinations){
  let dataset = '<datalist id="destination-list-1">';
  destinations.forEach((destination) =>{
    dataset += `<option value="${destination.name}"></option>`;
  });
  return `${dataset}</datalist>`;

}

function createOfferSelector(pointOffers, offersArray){
  let offersElements = `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">`;

  offersArray?.forEach((offer) => {
    const checked = pointOffers.some((offerId) => offerId === offer.id) ? 'checked' : '';
    offersElements += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-${offer.id}" type="checkbox" name="event-offer-meal" ${checked}>
      <label class="event__offer-label" for="event-offer-meal-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });

  offersElements += '</div></section>';

  return offersElements;
}
function createSaveButton({isDisabled, isSaving}) {
  const saveLabel = isSaving ? ButtonLabel.SAVE_IN_PROGRESS : ButtonLabel.SAVE;
  return `<button class="event__save-btn  btn  btn--blue" ${(isDisabled) ? 'disabled' : ''} type="submit">${saveLabel}</button>`;
}

function createDeleteButton({isDisabled, type, isDeleting}){

  let label = type === EditType.CREATING ? ButtonLabel.CANCEL : ButtonLabel.DELETE;
  if(label === ButtonLabel.DELETE && isDeleting){
    label = ButtonLabel.DELETE_IN_PROGRESS;
  }
  return `<button class="event__reset-btn" type="reset" ${(isDisabled) ? 'disabled' : ''}>${label}</button>`;
}

function createRollupButton(){
  return `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
</button>`;
}

function createPointControls({type, isDeleting, isSaving, isDisabled}){
  return `${createSaveButton({isSaving, isDisabled})}
  ${createDeleteButton({type, isDeleting})}
  ${type === EditType.CREATING ? '' : createRollupButton()}`;
}

function createPointEditElement({state, destinations, offers, pointType}) {
  const { point, isDeleting, isDisabled, isSaving } = state;
  const pointDestination = destinations.find((destination) => destination.id === point.destination);
  const pointOffers = offers.find((subOffers) => subOffers.type === point.type)?.offers;
  const name = pointDestination === undefined ? '' : he.encode(pointDestination.name);

  const {basePrice} = point;
  const type = point.type;
  const dateFrom = point.dateFrom === null ? '' : formatToSlashDate(point.dateFrom);
  const dateTo = point.dateTo === null ? '' : formatToSlashDate(point.dateTo);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createTypesElements(TYPES, type)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${title(type)}
          </label>

          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" ${(isDisabled) ? 'disabled' : ''} value="${name}" list="destination-list-1">
          ${createDestinationList(destinations)}
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input ${(isDisabled) ? 'disabled' : ''} event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input ${(isDisabled) ? 'disabled' : ''} event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input ${(isDisabled) ? 'disabled' : ''} event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
        </div>
        ${createPointControls({type : pointType, isDeleting: isDeleting, isDisabled: isDisabled, isSaving: isSaving})}
      </header>
      <section class="event__details">
      ${createOfferSelector(point?.offers, pointOffers)}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination === undefined ? '' : pointDestination.description}</p>
          <div class="event__photos-container">
          ${createDestinationPhotos(pointDestination)}
          </div>
        </section>
      </section>
    </form>
  </li>`;
}

export default class EditPointView extends AbstractStatefulView{

  #destinations;
  #offers;
  #onEditPointClose;
  #onSubmitClick;
  #datepickerFrom;
  #datepickerTo;
  #onDeleteClick;
  #pointType;

  constructor({point = POINT_EMPTY, destinations, offers, onCloseEditPoint, onSubmiClick, onDeleteClick, pointType = EditType.EDITING}) {
    super();
    this.#destinations = destinations;
    this.onDeleteClick = onDeleteClick;
    this.#offers = offers;
    this.#onEditPointClose = onCloseEditPoint;
    this.#onSubmitClick = onSubmiClick;
    this.#onDeleteClick = onDeleteClick;
    this.#pointType = pointType;
    this._setState(EditPointView.parsePointToState({point}));
    this._restoreHandlers();
  }

  _restoreHandlers = () =>{
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);


    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submiClickHandler);

    if (this.#pointType === EditType.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeEditPointHandler);
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteClickHandler);
    }

    if (this.#pointType === EditType.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#closeEditPointHandler);
    }
    this.#setDatapickers();
  };

  get template() {
    return createPointEditElement({
      state: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
      pointType: this.#pointType,
    });
  }

  removeElement = () =>{
    super.removeElement();

    if(this.#datepickerFrom){
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if(this.#datepickerTo){
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset = (point) => this.updateElement({ point });

  #destinationChangeHandler = (evt) => {
    const newDestinationName = evt.target.value;
    const newDestination = this.#destinations.find((dest) => dest.name === newDestinationName);
    if (!newDestination) {
      return;
    }
    this.updateElement({
      point: {
        ...this._state.point,
        destination: newDestination.id,
      }
    });
  };

  #offerChangeHandler = () => {
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map(({id}) => id.split('-').slice(3).join('-'));

    this._setState({
      point: {
        ...this._state.point,
        offers: selectedOffers
      }
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: parseInt(evt.target.value, 10),
      }
    });
  };


  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [],
      },
    });
  };

  #closeEditPointHandler = (evt) => {
    evt.preventDefault();
    this.#onEditPointClose();
  };

  #submiClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(EditPointView.parseStateToPoint(this._state));
  };

  #setDatapickers = () =>{
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    this.#datepickerFrom = new CalendarView(
      {
        element: dateFromElement,
        defaultDate: this._state.point.dateFrom,
        maxDate: this._state.point.dateTo,
        onClose: this.#dateFromCloseHandler
      });

    this.#datepickerTo = new CalendarView(
      {
        element: dateToElement,
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onClose: this.#dateToCloseHandler
      });
  };

  #dateToCloseHandler = ([userDate]) =>{
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate
      }});

    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #dateFromCloseHandler = ([userDate]) =>{
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate
      }});

    this.#datepickerTo.set('minDate', this._state.point.dateTo);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = ({
    point,
    isDisabled = false,
    isSaving = false,
    isDeleting = false,
  }) => ({
    point,
    isDisabled,
    isSaving,
    isDeleting,
  });

  static parseStateToPoint = (state) => state.point;
}
