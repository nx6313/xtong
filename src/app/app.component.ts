import { Component, ViewChild, enableProdMode } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { EventsService } from '../providers/events-service';
import { UtilService } from '../providers/util-service';
import { LogService } from '../providers/log-service';
import { StorageService } from '../providers/storage-service';
import { ProtocolService } from '../providers/protocol-service';
enableProdMode(); // 调用此函数，启用生产模式

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  backButtonPressed: boolean = false;
  rootPage: any = TabsPage;

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private utilService: UtilService,
    private logService: LogService,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService) {
    platform.ready().then(() => {
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#343B4C');
      splashScreen.hide();
      this.registerBackButtonAction();
    });
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      let goToBackReture = this.utilService.goToBack(this.nav);
      if (goToBackReture !== null) {
        return goToBackReture;
      }
      return this.showExit();
    }, 10);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
      this.utilService.showToast('再按一次退出应用', 2000);
      this.backButtonPressed = true;
      setTimeout(() => {
        this.backButtonPressed = false;
      }, 2000);
    }
  }
}
