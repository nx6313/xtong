import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { UtilService } from '../../providers/util-service';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { UserInfo } from '../../model/user';
import { TabsPage } from '../../pages/tabs/tabs';

@Component({
  selector: 'user-login',
  templateUrl: 'user-login.html'
})
export class UserLoginComponent {
  canSmsCodeGetAgain: number = 90;
  codeBtnTip: string = '获取验证码';
  getSmsCode: number = -1; // -1：还没获取验证码  -2：验证码已失效

  constructor(public navCtrl: NavController,
    private utilService: UtilService,
    private storageService: StorageService,
    private protocolService: ProtocolService) {
  }

  getPhoneCode(phone) {
    if (this.codeBtnTip !== '获取验证码') {
      return false;
    }
    if (phone) {
      if (/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(phone.trim())) {
        this.utilService.showLoading('正在发送短信验证码');
        this.protocolService.loginSmsVerifyCode(phone.trim()).then((smsVerifyCode) => {
          this.utilService.closeLoading();
          if (smsVerifyCode && (smsVerifyCode.error === 'timeout' || smsVerifyCode.error === 'neterr')) {
            if (smsVerifyCode.error === 'timeout') {
              this.utilService.showToast('发送验证码超时，请稍后重试');
            } else if (smsVerifyCode.error === 'neterr') {
              this.utilService.showToast('网络异常，请稍后重试');
            }
            return false;
          }
          if (smsVerifyCode.result === 1) {
            this.getSmsCode = smsVerifyCode.content;
            let smsCodeSub = Observable.timer(1000, 1000).subscribe({
              next: (val) => {
                this.codeBtnTip = `${this.canSmsCodeGetAgain - val}s 后重发`;
                if (val == this.canSmsCodeGetAgain) {
                  this.codeBtnTip = '获取验证码';
                  this.getSmsCode = -2;
                  smsCodeSub.unsubscribe();
                }
              }
            });
          } else {
            this.utilService.showToast(smsVerifyCode.msg);
          }
        });
      } else {
        this.utilService.showToast('请输入正确的手机号');
      }
    } else {
      this.utilService.showToast('请输入手机号');
    }
  }

  userLogin(phone, code) {
    if (!phone) {
      this.utilService.showToast('请输入手机号');
      return false;
    }
    if (!code) {
      this.utilService.showToast('请输入短信验证码');
      return false;
    }
    if (this.getSmsCode == -2) {
      this.utilService.showToast('验证码已失效，请重新获取');
      return false;
    }
    if (Number(code.trim()) !== this.getSmsCode) {
      this.utilService.showToast('验证码错误，请重新输入');
      return false;
    }
    this.utilService.showLoading('登录中，请稍后');
    this.protocolService.userLogin(phone, code).then((login) => {
      this.utilService.closeLoading();
      if (login && (login.error === 'timeout' || login.error === 'neterr')) {
        if (login.error === 'timeout') {
          this.utilService.showToast('登录请求超时，请稍后重试');
        } else if (login.error === 'neterr') {
          this.utilService.showToast('网络异常，请稍后重试');
        }
        return false;
      }
      if (login.result === 1) {
        let userInfo: UserInfo = JSON.parse(login.content);
        this.storageService.setUserInfo(userInfo);
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.utilService.showToast(login.msg);
      }
    });
  }

}
