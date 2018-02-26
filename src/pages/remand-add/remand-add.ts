import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Platform } from 'ionic-angular';

import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { EventsService } from '../../providers/events-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { CustomForm, PickerItem } from '../../model/comm';
import { Demand } from '../../entities/demand';

@IonicPage()
@Component({
  selector: 'page-remand-add',
  templateUrl: 'remand-add.html',
})
export class RemandAddPage {
  formItems: Array<CustomForm> = [
    new CustomForm('任务名称', 'remandName').isRequest().setRIcon('icon-rw-hmj').setPlaceholder('给要发布的任务起个名吧'),
    new CustomForm('装车地址', 'startAddress', 'address').isRequest().setRIcon('icon-dizhi-hmj').setPlaceholder('请选择装车地址').setNgRealValBind('startPosition'),
    new CustomForm('卸货地址', 'endAddress', 'address').isRequest().setRIcon('icon-dizhi-hmj').setPlaceholder('请选择卸货地址').setNgRealValBind('endPosition'),
    new CustomForm('开始时间', 'startTime', 'time').isRequest().setRIcon('icon-time-hmj').setPlaceholder('请选择开始时间').setNgRealValBind('startTimeReal'),
    new CustomForm('结束时间', 'endTime', 'time').isRequest().setRIcon('icon-time-hmj').setPlaceholder('请选择结束时间').setNgRealValBind('endTimeReal'),
    new CustomForm('车辆数目', 'carNumber', 'number').isRequest().setRIcon('icon-rw-hmj').setPlaceholder('请选择需求车辆数目'),
    new CustomForm('货运类型', 'cargoType', 'picker').isRequest().setRIcon('icon-right').setPlaceholder('请选择货运类型').setNgRealValBind('cargoTypeReal').setPickerCols([
      new PickerItem(['大货车', '大挂', ' 小货车', '大卡']).setDisplayValues(['1', '2', '3', '4'])
    ]),
    new CustomForm('运输费用', 'freight', 'money').isRequest().setRIcon('icon-qian').setPlaceholder('请输入运输价格（每吨）'),
    new CustomForm('备注说明', 'remark', 'textarea').setPlaceholder('请输入备注信息...')
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

  formSubmit(formParams) {
    let demand = new Demand()
      .setStaffId(this.storageService.userInfo.staffId)
      .setMerchantId(this.storageService.userInfo.merchantId)
      .setName(formParams.formData.remandName)
      .setStartAddress(formParams.formData.startAddress)
      .setStartPosition(JSON.stringify(formParams.formRealVal.startPosition))
      .setEndAddress(formParams.formData.endAddress)
      .setEndPosition(JSON.stringify(formParams.formRealVal.endPosition))
      .setStartTime(formParams.formRealVal.startTimeReal)
      .setEndTime(formParams.formRealVal.endTimeReal)
      .setRemark(formParams.formData.remark)
      .setCarNumber(formParams.formData.carNumber)
      .setFreight(formParams.formData.freight)
      .setCargoType(formParams.formRealVal.cargoTypeReal);
    this.utilService.showLoading('正在创建新任务');
    this.protocolService.demandAdd(demand).then((demandAdd) => {
      this.utilService.closeLoading();
      if (demandAdd && (demandAdd.error === 'timeout' || demandAdd.error === 'neterr')) {
        if (demandAdd.error === 'timeout') {
          this.utilService.showToast('创建新任务超时，请稍后重试');
        } else if (demandAdd.error === 'neterr') {
          this.utilService.showToast('网络异常，请稍后重试');
        }
        return false;
      }
      if (demandAdd.result == 1) {
        this.utilService.showToast('任务添加成功');
        this.eventsService.unsubscribe('page-remand-add:goToBack');
        this.viewCtrl.dismiss();
      } else {
        this.utilService.showToast(demandAdd.msg);
      }
    });
  }

}
