import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { NavController, ViewController, ModalController, Platform } from 'ionic-angular';
import { EventsService } from '../../providers/events-service';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { CustomForm } from '../../model/comm';

declare var Picker;

@Component({
  selector: 'custom-form',
  templateUrl: 'custom-form.html'
})
export class CustomFormComponent {
  @Output('formSubmit') formSubmitFn = new EventEmitter<any>();
  @Input('formItems') formItemArr: Array<CustomForm> = [];
  @Input() showSubmitBtn: boolean = true;
  @Input() formSubmitBtnTxt: string = '提交';
  @Input('cssStyle') cssStyle: {} = {};

  itemOptionContainer: {} = {}; // 表单项参数绑定容器
  dataBindContainer: {} = {}; // 数据绑定容器
  dataRealBindContainer: {} = {}; // 真实数据绑定容器

  addressSelectPage: string = 'AddressSelectPage';

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private cd: ChangeDetectorRef,
    private platform: Platform,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService,
    private utilService: UtilService,
    private logService: LogService) {
  }

  ngOnInit() {
    for (let index in this.formItemArr) {
      if (this.formItemArr[index].ngBind !== '') {
        this.dataBindContainer[this.formItemArr[index].ngBind] = this.formItemArr[index].initVal ? this.formItemArr[index].initVal : '';
        if (this.formItemArr[index].ngRealValBind) {
          this.dataRealBindContainer[this.formItemArr[index].ngRealValBind] = '';
        }
        this.itemOptionContainer[this.formItemArr[index].ngBind] = this.formItemArr[index];
      }
    }
    this.cd.detectChanges();
  }

  onSubmit(form) {
    if (form.valid) {
      this.formSubmitFn.emit({
        formData: form.value,
        formRealVal: this.dataRealBindContainer
      });
    } else {
      for (let formItemOpt in this.itemOptionContainer) {
        if (this.itemOptionContainer[formItemOpt].request && form.value[formItemOpt] === '') {
          this.utilService.showToast(this.itemOptionContainer[formItemOpt].lTxt + '不能为空');
          return false;
        } else if (form.value[formItemOpt] !== '') {
          if (this.itemOptionContainer[formItemOpt].type === 'number') {
            if (!/^[0-9]+$/.test(form.value[formItemOpt])) {
              this.utilService.showToast(this.itemOptionContainer[formItemOpt].lTxt + '不是有效的数值');
              return false;
            }
          } else if (this.itemOptionContainer[formItemOpt].type === 'money') {
            if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(form.value[formItemOpt])) {
              this.utilService.showToast(this.itemOptionContainer[formItemOpt].lTxt + '不是有效的金额');
              return false;
            }
          }
        }
      }
    }
  }

  selectedAddress(addressKey) {
    let addressSelectModal = this.modalCtrl.create(this.addressSelectPage);
    addressSelectModal.onDidDismiss((data) => {
      if (data) {
        this.dataBindContainer[addressKey] = data.selectAddress.name;
        this.cd.detectChanges();
      }
    });
    addressSelectModal.present();
  }

  selectedTime(timeKey) {
    Picker.instance({
      title: '请选择' + this.itemOptionContainer[timeKey].lTxt,
      clos: [{
        values: ['今天', '明天', '后天', this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 3)), 'MM月dd日'), this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 4)), 'MM月dd日')],
        displayValues: [
          this.utilService.formatDate(new Date(), 'yyyy-MM-dd'),
          this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'),
          this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd'),
          this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 3)), 'yyyy-MM-dd'),
          this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 4)), 'yyyy-MM-dd')
        ]
      },
      {
        values: '0-24'
      },
      {
        values: '0-59'
      }],
      joinWord: ['', '点', '分'],
      confirmFn: (selected) => {
        this.dataBindContainer[timeKey] = selected.selectJoinValue;
        this.dataRealBindContainer[this.itemOptionContainer[timeKey].ngRealValBind] = selected.selectDisplayValue;
        this.cd.detectChanges();
      }
    }).show();
  }

  selectedPicker(formItemKey) {
    Picker.instance({
      title: '请选择' + this.itemOptionContainer[formItemKey].lTxt,
      clos: this.itemOptionContainer[formItemKey].pickerCols,
      confirmFn: (selected) => {
        this.dataBindContainer[formItemKey] = selected.selectJoinValue;
        if (this.itemOptionContainer[formItemKey].ngRealValBind) {
          this.dataRealBindContainer[this.itemOptionContainer[formItemKey].ngRealValBind] = selected.selectDisplayValue;
        }
        this.cd.detectChanges();
      }
    }).show();
  }

}
