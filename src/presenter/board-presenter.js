import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

const POINT_COUNT = 3;

import { render } from '../render.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();

  constructor({container}) {
    this.container = container;
  }

  init () {
    render(this.eventListComponent, this.container);

    render(new PointEditView(), this.eventListComponent.getElement());

    for (let i = 0; i < POINT_COUNT; i++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}
