import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { TabObj } from '../../model/comm';
import { Observable, Subscription } from 'rxjs/Rx';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { EventsService } from '../../providers/events-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';

import { ScrollviewComponent } from '../../components/scrollview/scrollview';
import { TaskListComponent } from '../../components/task-list/task-list';

import { Remand, RemandPageContainer, RemandPageContainerItem } from '../../model/remand';

@Component({
  selector: 'page-task',
  templateUrl: 'task.html'
})
export class TaskPage {
  @ViewChild('statusPage1ScrollView')
  private statusPage1ScrollView: ScrollviewComponent;
  @ViewChild('statusPage1TaskList')
  private statusPage1TaskList: TaskListComponent;
  @ViewChild('statusPage2ScrollView')
  private statusPage2ScrollView: ScrollviewComponent;
  @ViewChild('statusPage2TaskList')
  private statusPage2TaskList: TaskListComponent;
  @ViewChild('statusPage3ScrollView')
  private statusPage3ScrollView: ScrollviewComponent;
  @ViewChild('statusPage3TaskList')
  private statusPage3TaskList: TaskListComponent;
  @ViewChild('statusPage4ScrollView')
  private statusPage4ScrollView: ScrollviewComponent;
  @ViewChild('statusPage4TaskList')
  private statusPage4TaskList: TaskListComponent;
  @ViewChild('statusPage5ScrollView')
  private statusPage5ScrollView: ScrollviewComponent;
  @ViewChild('statusPage5TaskList')
  private statusPage5TaskList: TaskListComponent;
  @ViewChild('statusPage6ScrollView')
  private statusPage6ScrollView: ScrollviewComponent;
  @ViewChild('statusPage6TaskList')
  private statusPage6TaskList: TaskListComponent;
  @ViewChild('statusPage7ScrollView')
  private statusPage7ScrollView: ScrollviewComponent;
  @ViewChild('statusPage7TaskList')
  private statusPage7TaskList: TaskListComponent;
  @ViewChild('timePage1ScrollView')
  private timePage1ScrollView: ScrollviewComponent;
  @ViewChild('timePage1TaskList')
  private timePage1TaskList: TaskListComponent;
  @ViewChild('timePage2ScrollView')
  private timePage2ScrollView: ScrollviewComponent;
  @ViewChild('timePage2TaskList')
  private timePage2TaskList: TaskListComponent;
  @ViewChild('timePage3ScrollView')
  private timePage3ScrollView: ScrollviewComponent;
  @ViewChild('timePage3TaskList')
  private timePage3TaskList: TaskListComponent;
  @ViewChild('timePage4ScrollView')
  private timePage4ScrollView: ScrollviewComponent;
  @ViewChild('timePage4TaskList')
  private timePage4TaskList: TaskListComponent;

  tabs: Array<TabObj> = [
    {
      id: 'searchByStatus',
      txt: '按状态查看',
      selected: true
    }, {
      id: 'searchByTime',
      txt: '按时间查看',
      selected: false
    }
  ];
  switchTabsByStatus: Array<TabObj> = [
    {
      id: 'tab_status_all',
      txt: '所有',
      keyword: 'all'
    }, {
      id: 'tab_status_empty',
      txt: '未满员',
      keyword: 'less'
    }, {
      id: 'tab_status_full',
      txt: '已满员',
      keyword: 'full'
    }, {
      id: 'tab_status_stop',
      txt: '已结束',
      keyword: 'completed'
    }, {
      id: 'tab_status_cancle',
      txt: '已取消',
      keyword: 'cancelled'
    }, {
      id: 'tab_status_doing',
      txt: '进行中',
      keyword: 'uncompleted'
    }, {
      id: 'tab_status_nostart',
      txt: '未开始',
      keyword: 'unstart'
    }
  ];
  switchTabsByTime: Array<TabObj> = [
    {
      id: 'tab_time_today',
      txt: '今天'
    }, {
      id: 'tab_time_tomorrow',
      txt: '明天'
    }, {
      id: 'tab_time_after_tomorrow',
      txt: '后天'
    }, {
      id: 'tab_time_nicety',
      txt: new Date(new Date().setDate(new Date().getDate() + 3)).getDate() + '日'
    }
  ];

