import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Platform } from 'ionic-angular';

import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { EventsService } from '../../providers/events-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { CustomForm } from '../../model/comm';

@IonicPage()
@Component({
  selector: 'page-remand-add',
  templateUrl: 'remand-add.html',
})
export class RemandAddPage {
  formItems: Array<CustomForm> = [
    new CustomForm('任务名称', 'remandName').setAttr('rIcon', 'icon-rw-hmj').setAttr('placeholder', '给要发布的任务起个名吧'),
    new CustomForm('装车地址', 'startAddress').setAttr('rIcon', 'icon-dizhi-hmj').setAttr('placeholder', '请输入装车地址'),
    new CustomForm('卸货地址', 'endAddress').setAttr('rIcon', 'icon-dizhi-hmj').setAttr('placeholder', '请输入卸货地址'),
    new CustomForm('开始时间', 'startTime', 'time').setAttr('rIcon', 'icon-time-hmj').setAttr('placeholder', '请选择开始时间'),
    new CustomForm('结束时间', 'endTime', 'time').setAttr('rIcon', 'icon-time-hmj').setAttr('placeholder', '请选择结束时间'),
    new CustomForm('车辆数目', 'carNumber', 'picker').setAttr('rIcon', 'icon-right').setAttr('placeholder', '请选择需求车辆数目'),
    new CustomForm('货运类型', 'cargoType', 'picker').setAttr('rIcon', 'icon-right').setAttr('placeholder', '请选择货运类型'),
    new CustomForm('运输费用', 'freight', 'money').setAttr('rIcon', 'icon-qian').setAttr('placeholder', '请输入运输价格（每吨）'),
    new CustomForm('备注说明', 'remark', 'textarea').setAttr('placeholder', '请输入备注信息...')
  ];

  constructor(public viewCtrl: ViewController,
    private platform: Platform,
    public navParams: NavParams,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService,
    private utilService: UtilService,
    private logService: LogService) {
  }

  ionViewDidEnter() {
    this.eventsService.subscribe('page-remand-add:goToBack', () => {
      this.eventsService.unsubscribe('page-remand-add:goToBack');
      this.viewCtrl.dismiss();
    });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
    });
  }

}
