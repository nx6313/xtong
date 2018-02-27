import { Injectable } from '@angular/core';

import { StorageService } from './storage-service';
import { HttpService } from "./http-service";
import { UtilService } from "./util-service";
import { Demand } from '../entities/demand';


@Injectable()
export class ProtocolService {
  API_URL: string = 'http://59.110.41.155:8888/';
  constructor(
    private httpService: HttpService,
    private userData: StorageService,
    private utilService: UtilService) {
    if (this.utilService.isWeb()) {
      this.API_URL = 'http://localhost:8100/';
    }
  }

  /**
   * 获取登陆短信验证码
   * @param username
   */
  loginSmsVerifyCode(userPhone: string) {
    var url = this.API_URL + "configure/getCaptcha";
    var body = { 'phone': userPhone };
    return this.httpService.makePost(url, body, '获取登录短信验证码');
  }

  /**
   * 用户登录（用户名、密码 / 验证码登录）
   * @param username
   * @param password
   */
  userLogin(userPhone: string, verifycode: string) {
    var url = this.API_URL + "login/staff";
    var body = { 'phone': userPhone, 'smsCode': verifycode };
    return this.httpService.makePost(url, body, '用户登录');
  }

  /**
   * 登陆忘记密码
   * @param mobile
   */
  loginForgetPwd(mobile: string) {
    var url = this.API_URL + "";
    var body = { 'mobile': mobile };
    return this.httpService.makePost(url, body, '获取重置密码短信验证码');
  }

  /**
   * 登陆重置密码
   * @param mobile
   * @param password
   * @param verifycode
   */
  loginResetPwd(mobile: string, password: string, verifycode: string) {
    var url = this.API_URL + "";
    var body = { 'mobile': mobile, 'password': password, 'verifycode': verifycode };
    return this.httpService.makePost(url, body, '重置登录密码');
  }

  // 添加需求
  demandAdd(demand: Demand) {
    var url = this.API_URL + "demand/add";
    var body = demand;
    return this.httpService.makePost(url, body, '添加需求');
  }

  /**
   * 获取需求列表
   * @param page
   */
  getDemandList(pageIndex: number, filterParams: { status?: string, startDate?: string, endDate?: string } = null, pageSize: number = 20) {
    var url = this.API_URL + "demand/list";
    var body = { 'pageIndex': pageIndex, 'pageSize': pageSize, 'staffId': this.userData.userInfo.staffId, 'merchantId': this.userData.userInfo.merchantId };
    if (filterParams != null) {
      for (let filterParam in filterParams) {
        filterParams[filterParam] ? body[filterParam] = filterParams[filterParam] : {};
      }
    }
    return this.httpService.makePost(url, body, '获取需求列表');
  }

  /**
   * 获取APP最后版本信息
   * @param appType：'1：android' / :2：ios'
   * @return { note, time, appType, appUrl, versionNumber }
   */
  requestNewAppVersion(appType: string) {
    var url = this.API_URL + "/getNewAppVersion";
    var body = { 'appType': appType };
    return this.httpService.makePost(url, body, '获取APP最后版本信息');
  }
}