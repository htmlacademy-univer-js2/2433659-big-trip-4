import { TypeOfFilter } from '../mock/const';
import { isPointFuture, isPointPast } from './point';

const filter = {
  [TypeOfFilter.EVERYTHING]: (points) => points,
  [TypeOfFilter.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [TypeOfFilter.PAST]: (points) => points.filter((point) => isPointPast(point))
};

export { filter };
