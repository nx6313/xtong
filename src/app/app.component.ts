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
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { CompleteInfoPage } from '../pages/complete-info/complete-info';
enableProdMode(); // 调用此函数，启用生产模式

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  backButtonPressed: boolean = false;
  rootPage: any = null;

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private utilService: UtilService,
    private logService: LogService,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService) {
    this.initPageRoot();
    platform.ready().then(() => {
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#343B4C');
      this.registerBackButtonAction();
    });
  }

  initPageRoot() {
    this.storageService.checkInPageRoot().then((rootType) => {
      if (rootType == 'welcome') {
        this.rootPage = WelcomePage;
      } else if (rootType == 'login') {
        this.rootPage = LoginPage;
      } else if (rootType == 'completeInfo') {
        this.rootPage = CompleteInfoPage;
      } else {
        this.rootPage = TabsPage;
      }
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
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
