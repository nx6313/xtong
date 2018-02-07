

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EventsService } from './events-service';

import { UserInfo } from '../model/user';
import { LogService } from './log-service';

@Injectable()
export class StorageService {
  userInfo: {
    userId?: string,
    workType?: string
  } = {
      userId: '',
      workType: ''
    };
  userAddress: {
    cityCode?: string, // 每次获取到定位后，设置
    formattedAddress?: string, // 每次获取到定位后，设置
    position?: any, // 每次获取到定位后，设置
    curInLocation?: any // 保存用户当前位置，用于首页定位显示
  } = {
      cityCode: '',
      formattedAddress: '',
      position: {},
      curInLocation: {}
    };
  supportCity: {
    'province_name'?: string
    'city'?: Array<any>
  } = {
      'province_name': '',
      'city': new Array<any>()
    };
  filterBaseData: {
    filterClass: Array<{ id: string, name: string, tclass: Array<{ id: string, name: string, icon: string }> }>,
    filterZongSelectedId?: string,
    filterQuyuSelectedId?: string,
    filterClassSelectedId?: string
  } = {
      filterClass: [],
      filterZongSelectedId: '',
      filterQuyuSelectedId: '',
      filterClassSelectedId: ''
    };

  constructor(private events: EventsService,
    private storage: Storage,
    private logService: LogService) {
  }

  // 判断是否为第一次使用系统（是否显示欢迎页使用）
  isFirstIn() {
    return this.storage.get('firstIn').then((value) => {
      return value;
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
    this.userInfo.userId = userInfo.userId;
    userInfo.workType ? this.userInfo.workType = userInfo.workType : {};
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
