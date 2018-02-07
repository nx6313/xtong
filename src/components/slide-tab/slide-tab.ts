import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TabObj } from '../../model/comm';

@Component({
  selector: 'slide-tab',
  templateUrl: 'slide-tab.html'
})
export class SlideTabComponent {
  @Output('slideTabChange') slideTabChangeFn = new EventEmitter<any>();
  @Input('tabs') tabs: Array<TabObj> = [];

  constructor() {
  }

  clearSelected(newSelected) {
    let curSelectedId = '';
    this.tabs.forEach((value, index) => {
      if (value.selected) {
        curSelectedId = value.id;
      }
      value.selected = false;
    });
    if (curSelectedId !== newSelected.id) {
      this.slideTabChangeFn.emit({
        changeType: 'slideTabChange',
        id: newSelected.id
      });
    }
  }

}
