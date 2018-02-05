import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabObj } from '../../model/comm';

@Component({
  selector: 'page-task',
  templateUrl: 'task.html'
})
export class TaskPage {
  tabs: Array<TabObj> = [
    {
      id: 1,
      txt: '按状态查看',
      selected: true
    }, {
      id: 2,
      txt: '按时间查看',
      selected: false
    }
  ];
  switchTabsByStatus: Array<TabObj> = [
    {
      id: 'tab_status_all',
      txt: '所有'
    }, {
      id: 'tab_status_overtime',
      txt: '已过期'
    }, {
      id: 'tab_status_full',
      txt: '已满员'
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

  constructor(public navCtrl: NavController) {
  }

}
