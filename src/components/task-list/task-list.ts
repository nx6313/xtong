import { Component, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { Task } from '../../model/task';

declare var $;

@Component({
  selector: 'task-list',
  templateUrl: 'task-list.html'
})
export class TaskListComponent {
  @Output('acceptOrderAfter') acceptOrderAfterFn = new EventEmitter<any>();
  @Output('refLoadData') refLoadDataFn = new EventEmitter<any>();
  @ViewChild('taskListwrap', { read: ElementRef }) _taskListwrap: ElementRef;
  @ViewChild('loadingDataTipWrap', { read: ElementRef }) _loadingDataTipWrap: ElementRef;
  @ViewChild('dataIsEmptyTipWrap', { read: ElementRef }) _dataIsEmptyTipWrap: ElementRef;
  taskList: Array<Task> = [];

  isRefing: Boolean = false;
  isEmpty: Boolean = false;

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

  setTaskList(taskList: Array<Task>, onlyClear?: Boolean) {
    this.taskList = taskList;
    if (this.taskList.length == 0) {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
    this.isRefing = false;
    if (onlyClear === true) {
      this.isEmpty = false;
    }
    this.toggleLoadingTip(this.isEmpty);
    this.cd.detectChanges();
  }

  addTask(addTask: (Array<Task> | Task)) {
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
    let emptyNativeElem = this._dataIsEmptyTipWrap.nativeElement;
    // 隐藏可能显示的已无数据的提示
    let taskListNativeElem = this._taskListwrap.nativeElement;
    if (taskListNativeElem.getElementsByClassName('dataHasFullWrap').length > 0) {
      $(taskListNativeElem.getElementsByClassName('dataHasFullWrap')).remove();
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
  private refLoadData() {
    // 隐藏可能显示的已无数据的提示
    let taskListNativeElem = this._taskListwrap.nativeElement;
    if (taskListNativeElem.getElementsByClassName('dataHasFullWrap').length > 0) {
      $(taskListNativeElem.getElementsByClassName('dataHasFullWrap')).remove();
    }
    this.toggleLoadingTip(false);
    this.refLoadDataFn.emit();
  }

  private toTaskDetail(task) {
    let taskDetailModal = this.modalCtrl.create(this.taskDetailPage, {
      taskData: task
    });
    taskDetailModal.onDidDismiss(() => {
      this.storageService.setCurrentActivePage('TabsPage');
      this.logService.log('从任务详情页面返回');
    });
    taskDetailModal.present();
  }

  private acceptOrder(event, task) {
    this.storageService.getUserInfo().then((userInfo) => {
      if (userInfo && userInfo.workType && userInfo.workType.toLowerCase() !== 'null') {
        this.utilService.showLoading('正在为您接单');
        this.protocolService.receiveOrder(task.orderId).then((receiveOrderData) => {
          this.utilService.closeLoading();
          if (receiveOrderData.flag == 1) {
            // 执行移除动画
            this.utilService.showCurrentTaskElem(() => {
              this.toTaskDetail(task);
            });
            $(event.target.offsetParent).animateCss('bounceOutRight', true).then(() => {
              this.acceptOrderAfterFn.emit({
                acceptTask: task
              });
            });
            // 移除当前订单条目
            this.taskList.splice(this.taskList.indexOf(task), 1);
            this.cd.detectChanges();
          } else {
            this.utilService.showToast(receiveOrderData.msg);
          }
        });
      } else {
        let loginModal = this.modalCtrl.create(this.loginPage);
        if (!userInfo) {
          // 需要登录
          this.utilService.showToast('请先登录');
        } else {
          // 需要设置工种
          this.utilService.showToast('请先设置您的工种');
          loginModal = this.modalCtrl.create(this.loginPage, { setTClass: true });
        }
        loginModal.onDidDismiss(() => {
          this.storageService.setCurrentActivePage('TabsPage');
          this.logService.log('从登录页面返回');
        });
        loginModal.present();
      }
    });
    event.stopPropagation();
  }

}
