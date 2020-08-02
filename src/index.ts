import { VueConstructor } from 'vue';
import { DragGroupDirective } from './directives/drag-group';
import { DragItemDirective } from './directives/drag-item';
import { DragListDirective } from './directives/drag-list';

export default function (Vue: VueConstructor) {
  Vue.directive('drag-group', new DragGroupDirective());
  Vue.directive('drag-item', new DragItemDirective());
  Vue.directive('drag-list', new DragListDirective());
}
