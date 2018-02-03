import { Component } from '@angular/core';
import { TabObj } from '../../model/comm';

@Component({
  selector: 'slide-tab',
  templateUrl: 'slide-tab.html'
})
export class SlideTabComponent {
  tabs: Array<TabObj> = [
    {
      id: 1,
      txt: '按状态查看',
      selected: true
    }, {
      id: 2,
      txt: '按时间查看',
      selected: false
    }
  ];

  constructor() {
  }

  clearSelected() {
    this.tabs.forEach((value, index) => {
      value.selected = false;
    });
  }

}
