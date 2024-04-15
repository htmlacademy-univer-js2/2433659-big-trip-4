import {TYPE_POINT, PRICE, CITY, DATE_AND_TIME, OFFER} from '../consts';
import {getRandomArrayElement} from '../utils';
import {getMockDestination} from './destination';

const BOUND = 5;

const getRandomPoint = () => {
  const identity = Math.floor(Math.random() * CITY.size);
  const offerCount = Math.floor(Math.random() * BOUND + 1);
  return {
    id: identity,
    city: CITY.get(identity),
    type: getRandomArrayElement(TYPE_POINT),
    price: getRandomArrayElement(PRICE),
    date: getRandomArrayElement(DATE_AND_TIME),
    destination: getMockDestination(identity),
    offer: Array.from({length: offerCount}, () => getRandomArrayElement(OFFER)),
    isFavorite: Math.floor(Math.random() * 2)
  };
};

export {getRandomPoint};
