import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EventsService } from './events-service';

import { UserInfo } from '../model/user';
import { LogService } from './log-service';

@Injectable()
export class StorageService {
  userInfo: { staffId?: string, merchantId?: string } = { staffId: '', merchantId: '' };
  userLocation: { staffId?: string, merchantId?: string } = { staffId: '', merchantId: '' };

  constructor(private events: EventsService,
    private storage: Storage,
    private logService: LogService) {
    this.getUserInfo().then((userInfo) => {
      if (userInfo) {
        this.userInfo.staffId = userInfo.staffId;
        this.userInfo.merchantId = userInfo.merchant.merchantId;
      }
    });
  }

  // 判断进入系统时，需要显示的主页面是哪个
  checkInPageRoot() {
    return this.storage.get('firstIn').then((first) => {
      if (!first) {
        // 第一次使用，显示欢迎页面
        return 'welcome';
      } else {
        return this.storage.get('userInfo').then((user) => {
          if (!user) {
            // 显示登录页面
            return 'login';
          } else {
            let userInfo: UserInfo = user;
            // 显示主页
            return user;
          }
        });
      }
    });
  }

  // 设置为已经使用系统（是否显示欢迎页使用）
  setToHasIn() {
    this.storage.set('firstIn', true);
  }

  /**
   * 通知退出登录事件
   */
  logout() {
    this.storage.clear();
    this.setToHasIn();
    this.events.events.publish('user:logout');
  }

  /**
   * 设置登录用户的信息到本地数据库
   */
  setUserInfo(userInfo: UserInfo) {
    this.storage.set('userInfo', userInfo);
    this.userInfo.staffId = userInfo.staffId;
    this.userInfo.merchantId = userInfo.merchant.merchantId;
  }

  /**
   * 从本地数据库获取登录用户的信息
   */
  getUserInfo() {
    return this.storage.get('userInfo').then((value) => {
      let userInfo: UserInfo = value;
      return userInfo;
    });
  }

}
