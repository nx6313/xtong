import { Component, Input } from '@angular/core';
import { TabObj } from '../../model/comm';

@Component({
  selector: 'slide-tab',
  templateUrl: 'slide-tab.html'
})
export class SlideTabComponent {
  @Input('tabs') tabs: Array<TabObj> = [];

  constructor() {
  }

  clearSelected() {
    this.tabs.forEach((value, index) => {
      value.selected = false;
    });
  }

}
