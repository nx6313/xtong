import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { Remand } from '../../model/remand';

declare var $;

@Component({
  selector: 'task-list',
  templateUrl: 'task-list.html'
})
export class TaskListComponent {
  @Output('acceptOrderAfter') acceptOrderAfterFn = new EventEmitter<any>();
  @Output('clickRequestTimeoutBtn') clickRequestTimeoutBtnFn = new EventEmitter<any>();
  @Output('clickNoDataBtn') clickNoDataBtnFn = new EventEmitter<any>();
  @ViewChild('taskListwrap', { read: ElementRef }) _taskListwrap: ElementRef;
  @ViewChild('loadingDataTipWrap', { read: ElementRef }) _loadingDataTipWrap: ElementRef;
  @ViewChild('requestIsOuttimeTipWrap', { read: ElementRef }) _requestIsOuttimeTipWrap: ElementRef;
  @ViewChild('dataIsEmptyTipWrap', { read: ElementRef }) _dataIsEmptyTipWrap: ElementRef;

  taskMap: Map<string, Array<Remand>> = new Map<string, Array<Remand>>();

  isRefing: Boolean = false;
  isEmpty: Boolean = false;
  errShowTip: string = '请求超时';

  taskDetailPage: any = 'TaskDetailPage';
  loginPage: any = 'LoginPage';

  remandCicleDomContainer: {} = {}; // 需求 当前报名人数cicle对象容器

  // 圆形统计图参数配置
  circleOptions: {} = {
    color: "#24C789",
    backgroundColor: "#F1F1F1",
    background: true,
    speed: 2000,
    widthRatio: 0.1,
    value: 0.1,
    unit: 'percent', // 设置圆形进度条当前进度值的单位。例如：percent、deg、rad
    counterclockwise: true, // 设置圆形进度条是顺时针旋转，还是逆时针旋转。true表示逆时针旋转，false表示顺时针旋转
    size: 80,
    startAngle: 0,
    animate: true,
    backgroundFix: true,
    lineCap: "round",
    animation: "easeInOutCubic",
    text: '<span class="ciclePercentNum">0<span class="ciclePercentSymbol">%</span></span><span class="cicleTipTxt">已报名</span>',
    redraw: false,
    cAngle: 0,
    textCenter: true,
    textSize: false,
    textWeight: 'normal',
    textFamily: 'sans-serif',
    relativeTextSize: 1 / 7,
    autoCss: true,
    onDraw: (el, circle) => {
      circle.text('<span class="ciclePercentNum">' + Math.round(circle.value) + '<span class="ciclePercentSymbol">%</span></span><span class="cicleTipTxt">已报名</span>');
    }
  };

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private logService: LogService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef) {
  }

  setTaskMap(taskMap: Map<string, Array<Remand>>, onlyClear?: Boolean, ref?: Boolean) {
    this.taskMap = taskMap;
    if (this.taskMap === null) {
      this.isEmpty = null;
    } else {
      if (this.taskMap.size == 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
      ref ? this.isRefing = true : {};
      if (onlyClear === true) {
        this.isEmpty = false;
      }
    }
    this.toggleLoadingTip(this.isEmpty);
    this.cd.detectChanges();

    let circleDoms = this._taskListwrap.nativeElement.getElementsByClassName('circleApplyNum');
    $.each(circleDoms, (index, dom) => {
      this.remandCicleDomContainer[dom.classList[1]] = dom;
      this.circleOptions['value'] = dom.classList[2];
      $(dom).circleChart(this.circleOptions);
    });
  }

  dataFull() {
    let taskListNativeElem = this._taskListwrap.nativeElement;
    if (taskListNativeElem.getElementsByClassName('dataHasFullWrap').length == 0) {
      let hasFullDataWrapElement = document.createElement('div');
      hasFullDataWrapElement.classList.add('dataHasFullWrap');
      hasFullDataWrapElement.classList.add('animated');
      hasFullDataWrapElement.classList.add('flipInX');
      hasFullDataWrapElement.innerHTML = '我是有底线的';
      taskListNativeElem.appendChild(hasFullDataWrapElement);
    }
  }

  private toggleLoadingTip(isEmpty: Boolean) {
    let loadingNativeElem = this._loadingDataTipWrap.nativeElement;
    let requestIsOuttimeElem = this._requestIsOuttimeTipWrap.nativeElement;
    let emptyNativeElem = this._dataIsEmptyTipWrap.nativeElement;
    // 隐藏可能显示的已无数据的提示
    let taskListNativeElem = this._taskListwrap.nativeElement;
    if (taskListNativeElem.getElementsByClassName('dataHasFullWrap').length > 0) {
      $(taskListNativeElem.getElementsByClassName('dataHasFullWrap')).remove();
    }
    if (this.isRefing) {
      this.isRefing = false;
      $(requestIsOuttimeElem).stop().fadeOut(300, () => {
        $(loadingNativeElem).stop().fadeIn(300);
      });
      return false;
    }
    if (isEmpty === null) {
      $(loadingNativeElem).stop().fadeOut(300, () => {
        $(requestIsOuttimeElem).stop().fadeIn(300);
      });
      return false;
    }
    if (isEmpty) {
      $(loadingNativeElem).stop().fadeOut(300, () => {
        $(emptyNativeElem).stop().fadeIn(300);
      });
    } else {
      $(emptyNativeElem).stop().fadeOut(300, () => {
        $(loadingNativeElem).stop().fadeIn(300);
      });
    }
  }

  // 点击重新加载数据
  private clickRequestTimeoutBtn() {
    // 隐藏可能显示的已无数据的提示
    let taskListNativeElem = this._taskListwrap.nativeElement;
    if (taskListNativeElem.getElementsByClassName('dataHasFullWrap').length > 0) {
      $(taskListNativeElem.getElementsByClassName('dataHasFullWrap')).remove();
    }
    this.clickRequestTimeoutBtnFn.emit({
      toggleLoadingTipFn: () => { this.toggleLoadingTip(false); }
    });
  }

  // 点击没有数据按钮
  private clickNoDataBtn() {
    // 隐藏可能显示的已无数据的提示
    let taskListNativeElem = this._taskListwrap.nativeElement;
    if (taskListNativeElem.getElementsByClassName('dataHasFullWrap').length > 0) {
      $(taskListNativeElem.getElementsByClassName('dataHasFullWrap')).remove();
    }
    this.clickNoDataBtnFn.emit({
      toggleLoadingTipFn: () => { this.toggleLoadingTip(false); }
    });
  }

  private toTaskDetail(task) {
    let taskDetailModal = this.modalCtrl.create(this.taskDetailPage, {
      taskData: task
    });
    taskDetailModal.onDidDismiss(() => {
      this.logService.log('从任务详情页面返回');
    });
    taskDetailModal.present();
  }

  private acceptOrder(event, task) {
    this.storageService.getUserInfo().then((userInfo) => {

    });
    event.stopPropagation();
  }

}
