import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TabObj } from '../../model/comm';

@Component({
  selector: 'switch-pages',
  templateUrl: 'switch-pages.html'
})
export class SwitchPagesComponent {
  @Output('switchChange') switchChangeFn = new EventEmitter<any>();
  @Input('switchTabs') switchTabs: Array<TabObj> = [];
  switchTabCss: {} = {};

  constructor() {

  }

  ngOnInit() {
    this.switchTabs.length < 4 ? this.switchTabCss['width'] = 'calc(100vw / ' + this.switchTabs.length + ')' : {};
  }

  switchTabSelected(params) {
    params['changeType'] = 'switchPageItem';
    this.switchChangeFn.emit(params);
  }

}
