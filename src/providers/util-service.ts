import { Injectable } from '@angular/core';
import { Nav, NavController, AlertController, LoadingController, ToastController, Platform, Loading, Keyboard } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { StorageService } from './storage-service';
import { LogService } from './log-service';
import { EventsService } from './events-service';

declare var MarLog;
declare var GdLocation;
declare var Picker;
declare var $;

@Injectable()
export class UtilService {
  loading: Loading;

  constructor(public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    private keyboard: Keyboard,
    private toast: Toast,
    private userData: StorageService,
    private logService: LogService,
    private eventsService: EventsService) { }

  isDevice() {
    return this.platform.is('android') && this.platform.is('mobile');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  isWeb() {
    return this.platform.is('mobileweb');
  }

  showAlert(title, message, buttonText) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [buttonText]
    });
    alert.present();
  }

  showPrompt(title, message, inputs, buttonText) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      inputs: inputs,
      buttons: buttonText
    });
    alert.present();
  }

  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: content
    });
    this.loading.present();
  }

  closeLoading() {
    if (this.loading != undefined) {
      this.loading.dismiss();
    }
  }

  // 'top' 'middle' 'bottom'
  private showToasts(message, dur?: number, pos?: string) {
    let duration = dur ? dur : 2000;
    let position = pos ? (pos == 'center' ? 'middle' : pos) : 'bottom';
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

  // 'top' 'center' 'bottom'
  showToast(msg, dur?: number, pos?: string) {
    let duration = dur ? dur : 2000;
    let position = pos ? pos : 'bottom';
    if (!this.isWeb()) {
      let addPixelsY = position == 'bottom' ? -100 : 0;
      this.toast.showWithOptions({
        message: msg,
        duration: duration,
        position: position,
        addPixelsY: addPixelsY,
        styling: {
          opacity: 0.8,
          backgroundColor: '#333333',
          textColor: '#F8F8F8',
          cornerRadius: 6,
          horizontalPadding: 8,
          verticalPadding: 6
        }
      }).subscribe(toast => {
        console.log(toast);
      });
    } else {
      console.log('该Toast仅支持真机显示，将以默认Toast方式显示');
      this.showToasts(msg, duration);
    }
  }

  getRandomNum(min, max) {
    let Range = max - min;
    let Rand = Math.random();
    return (min + Math.round(Rand * Range));
  }

  generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  /**
   * 获取日期字符串(返回ISO 8601格式)
   * @param date 
   * @param dateFormat 
   * @param diff 
   */
  getDateStr(date: Date, dateFormat?: string, diff?: number) {
    if (diff) {
      if (!dateFormat || dateFormat == 'ymd') {
        date.setDate(date.getDate() + diff);
      } else if (dateFormat == 'ymdhm') {
        date.setMinutes(date.getMinutes() + diff);
        if (date.getMinutes() > 50) {
          date.setMinutes(60);
        }
      }
    }
    let year = date.getFullYear() + '';
    let month = (date.getMonth() + 1) + '';
    let date1 = date.getDate() + '';
    let hour = date.getHours() + '';
    let minute = date.getMinutes() + '';
    Number(month) < 10 ? month = '0' + month : {};
    Number(date1) < 10 ? date1 = '0' + date1 : {};
    Number(hour) < 10 ? hour = '0' + hour : {};
    Number(minute) < 10 ? minute = '0' + minute : {};
    if (!dateFormat || dateFormat == 'ymd') {
      return year + '-' + month + '-' + date1;
    } else if (dateFormat == 'ymdhm') {
      return year + '-' + month + '-' + date1 + 'T' + hour + ':' + minute;
    }
  }

  // 格式化日期为字符串
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
  formatDate(date: Date, fmt: string) {
    var o = {
      "M+": date.getMonth() + 1,                 // 月份
      "d+": date.getDate(),                    // 日
      "h+": date.getHours(),                   // 小时
      "m+": date.getMinutes(),                 // 分
      "s+": date.getSeconds(),                 // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "S": date.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  // 触发后退操作
  goToBack(nav: Nav | NavController) {
    // 判断Picker是否显示
    var pickerShow = Picker.isShow();
    if (pickerShow.show) {
      pickerShow.hideFn();
      return false;
    }
    if (this.keyboard.isOpen()) {
      this.keyboard.close();
    }
    let activePage = this.getCurPage();
    this.logService.log('HUE[#E7642B]', '执行后退操作，当前显示页面检测：', activePage.pageName + '『' + activePage.pageType + '』');
    if (activePage.pageName === 'page-welcome') {
      return false;
    }
    if (activePage.pageName !== 'page-login' && activePage.pageName !== 'page-complete-info' && activePage.pageName !== 'page-task' && activePage.pageName !== 'page-about') {
      if (activePage.pageType == 'ionModal') {
        this.eventsService.events.publish(activePage.pageName + ':goToBack');
        return false;
      }
      return nav.pop();
    }
    return null;
  }

  getLocation(sendEvent: Boolean = true, onceFlag: Boolean = false, interval: Number = (60 * 1000)) {
    return new Promise<any>((resolve, reject) => {
      if (this.isMobile()) {
        GdLocation.start(onceFlag, interval, (location) => {
          if (MarLog.getLocationLogFlag()) {
            this.logService.log('JSON[获取到定位信息]', location);
          }
          if (sendEvent) {
            this.eventsService.events.publish('location:sendStart', location);
          }
          resolve(location);
        }, (error) => {
          this.logService.log('JSON[获取定位信息错误]', { error: error });
          reject(error);
        });
      } else {
        resolve({
          'longitude': 112.546058,
          'latitude': 37.795204,
          'address': '模拟地址',
          'city': '太原市',
          'cityCode': '0351',
          'speed': '10',
          'time': ''
        });
      }
    });
  }

  stopGetLocation() {
    if (this.isMobile()) {
      GdLocation.stop();
    } else {
      console.log('非真机环境');
    }
  }

  showRoute(startObj: { startName: string, startLat: number, startLng: number }, endObj: { endName: string, endLat: number, endLng: number }) {
    if (this.isMobile()) {
      GdLocation.showRoute('5a597d0a', startObj, endObj);
    } else {
      console.log('非真机环境');
    }
  }

  // 计算两点坐标距离
  calcNavInfo(oneLatLng: { lat?: number, lng?: number }, twoLatLng: { lat?: number, lng?: number }) {
    return new Promise<number>((resolve, reject) => {
      if (this.isMobile()) {
        GdLocation.calcNavInfo(oneLatLng, twoLatLng, (navInfo) => {
          if (MarLog.getLocationLogFlag()) {
            this.logService.log('JSON[计算得到两点距离]', {
              '坐标点1': oneLatLng,
              '坐标点2': twoLatLng,
              '两坐标点距离': navInfo + ' 米'
            });
          }
          resolve(navInfo);
        }, (error) => {
          this.logService.log('JSON[计算两坐标的距离错误]', { error: error });
          reject(error);
        });
      } else {
        if (MarLog.getLocationLogFlag()) {
          this.logService.log('JSON[计算得到两点距离]', {
            '坐标点1': oneLatLng,
            '坐标点2': twoLatLng,
            '两坐标点距离': '模拟距离'
          });
        }
        resolve(0);
      }
    });
  }

  // 显示当前执行中任务元素
  showCurrentTaskElem(callBack?: Function) {
    if (!document.getElementById('currentTaskElem')) {
      let currentTaskElem = document.createElement('div');
      currentTaskElem.id = 'currentTaskElem';
      currentTaskElem.style.position = 'absolute';
      currentTaskElem.style.display = 'inline-block';
      currentTaskElem.style.left = '20px';
      currentTaskElem.style.fontSize = '0';
      currentTaskElem.style.width = '8rem';
      currentTaskElem.style.height = '8rem';
      currentTaskElem.classList.add('animated');
      currentTaskElem.classList.add('fadeIn');

      let dongingTaskImg = document.createElement('img');
      dongingTaskImg.style.display = 'inline-block';
      dongingTaskImg.src = 'assets/imgs/doing.png';
      dongingTaskImg.style.width = '6rem';
      dongingTaskImg.style.height = '6rem';
      currentTaskElem.appendChild(dongingTaskImg);

      let dongingTaskRoundImg_1 = document.createElement('img');
      dongingTaskRoundImg_1.style.position = 'absolute';
      dongingTaskRoundImg_1.style.top = '-0.4rem';
      dongingTaskRoundImg_1.style.left = '-0.4rem';
      dongingTaskRoundImg_1.style.animation = 'rotate 8s ease 0.3s infinite';
      dongingTaskRoundImg_1.style.display = 'inline-block';
      dongingTaskRoundImg_1.src = 'assets/imgs/doing-wrap.png';
      dongingTaskRoundImg_1.style.width = '6.8rem';
      dongingTaskRoundImg_1.style.height = '6.8rem';
      currentTaskElem.appendChild(dongingTaskRoundImg_1);

      let dongingTaskRoundImg_2 = document.createElement('img');
      dongingTaskRoundImg_2.style.position = 'absolute';
      dongingTaskRoundImg_2.style.top = '-0.7rem';
      dongingTaskRoundImg_2.style.left = '-0.7rem';
      dongingTaskRoundImg_2.style.animation = 'rotatingReverse 10s linear infinite';
      dongingTaskRoundImg_2.style.display = 'inline-block';
      dongingTaskRoundImg_2.src = 'assets/imgs/doing-wrap-1.png';
      dongingTaskRoundImg_2.style.width = '7.4rem';
      dongingTaskRoundImg_2.style.height = '7.4rem';
      currentTaskElem.appendChild(dongingTaskRoundImg_2);

      let dongingTaskRoundImg_3 = document.createElement('img');
      dongingTaskRoundImg_3.style.position = 'absolute';
      dongingTaskRoundImg_3.style.top = '-0.85rem';
      dongingTaskRoundImg_3.style.left = '-0.85rem';
      dongingTaskRoundImg_3.style.animation = 'rotate 12s linear infinite';
      dongingTaskRoundImg_3.style.display = 'inline-block';
      dongingTaskRoundImg_3.src = 'assets/imgs/doing-wrap-2.png';
      dongingTaskRoundImg_3.style.width = '7.7rem';
      dongingTaskRoundImg_3.style.height = '7.7rem';
      currentTaskElem.appendChild(dongingTaskRoundImg_3);

      currentTaskElem.onclick = () => {
        if (callBack && typeof callBack === 'function') {
          callBack();
        }
      };

      let oW, oH;
      currentTaskElem.addEventListener('touchstart', function (e) {
        if (document.getElementById('basePersonSayPop')) {
          $(document.getElementById('basePersonSayPop')).fadeOut();
        }
        let touches = e.touches[0];
        oW = touches.clientX - currentTaskElem.offsetLeft;
        oH = touches.clientY - currentTaskElem.offsetTop;
        document.addEventListener("touchmove", () => { e.preventDefault(); }, false);
      }, false);
      currentTaskElem.addEventListener('touchmove', function (e) {
        var touches = e.touches[0];
        var oLeft = touches.clientX - oW;
        var oTop = touches.clientY - oH;
        currentTaskElem.style.left = oLeft + "px";
        currentTaskElem.style.top = oTop + "px";
      }, false);
      currentTaskElem.addEventListener('touchend', function (e) {
        document.removeEventListener("touchmove", () => { e.preventDefault(); }, false);
        if (parseInt(currentTaskElem.style.top) > document.body.clientHeight - $('div.tabbar').height() - currentTaskElem.offsetHeight) {
          $(currentTaskElem).animate({ top: (document.body.clientHeight - $('div.tabbar').height() - currentTaskElem.offsetHeight) }, 200);
        }
        if (parseInt(currentTaskElem.style.top) < 20) {
          $(currentTaskElem).animate({ top: 20 }, 200);
        }
        if (parseInt(currentTaskElem.style.left) > document.body.clientWidth - currentTaskElem.offsetWidth) {
          $(currentTaskElem).animate({ left: (document.body.clientWidth - currentTaskElem.offsetWidth) }, 200);
        }
        if (parseInt(currentTaskElem.style.left) < 20) {
          $(currentTaskElem).animate({ left: 20 }, 200);
        }
      });

      document.getElementsByClassName('tabs')[0].appendChild(currentTaskElem);
      currentTaskElem.style.top = `calc(${document.body.clientHeight - $('div.tabbar').height() - currentTaskElem.offsetHeight}px)`;
    }
  }

  // 移除当前执行中任务元素
  removeCurrentTaskElem() {
    let currentTaskElem = document.getElementById('currentTaskElem');
    if (currentTaskElem) {
      currentTaskElem.remove();
    }
  }

  // 获取当前活动页面
  getCurPage() {
    let curPage = { pageType: '', pageName: '' };
    // 先判断是否存在模态页面
    // 不存在再从tabs中寻找当前页面
    let ionModal = document.getElementsByTagName('ion-modal');
    if (ionModal && ionModal.length > 0) {
      curPage.pageType = 'ionModal';
      curPage.pageName = $(ionModal[ionModal.length - 1]).find('ion-content').parent().get(0).localName;
    } else {
      let showTabsContentPages = $('ion-nav').find('.show-page').find('ion-content');
      for (let pageIndex = 0; pageIndex < showTabsContentPages.length; pageIndex++) {
        if ($(showTabsContentPages[pageIndex]).parent().is(':visible')) {
          curPage.pageType = 'ionModal';
          curPage.pageName = $(showTabsContentPages[pageIndex]).parent().get(0).localName;
        }
      }
    }
    return curPage;
  }

}
