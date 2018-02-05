import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { UtilService } from '../../providers/util-service';

declare var $;
declare var PullToRefresh;

@Component({
  selector: 'scrollview',
  templateUrl: 'scrollview.html'
})
export class ScrollviewComponent {
  @Output('initScrollView') initScrollView = new EventEmitter<any>();
  @Output('pullRef') dataPullRef = new EventEmitter<any>();
  @Output('pullRefAfter') dataPullRefAfter = new EventEmitter<any>();
  @ViewChild('pullrefcontent', { read: ElementRef }) _pullrefContent: ElementRef;
  @Input('height') scrollViewHeight: number = -1;
  @Input('bottomOtherHeight') bottomOtherHeight: number = 0;
  @Input('pullRefSupport') pullRefSupport: boolean = false;
  @Input('upLoadMore') upLoadMore: boolean = false;
  @Input('upLoadRefingIcon') upLoadRefingIcon: string = 'assets/imgs/loadMore.gif';
  @Input('pullAreaBg') pullAreaBg: string = '#F8F8F8';
  @Input('topAreaBg') elasticityTopAreaBg: string = '#ebf0f2';
  @Input('areaBg') elasticityAreaBg: string = '#ebf0f2';
  @Input('instructionsPullToRefresh') instructionsPullToRefresh: string = '往下再拉一点';
  @Input('instructionsReleaseToRefresh') instructionsReleaseToRefresh: string = '释放就可以刷新啦';
  @Input('instructionsRefreshing') instructionsRefreshing: string = '正在刷新';
  @Input('iconArrow') iconArrow: string = 'assets/imgs/pull.png';
  @Input('iconRefreshing') iconRefreshing: string = 'assets/imgs/pull.png';
  @Input('iconZoomRate') iconZoomRate: number = 0.1;
  @Input('refTxtColor') refTxtColor: string = '#4D4D4D';
  @Input('ignoreElementClases') ignoreElements: string = '';
  @Input('footerWaterMark') footerWaterMark: string = '';
  @Input('diffHeightWhenLoadFinish') diffHeightWhenLoadFinish: number = 0;
  @Input('canSwitchSlide') canSwitchSlide: Boolean = false;
  
  @Input('scrollviewRank') scrollviewRank: string = '';

  pageLoadFinish: Function = () => { };
  isLoading: Boolean = false;

  constructor(private platform: Platform,
    private utilService: UtilService) {

  }

  ngOnInit() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.init();
      }, 400);
      this.initScrollView.emit(this);
    });
  }

  init() {
    if (this.diffHeightWhenLoadFinish > 0) {
      this.pageLoadFinish = () => {
        this.changeHeight(this.diffHeightWhenLoadFinish);
      };
    }
    let scrollEle: HTMLElement = this._pullrefContent.nativeElement;
    let pageIdName = $(scrollEle.parentElement.parentElement).parents('ion-content').parent().get(0).localName;
    let pageTitleBarHeight = $(scrollEle.parentElement.parentElement).parents('ion-content').parent().find('ion-header').height();
    PullToRefresh.init({
      mainElement: scrollEle,
      classPrefix: 'ionic-',
      pageIdName: pageIdName,
      pageRankName: this.scrollviewRank,
      pullAreaBg: this.pullAreaBg,
      elasticityTopAreaBg: this.elasticityTopAreaBg,
      elasticityAreaBg: this.elasticityAreaBg,
      instructionsPullToRefresh: this.instructionsPullToRefresh,
      instructionsReleaseToRefresh: this.instructionsReleaseToRefresh,
      instructionsRefreshing: this.instructionsRefreshing,
      iconArrow: this.iconArrow,
      iconRefreshing: this.iconRefreshing,
      iconZoomRate: this.iconZoomRate,
      refTxtColor: this.refTxtColor,
      ignoreElements: this.ignoreElements,
      canSwitchSlide: this.canSwitchSlide,
      onRefresh: () => {
        let dataPullRefFn = this.dataPullRef;
        return new Promise(function (resolve) {
          dataPullRefFn.emit(resolve);
        });
      },
      onRefreshAfter: (data) => {
        this.dataPullRefAfter.emit(data);
      },
      onlyElasticity: (!this.pullRefSupport),
      upLoadMore: this.upLoadMore,
      upLoadRefingIcon: this.upLoadRefingIcon,
      scrollViewHeight: this.scrollViewHeight,
      titleBarHeight: pageTitleBarHeight,
      footerBarHeight: 'auto',
      otherElmHeight: this.bottomOtherHeight,
      offsetWidth: scrollEle.offsetWidth,
      offsetTop: scrollEle.offsetTop,
      offsetLeft: scrollEle.offsetLeft,
      footerWaterMark: this.footerWaterMark,
      pageLoadFinish: this.pageLoadFinish,
      shouldPullToRefresh: () => {
        let scrollTop = scrollEle.scrollTop;
        if (scrollTop <= 0) {
          return true;
        }
        return false;
      },
      shouldUpToElasticity: () => {
        let scrollTop = scrollEle.scrollTop;
        let clientHeight = scrollEle.clientHeight;
        let scrollHeight = scrollEle.scrollHeight;
        if (scrollHeight >= clientHeight + scrollTop && scrollHeight <= clientHeight + scrollTop + 2) {
          return true;
        }
        return false;
      },
      canUpToRef: () => {
        if (scrollEle.getElementsByClassName('mainContent')[0].getElementsByClassName('taskListWrap')[0].getElementsByClassName('dataHasFullWrap').length > 0 ||
          $(scrollEle.getElementsByClassName('mainContent')[0].getElementsByClassName('taskListWrap')[0].getElementsByClassName('noDataWrap')[0].getElementsByClassName('loadingDataTipWrap')[0]).is(':visible') ||
          $(scrollEle.getElementsByClassName('mainContent')[0].getElementsByClassName('taskListWrap')[0].getElementsByClassName('noDataWrap')[0].getElementsByClassName('dataIsEmptyTipWrap')[0]).is(':visible')
          || this.isLoading) {
          return false;
        }
        return true;
      }
    });
  }

  // 修改内容区域高度
  changeHeight(diffHeight: number) {
    let scrollEle: HTMLElement = this._pullrefContent.nativeElement;
    let pageIdName = $(scrollEle.parentElement.parentElement).parents('ion-content').parent().get(0).localName;
    let pageTitleBarHeight = $(scrollEle.parentElement.parentElement).parents('ion-content').parent().find('ion-header').height();
    $(pageIdName).find('scrollview').find('div.pullRefWrap').css({
      'overflow-x': 'hidden', 'overflow-y': 'auto'
    });
    $(pageIdName).find('scrollview').find('div.pullRefWrap').stop().animate({
      height: (document.body.clientHeight - pageTitleBarHeight - scrollEle.offsetTop - Number(this.bottomOtherHeight) - diffHeight)
    }, 300);
    $(pageIdName).find('scrollview').find('div.ionic-ptr-after').stop().animate({
      height: (document.body.clientHeight - pageTitleBarHeight - scrollEle.offsetTop - Number(this.bottomOtherHeight) - diffHeight)
    }, 300);
  }

  // 提供方法，将滚动条保持在最下
  scrollToBottom() {
    let scrollEle: HTMLElement = this._pullrefContent.nativeElement;
    scrollEle.scrollTop = $(scrollEle).animate({ scrollTop: scrollEle.scrollHeight }, 600);
  }

}
