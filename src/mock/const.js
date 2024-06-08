const TypesOfPoints = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

const AUTHORIZATION = 'Basic gyuhiol';

const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const TypeOfFilter = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const TypeOfSort = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const TypeOfUpdate = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const LimitOfTime = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  TypesOfPoints,
  AUTHORIZATION,
  END_POINT,
  TypeOfFilter,
  TypeOfSort,
  TypeOfUpdate,
  UserAction,
  Method,
  Mode,
  LimitOfTime,
};