  remandAddPage: string = 'RemandAddPage';
  subTime: Subscription;
  remandContainer: RemandPageContainer = new RemandPageContainer();

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService,
    private utilService: UtilService,
    private logService: LogService) {
  }

  ionViewDidEnter() {
    let time = Observable.interval(1000);
    this.subTime = time.subscribe({
      next: (val) => {
        let timeNicetyThreeDayAfter = new Date(new Date().setDate(new Date().getDate() + 3)).getDate() + '日';
        if (this.switchTabsByTime[3].txt != timeNicetyThreeDayAfter) {
          this.switchTabsByTime[3].txt = timeNicetyThreeDayAfter;
        }
      }
    });
  }

  ionViewWillLeave() {
    this.subTime.unsubscribe();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.initRemandContainer('searchByStatus').then(() => {
        this.initListData(false, this.remandContainer.tab_status_all, { status: this.switchTabsByStatus[0].keyword });
      });
    });
  }

  // 数据请求
  private initListData(isRef: Boolean, remandPageContainerItem: RemandPageContainerItem, filterParams: { status?: string, startDate?: string, endDate?: string } = null) {
    if (remandPageContainerItem.dataList.length > 0) {
      return false;
    }
    if (isRef) {
      remandPageContainerItem.aboutTaskList.setTaskList([], true);
      remandPageContainerItem.aboutTaskList.isRefing = true;
    }
    remandPageContainerItem.aboutScrollView.isLoading = true; // 正在加载数据
    let remandList = new Array<Remand>();
    this.protocolService.getDemandList(remandPageContainerItem.pageIndex, filterParams).then(data => {
      remandPageContainerItem.aboutScrollView.isLoading = false;
      if (data && data.result != 1) {
        this.utilService.showToast(data.msg);
      }
      if (!data) {
        return false;
      }
      if (data && JSON.parse(data.content).length == 0) {
        remandPageContainerItem.aboutTaskList.setTaskList([], false);
        return false;
      }
      for (let o in JSON.parse(data.content)) {
        console.log(o);
        let remand = new Remand();
        remand.orderId = data[o].orderformid;
        remand.orderNum = data[o].ordersn;
        remand.orderTime = data[o].addtime;
        remandList.push(remand);
      }
      remandPageContainerItem.dataList = remandList;
      if (isRef) {
        setTimeout(() => {
          remandPageContainerItem.aboutTaskList.setTaskList(remandList);
        }, 800);
      } else {
        remandPageContainerItem.aboutTaskList.setTaskList(remandList);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // 页面选项卡切换事件
  switchChange(params) {
    let filterParams: { status?: string, startDate?: string, endDate?: string } = {};
    if (params.changeType == 'slideTabChange') {
      this.initRemandContainer(params.id).then(() => {
        if (params.id == 'searchByStatus') {
          filterParams.status = this.switchTabsByStatus[0].keyword;
          this.initListData(false, this.remandContainer.tab_status_all, filterParams);
        } else if (params.id == 'searchByTime') {
          filterParams.startDate = this.utilService.formatDate(new Date(), 'yyyy-MM-dd');
          filterParams.endDate = this.utilService.formatDate(new Date(), 'yyyy-MM-dd');
          this.initListData(false, this.remandContainer.tab_time_today, filterParams);
        }
      });
    } else if (params.changeType == 'switchPageItem') {
      params.keyword ? filterParams.status = params.keyword : (() => {
        if (params.id == 'tab_time_today') {
          filterParams.startDate = this.utilService.formatDate(new Date(), 'yyyy-MM-dd');
          filterParams.endDate = this.utilService.formatDate(new Date(), 'yyyy-MM-dd');
        } else if (params.id == 'tab_time_tomorrow') {
          filterParams.startDate = this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');
          filterParams.endDate = this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');
        } else if (params.id == 'tab_time_after_tomorrow') {
          filterParams.startDate = this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd');
          filterParams.endDate = this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd');
        } else if (params.id == 'tab_time_nicety') {
          filterParams.startDate = this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 3)), 'yyyy-MM-dd');
          filterParams.endDate = this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 3)), 'yyyy-MM-dd');
        }
      })();
      this.initListData(false, this.remandContainer[params.id], filterParams);
    }
  }

  // 跳转到发布新需求页面
  toCreateNewRemand(params) {
    let remandAddModal = this.modalCtrl.create(this.remandAddPage);
    remandAddModal.onDidDismiss(() => {
    });
    remandAddModal.present();
  }

  // 初始化数据容器
  initRemandContainer(initType: string) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        if (initType == 'searchByStatus') {
          this.remandContainer.tab_status_all = new RemandPageContainerItem(this.statusPage1ScrollView, this.statusPage1TaskList);
          this.remandContainer.tab_status_empty = new RemandPageContainerItem(this.statusPage2ScrollView, this.statusPage2TaskList);
          this.remandContainer.tab_status_full = new RemandPageContainerItem(this.statusPage3ScrollView, this.statusPage3TaskList);
          this.remandContainer.tab_status_stop = new RemandPageContainerItem(this.statusPage4ScrollView, this.statusPage4TaskList);
          this.remandContainer.tab_status_cancle = new RemandPageContainerItem(this.statusPage5ScrollView, this.statusPage5TaskList);
          this.remandContainer.tab_status_doing = new RemandPageContainerItem(this.statusPage6ScrollView, this.statusPage6TaskList);
          this.remandContainer.tab_status_nostart = new RemandPageContainerItem(this.statusPage7ScrollView, this.statusPage7TaskList);
        } else if (initType == 'searchByTime') {
          this.remandContainer.tab_time_today = new RemandPageContainerItem(this.timePage1ScrollView, this.timePage1TaskList);
          this.remandContainer.tab_time_tomorrow = new RemandPageContainerItem(this.timePage2ScrollView, this.timePage2TaskList);
          this.remandContainer.tab_time_after_tomorrow = new RemandPageContainerItem(this.timePage3ScrollView, this.timePage3TaskList);
          this.remandContainer.tab_time_nicety = new RemandPageContainerItem(this.timePage4ScrollView, this.timePage4TaskList);
        }
        resolve('');
      }, 400);
    });
  }

}
