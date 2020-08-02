import { VueConstructor } from 'vue';
import { DragGroupDirective } from './directives/drag-group';
import { DragItemDirective } from './directives/drag-item';
import { DragListDirective } from './directives/drag-list';
import { INSERTED_CLASS, DRAGGING_CLASS } from 'core/element/drag-item';

export default function (Vue: VueConstructor) {
  Vue.directive('drag-group', new DragGroupDirective());
  Vue.directive('drag-item', new DragItemDirective());
  Vue.directive('drag-list', new DragListDirective());

  const sheet = document.createElement('style');
  sheet.innerHTML = `
    .${INSERTED_CLASS} {
      position: fixed;
      margin: 0;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .${DRAGGING_CLASS} {
      opacity: 0;
    }
  `;
  document.head.appendChild(sheet);
}
