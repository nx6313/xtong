import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageParams } from '../../model/comm';

@Component({
  selector: 'loading',
  templateUrl: 'loading.html'
})
export class LoadingComponent {
  @Output() childEvent = new EventEmitter<any>();
  @Input() loadingTxt: string;
  @Input() noItemTxt: string;
  @Input() noItemImg: string;
  isShowLoadingFlag: boolean = false;
  isShowImgFlag: boolean = false;
  idClickRequestFlag: boolean = false;

  constructor() {
    this.loadingTxt ? {} : this.loadingTxt = '正在加载中，请稍后';
    this.noItemTxt ? {} : this.noItemTxt = '暂无数据';
    this.noItemImg ? {} : this.noItemImg = 'noitem.png';
  }

  fireChildEvent(childData, ...params) {
    let pageParams = new PageParams(childData, params);
    this.childEvent.emit(pageParams);
  }

  showLoading() {
    this.isShowLoadingFlag = true;
  }

  hideLoading() {
    this.isShowLoadingFlag = false;
  }

  showNoItem(clickRequest?: boolean) {
    if (clickRequest) {
      this.idClickRequestFlag = clickRequest;
    }
    this.isShowImgFlag = true;
  }

  requestAgain() {
    if (this.idClickRequestFlag && this.isShowImgFlag) {
      this.isShowImgFlag = false;
      this.fireChildEvent('requestAgain');
    }
  }

}
