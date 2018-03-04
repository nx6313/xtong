import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TabObj } from '../../model/comm';

declare var $;

@Component({
  selector: 'switch-pages',
  templateUrl: 'switch-pages.html'
})
export class SwitchPagesComponent {
  @Output('switchChange') switchChangeFn = new EventEmitter<any>();
  @ViewChild('switchItemWrap', { read: ElementRef }) _switchItemWrap: ElementRef;
  @ViewChild('switchTabsWrap', { read: ElementRef }) _switchTabsWrap: ElementRef;
  @Input('switchTabs') switchTabs: Array<TabObj> = [];
  @Input('showNum') showNum: number = 4;
  @Input('hide') hideFlag: Boolean = false;

  switchTabCss: {} = {};
  switchTabsWrapCssStyle: {} = {};

  constructor() {
  }

  ngOnInit() {
    this.switchTabCss['width'] = 'calc(100vw / ' + this.showNum + ')';
    this.hideFlag ? this.switchTabsWrapCssStyle['height'] = 'calc(100vh - 44px)' : {};
  }

  switchTabSelected(params) {
    params['changeType'] = 'switchPageItem';
    this.switchChangeFn.emit(params);
  }

  /**
   * 提供方式，使得tab页面跳转到指定索引页
   * @param pageIndex 跳转到的页面索引
   */
  skipToPage(pageIndex: number) {
    console.log(12312321);
    //let switchPageCount = $(this._switchItemWrap.nativeElement).find('span.switchTabItem').length;
    //console.log(switchPageCount);
  }

}
