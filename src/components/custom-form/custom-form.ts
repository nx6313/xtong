import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { NavController, ViewController, ModalController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { EventsService } from '../../providers/events-service';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { CustomForm } from '../../model/comm';

@Component({
  selector: 'custom-form',
  templateUrl: 'custom-form.html'
})
export class CustomFormComponent {
  @Output('initForm') initFormFn = new EventEmitter<any>();
  @Output('formSubmit') formSubmitFn = new EventEmitter<any>();
  @Input('formItems') formItemArr: Array<CustomForm> = [];
  @Input() showSubmitBtn: boolean = true;
  @Input() formSubmitBtnTxt: string = '提交';
  @Input() formSubmitTipTxt: string = '数据提交中，请稍后...';
  @Input('cssStyle') cssStyle: {} = {};

  dataBindContainer: {} = {}; // 数据绑定容器

  resetPwdPage: any = 'ResetPwdPage';
  registerPage: any = 'RegisterPage';

  selectedWorkTypes: Array<any> = new Array<any>();

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
      }
    }
    this.cd.detectChanges();
  }

  onSubmit(form) {
    console.log(form);
  }

}
