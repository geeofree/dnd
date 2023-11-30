import './style.css'
import { PubSub } from './pubsub';

const droppablePubSub = new PubSub();

const dragItems = document.querySelectorAll<HTMLElement>('[data-draggable]');

const droppables = document.querySelectorAll<HTMLElement>('[data-droppable]');

let draggedItem: HTMLElement | null = null;
let dragItemOriginalRect: DOMRect | null = null;
let xOrigin = 0;
let yOrigin = 0;

dragItems.forEach(dragItem => {
  dragItem.style.cursor = 'grab';

  dragItem.onmousedown = function(evt) {
    dragItem.style.cursor = 'grabbing';
    dragItem.style.position = 'fixed';
    xOrigin = evt.clientX;
    yOrigin = evt.clientY;
    dragItemOriginalRect = dragItem.getBoundingClientRect();
    draggedItem = dragItem;
  };
});

document.onmousemove = function(evt) {
  if (draggedItem && dragItemOriginalRect) {
    droppablePubSub.publish('client-mouse-position', {
      x: evt.clientX,
      y: evt.clientY,
    });
    draggedItem.style.top = (evt.clientY - yOrigin) + 'px';
    draggedItem.style.left = (evt.clientX - xOrigin) + 'px';
  }
}

document.onmouseup = function() {
  if (draggedItem) {
    document.querySelector('[data-droppable][data-here]')?.removeAttribute('data-here');
    draggedItem.style.cursor = 'grab';
    draggedItem.style.position = 'static';
    draggedItem.style.top = '0';
    draggedItem.style.left = '0';
    draggedItem = null;
  }
}

droppables.forEach(droppable => {
  droppablePubSub.subscribe('client-mouse-position', (position: { x: number, y: number }) => {
    const { left, right, top, bottom } = droppable.getBoundingClientRect();

    if (position.x >= left && position.x <= right && position.y >= top && position.y <= bottom) {
      droppable.setAttribute('data-here', 'true');
    } else {
      droppable.removeAttribute('data-here');
    }
  });
});
