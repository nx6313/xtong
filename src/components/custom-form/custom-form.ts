import { Component, Input, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { NavController, ViewController, ModalController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { EventsService } from '../../providers/events-service';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';

@Component({
  selector: 'custom-form',
  templateUrl: 'custom-form.html'
})
export class CustomFormComponent {
  @Output('initForm') initFormFn = new EventEmitter<any>();
  @Output('loginSmsCode') loginSmsCodeFn = new EventEmitter<any>();
  @Output('resetPwdSmsCode') resetPwdSmsCodeFn = new EventEmitter<any>();
  @Output('registerSmsCode') registerSmsCodeFn = new EventEmitter<any>();
  @Output('formSubmit') formSubmitFn = new EventEmitter<any>();
  @Input() formType: string = ''; // login-auth-code、login-pwd、login-select-tclass、register、reset-pwd
  @Input() showLoading: boolean = true;
  @Input() showSubmitBtn: boolean = true;
  @Input() formSubmitTipTxt: string = '数据提交中，请稍后...';
  @Input() formSubmitBtnTxt: string = '提交';
  @Input('cssStyle') cssStyle: {} = {};

  resetPwdPage: any = 'ResetPwdPage';
  registerPage: any = 'RegisterPage';
  formData: {
    loginPhone?: string,
    authcode?: string,
    password?: string,
    registerPhone?: string,
    registerPwd?: string,
    registerAuthCode?: string,
    resetPwdPhone?: string,
    resetPwdAuthcode?: string,
    resetPassword?: string,
    takeCash?: string
  } = {};

  formParams: {
    enableSendCaptchaForLogin: boolean,
    enableSendCaptchaForResetPwd: boolean,
    enableSendCaptchaForRegister: boolean,
    captchaTxtForLogin: string,
    captchaTxtForResetPwd: string,
    captchaTxtForRegister: string,
    countDownTimeForLogin: number,
    countDownTimeForResetPwd: number,
    countDownTimeForRegister: number,
    timerForLogin?: any,
    timerForResetPwd?: any,
    timerForRegister?: any,
    canTakeCash?: string,
    workType?: Array<{ id: string, name: string, tclass: Array<{ id: string, name: string, icon: string }> }>
  } = {
      enableSendCaptchaForLogin: true,
      enableSendCaptchaForResetPwd: true,
      enableSendCaptchaForRegister: true,
      captchaTxtForLogin: '获取验证码',
      captchaTxtForResetPwd: '获取验证码',
      captchaTxtForRegister: '获取验证码',
      countDownTimeForLogin: 0,
      countDownTimeForResetPwd: 0,
      countDownTimeForRegister: 0,
      canTakeCash: '0.00',
      workType: []
    };

  selectedWorkTypes: Array<any> = new Array<any>();

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private platform: Platform,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService,
    private utilService: UtilService,
    private logService: LogService) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.formParams.workType = this.storageService.filterBaseData.filterClass;
      this.initFormFn.emit(this);
    });
  }

  onSubmit(form) {
    if (form.valid) {
      if (this.showLoading) {
        this.utilService.showLoading(this.formSubmitTipTxt);
      }
      //发送表单请求
      this.formSubmitFn.emit({
        formObj: this,
        formType: this.formType,
        formData: this.formData,
        formParams: this.formParams
      });
    } else {
      if (form.controls.loginPhone && form.controls.loginPhone.invalid) {
        this.utilService.showToast('登录账号不能为空');
        return false;
      }
      if (form.controls.authcode && form.controls.authcode.invalid) {
        this.utilService.showToast('短信验证码不能为空');
        return false;
      }
      if (form.controls.password && form.controls.password.invalid) {
        this.utilService.showToast('登录密码不能为空');
        return false;
      }
      if (form.controls.registerPhone && form.controls.registerPhone.invalid) {
        this.utilService.showToast('注册手机号不能为空');
        return false;
      }
      if (form.controls.registerPwd && form.controls.registerPwd.invalid) {
        this.utilService.showToast('请设置您的账号密码');
        return false;
      }
      if (form.controls.resetPwdPhone && form.controls.resetPwdPhone.invalid) {
        this.utilService.showToast('请输入您的登录账号');
        return false;
      }
      if (form.controls.resetPwdAuthcode && form.controls.resetPwdAuthcode.invalid) {
        this.utilService.showToast('请输入收到的短信验证码');
        return false;
      }
      if (form.controls.resetPassword && form.controls.resetPassword.invalid) {
        this.utilService.showToast('请输入新的密码进行密码重置');
        return false;
      }
      if (form.controls.takeCash && form.controls.takeCash.invalid) {
        this.utilService.showToast('请输入申请提现金额');
        return false;
      }
    }
  }

  // 发送登录短信验证码
  getLoginSmsCode() {
    if (this.formParams.enableSendCaptchaForLogin === true) {
      if (this.formData.loginPhone) {
        if (/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.formData.loginPhone.trim())) {
          this.loginSmsCodeFn.emit({
            formObj: this,
            formType: this.formType,
            formData: this.formData
          });
        } else {
          this.utilService.showToast('请输入正确的登录账号');
        }
      } else {
        this.utilService.showToast('请输入登录账号');
      }
    }
  }

  // 发送登录短信验证码
  getResetPwdSmsCode() {
    if (this.formParams.enableSendCaptchaForResetPwd === true) {
      if (this.formData.resetPwdPhone) {
        if (/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.formData.resetPwdPhone.trim())) {
          this.resetPwdSmsCodeFn.emit({
            formObj: this,
            formType: this.formType,
            formData: this.formData
          });
        } else {
          this.utilService.showToast('请输入正确的登录账号');
        }
      } else {
        this.utilService.showToast('请输入您的登录账号');
      }
    }
  }

  // 发送注册短信验证码
  getRegisterSmsCode() {
    if (this.formParams.enableSendCaptchaForRegister === true) {
      if (this.formData.registerPhone) {
        if (/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.formData.registerPhone.trim())) {
          this.registerSmsCodeFn.emit({
            formObj: this,
            formType: this.formType,
            formData: this.formData
          });
        } else {
          this.utilService.showToast('请输入正确的手机号');
        }
      } else {
        this.utilService.showToast('请输入您的手机号');
      }
    }
  }

  // 跳转到注册页面
  toRegister() {
    let registerModal = this.modalCtrl.create(this.registerPage);
    registerModal.onDidDismiss((registerUserInfo) => {
      this.logService.log('JSON[从注册页面返回]', registerUserInfo);
      if (registerUserInfo) {
        this.formData.loginPhone = registerUserInfo.mobile;
      }
    });
    registerModal.present();
  }

  // 后退返回到登录页面
  toLogin() {
    this.utilService.goToBack(this.navCtrl);
  }

  // 登陆 忘记密码
  loginForgetPwd(mobile, callBack?: Function) {
    let resetPwdModal = this.modalCtrl.create(this.resetPwdPage);
    resetPwdModal.onDidDismiss((pwdSet) => {
      this.logService.log('JSON[从密码重置页面返回]', pwdSet);
      if (pwdSet) {
        this.formData.loginPhone = pwdSet.mobile;
        this.formData.password = pwdSet.passWord;
      }
    });
    resetPwdModal.present();
  }

  // 获取找回密码短信验证码
  getResetPwdSmsVerifyCode(mobile, callBack?: Function) {
    this.protocolService.loginForgetPwd(mobile).then(data => {
      if (!data) { return false; }
      this.utilService.showToast(data.msg);
      if (data.flag == 1) {
        callBack();
      } else {
      }
    }).catch(err => {
      this.utilService.closeLoading();
      this.utilService.showToast('获取密码找回短信验证码失败，请稍后重试');
      console.log(err);
    });
  }

  // 获取登陆短信验证码
  getLoginSmsVerifyCode(mobile, callBack?: Function) {
    this.protocolService.loginSmsVerifyCode(mobile).then(data => {
      if (!data) { return false; }
      this.utilService.showToast(data.msg);
      if (data.flag == 1) {
        callBack();
      } else {
      }
    }).catch(err => {
      this.utilService.closeLoading();
      this.utilService.showToast('获取登陆短信验证码失败，请稍后重试');
      console.log(err);
    });
  }

  // 获取注册短信验证码
  getRegisterSmsVerifyCode(mobile, callBack?: Function) {
    this.protocolService.registerSmsVerifyCode(mobile).then(data => {
      if (!data) { return false; }
      this.utilService.showToast(data.msg);
      if (data.flag == 1) {
        callBack();
      } else {
      }
    }).catch(err => {
      this.utilService.closeLoading();
      this.utilService.showToast('获取注册短信验证码失败，请稍后重试');
      console.log(err);
    });
  }

  // 开始找回密码验证码倒计时
  startCaptchaResetPwdTimer(timerSecond: number) {
    this.formParams.enableSendCaptchaForResetPwd = false;
    this.formParams.timerForResetPwd = Observable.interval(1000).take(timerSecond).map((tick) => {
      this.formParams.countDownTimeForResetPwd++;
    }).subscribe((tick) => {
      this.formParams.captchaTxtForResetPwd = `${timerSecond - this.formParams.countDownTimeForResetPwd} 秒后可重发`;
    }, (err) => { }, () => {
      this.formParams.enableSendCaptchaForResetPwd = true;
      this.formParams.countDownTimeForResetPwd = 0;
      this.formParams.captchaTxtForResetPwd = '获取验证码';
    });
  }

  // 开始登陆验证码倒计时
  startCaptchaLoginTimer(timerSecond: number) {
    this.formParams.enableSendCaptchaForLogin = false;
    this.formParams.timerForLogin = Observable.interval(1000).take(timerSecond).map((tick) => {
      this.formParams.countDownTimeForLogin++;
    }).subscribe((tick) => {
      this.formParams.captchaTxtForLogin = `${timerSecond - this.formParams.countDownTimeForLogin} 秒后可重发`;
    }, (err) => { }, () => {
      this.formParams.enableSendCaptchaForLogin = true;
      this.formParams.countDownTimeForLogin = 0;
      this.formParams.captchaTxtForLogin = '获取验证码';
    });
  }

  // 开始注册验证码倒计时
  startCaptchaRegisterTimer(timerSecond: number) {
    this.formParams.enableSendCaptchaForRegister = false;
    this.formParams.timerForRegister = Observable.interval(1000).take(timerSecond).map((tick) => {
      this.formParams.countDownTimeForRegister++;
    }).subscribe((tick) => {
      this.formParams.captchaTxtForRegister = `${timerSecond - this.formParams.countDownTimeForRegister} 秒后可重发`;
    }, (err) => { }, () => {
      this.formParams.enableSendCaptchaForRegister = true;
      this.formParams.countDownTimeForRegister = 0;
      this.formParams.captchaTxtForRegister = '获取验证码';
    });
  }

  // 输入提现金额
  takeCashInput(takeCash) {
    if (takeCash.value) {
      if (!/^[0-9]+(.|.[0-9]{1}|.[0-9]{2})?$/.test(takeCash.value)) {
        takeCash.value = takeCash.value.substring(0, takeCash.value.length - 1);
      }
      if (Number(takeCash.value) > Number(this.formParams.canTakeCash)) {
        takeCash.value = this.formParams.canTakeCash;
      }
    }
  }

  // 全部提现
  takeCashAll() {
    this.formData.takeCash = this.formParams.canTakeCash;
  }

  // 选择工种
  selectWorkType(selected: Boolean, workType: any) {
    if (selected) {
      if (this.selectedWorkTypes.length < 3) {
        this.selectedWorkTypes.push(workType);
      } else {
        workType.selected = false;
        this.utilService.showToast('最多可选择三种哦');
      }
    } else {
      this.selectedWorkTypes.splice(this.selectedWorkTypes.indexOf(workType), 1);
    }
  }

}
