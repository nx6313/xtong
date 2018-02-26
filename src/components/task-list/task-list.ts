import { Component, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  taskList: Array<Remand> = [];

  isRefing: Boolean = false;
  isEmpty: Boolean = false;
  errShowTip: string = '请求超时';

  taskDetailPage: any = 'TaskDetailPage';
  loginPage: any = 'LoginPage';

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private logService: LogService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef) {
  }

  setTaskList(taskList: Array<Remand>, onlyClear?: Boolean, ref?: Boolean) {
    this.taskList = taskList;
    if (this.taskList === null) {
      this.isEmpty = null;
    } else {
      if (this.taskList.length == 0) {
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
  }

  addTask(addTask: (Array<Remand> | Remand)) {
    if (addTask instanceof Array) {
      this.taskList = this.taskList.concat(addTask);
    } else {
      this.taskList.push(addTask);
    }
    this.cd.detectChanges();
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
