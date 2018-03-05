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
    let switchPageCount = $(this._switchItemWrap.nativeElement).find('span.switchTabItem').length;
    let curSwitchPageIndex = $(this._switchItemWrap.nativeElement).find('span.switchTabItemSelected').index();
    let switchPageScreenWidth = document.body.clientWidth;
    // 移动指示器到指定位置
    $(this._switchItemWrap.nativeElement).find('span.switchTabItem:eq(' + pageIndex + ')').siblings().removeClass('switchTabItemSelected');
    $(this._switchItemWrap.nativeElement).find('span.switchTabItem:eq(' + pageIndex + ')').addClass('switchTabItemSelected');
    let railTramformX = (switchPageScreenWidth / this.showNum) * pageIndex;
    $(this._switchItemWrap.nativeElement).find('span.switchTabIndicator').get(0).style.transform = 'translate3d(' + railTramformX + 'px, 0px, 0px)';
    // 移动内容区域到指定位置
    this._switchTabsWrap.nativeElement.style.transition = '0.4s ease';
    setTimeout(function () {
      this._switchTabsWrap.nativeElement.style.transition = '0s';
    }, 0.4 * 1000);
    let switchTabsTramformX = -(switchPageScreenWidth * pageIndex);
    this._switchTabsWrap.nativeElement.style.transform = 'translate3d(' + switchTabsTramformX + 'px, 0px, 0px)';
  }

}
