import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TabObj } from '../../model/comm';

@Component({
  selector: 'switch-pages',
  templateUrl: 'switch-pages.html'
})
export class SwitchPagesComponent {
  @Output('switchChange') switchChangeFn = new EventEmitter<any>();
  @Input('switchTabs') switchTabs: Array<TabObj> = [];
  @Input('showNum') showNum: number = 4;

  switchTabCss: {} = {};

  constructor() {

  }

  ngOnInit() {
    this.switchTabCss['width'] = 'calc(100vw / ' + this.showNum + ')';
  }

  switchTabSelected(params) {
    params['changeType'] = 'switchPageItem';
    this.switchChangeFn.emit(params);
  }

}
