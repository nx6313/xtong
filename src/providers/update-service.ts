import { ProtocolService } from './protocol-service';
import { StorageService } from './storage-service';
import { Injectable } from '@angular/core';
import { AlertController, ToastController, Platform, ModalController } from 'ionic-angular';

import { AppVersion } from '@ionic-native/app-version';

import { UtilService } from './util-service';


@Injectable()
export class UpdateService {
  newVersionPage: String = 'NewVersionPage';
  localVersionCode: string;
  localVersionName: string;
  androidUrl: string;
  iosUrl: string;

  constructor(public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private appVersion: AppVersion,
    private userData: StorageService,
    private util: UtilService,
    private userService: ProtocolService) {
    this.appVersion.getVersionCode().then(data => {
      // 这里返回值会在 AndroidManifest 文件中的VersionCode 值的基础上 追加 2，是否为 Bug？
      this.localVersionCode = (data + '').substr(0, (data + '').length - 1);
      console.log('版本内部比较值：' + this.localVersionCode);
    });
    this.appVersion.getVersionNumber().then(data => {
      this.localVersionName = data;
      console.log('版本显示值：' + this.localVersionName);
    });
  }

  /**
  * 检查并且升级
  */
  checkAndUpgrade(check: boolean) {
    let appType = 'web';
    if (this.util.isMobile()) {
      if (this.util.isAndroid()) {
        appType = '1'; // android
      } else if (this.util.isIos()) {
        appType = '2'; // ios
      }
    }
    if (appType != 'web') {
      this.util.showLoading('正在获取更新，请稍后');
      this.userService.requestNewAppVersion(appType).then(data => {
        this.util.closeLoading();
        console.log('版本更新获取到参数：' + JSON.stringify(data));
        if (data.result == 1) {
          if (appType == '1') {
            // android
            this.androidUrl = data.version.appUrl;
          } else if (appType == '2') {
            // ios
            this.iosUrl = data.version.appUrl;
          }
          console.log('服务器最新版本：' + data.version.versionCode + ' --> 本地版本：' + Number(this.localVersionCode) + ' ==> 是否需要更新：' + (data.version.versionCode > Number(this.localVersionCode)));
          if (Number(data.version.versionCode) > Number(this.localVersionCode)) {
            let newVersionPopModal = this.modalCtrl.create(this.newVersionPage, {
              versionData: {
                note: data.version.note,
                appUrl: data.version.appUrl,
                time: data.version.time,
                versionNumber: data.version.versionNumber
              }
            });
            newVersionPopModal.present();
          } else {
            if (!check) {
              console.log('新版本检测:这已经是最新版本');
              this.util.showToast('已经是最新版本啦');
            }
          }
        } else {
          console.log('获取新版本错误:' + JSON.stringify(data));
        }
      });
    } else {
      console.log('非真机环境，在真机环境下执行版本更新操作');
    }
  }

}
