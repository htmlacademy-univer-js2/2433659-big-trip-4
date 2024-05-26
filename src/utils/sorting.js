import dayjs from 'dayjs';
import { TypeOfSort } from '../mock/const';

const sortPointsDayUp = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointsTimeUp = (pointA, pointB) => {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return timeA - timeB;
};

const sortPointsPriceUp = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

const sorting = {
  [TypeOfSort.DAY]: (points) => points.sort(sortPointsDayUp),
  [TypeOfSort.PRICE]: (points) => points.sort(sortPointsPriceUp),
  [TypeOfSort.TIME]: (points) => points.sort(sortPointsTimeUp),
};

export { sorting };
