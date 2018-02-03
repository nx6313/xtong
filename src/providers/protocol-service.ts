import { Injectable } from '@angular/core';

import { StorageService } from './storage-service';
import { HttpService } from "./http-service";
import { UtilService } from "./util-service";


@Injectable()
export class ProtocolService {
  API_URL: string = 'http://we.hmjjz.com/';
  constructor(
    private httpService: HttpService,
    private userData: StorageService,
    private utilService: UtilService) {
    if (this.utilService.isWeb()) {
      this.API_URL = 'http://localhost:8100';
    }
  }

  /**
   * 用户登录（用户名、密码 / 验证码登录）
   * @param username
   * @param password
   */
  userLogin(username: string, password?: string, verifycode?: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=index&m=hmj_housekeep";
    var body = { 'username': username };
    if (password) {
      body['password'] = password;
    }
    if (verifycode) {
      body['verifycode'] = verifycode;
    }
    return this.httpService.makePost(url, body, '用户登录');
  }

  /**
   * 获取登陆短信验证码
   * @param username
   */
  loginSmsVerifyCode(username: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=index&op=logverifycode&m=hmj_housekeep";
    var body = { 'username': username };
    return this.httpService.makePost(url, body, '获取登录短信验证码');
  }

  /**
   * 用户注册（手机号、密码、验证码注册）
   * @param mobile
   * @param password
   * @param verifycode
   */
  userRegister(mobile: string, password: string, verifycode: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=register&m=hmj_housekeep";
    var body = { 'mobile': mobile, 'password': password, 'verifycode': verifycode };
    return this.httpService.makePost(url, body, '用户注册');
  }

  /**
   * 获取注册短信验证码
   * @param mobile
   */
  registerSmsVerifyCode(mobile: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=register&op=verifycode&m=hmj_housekeep";
    var body = { 'mobile': mobile };
    return this.httpService.makePost(url, body, '获取注册短信验证码');
  }

  /**
   * 登陆忘记密码
   * @param mobile
   */
  loginForgetPwd(mobile: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=register&op=forget_pass&m=hmj_housekeep";
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
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=register&op=reset_pass&m=hmj_housekeep";
    var body = { 'mobile': mobile, 'password': password, 'verifycode': verifycode };
    return this.httpService.makePost(url, body, '重置登录密码');
  }

  /**
   * 设置用户工种
   * @param mobile
   * @param password
   * @param verifycode
   */
  setWorkType(workType: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=main&op=work_type&m=hmj_housekeep";
    var body = { 'id': this.userData.userInfo.userId, 'work_type': workType };
    return this.httpService.makePost(url, body, '设置用户工种');
  }

  /**
   * 获取当前状态
   */
  getCurStatus() {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=status&m=hmj_housekeep";
    var body = { 'id': this.userData.userInfo.userId };
    return this.httpService.makePost(url, body, '获取当前状态');
  }

  /**
   * 改变当前状态
   * @param userid
   */
  changeCurStatus() {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=bush&do=status&m=hmj_housekeep";
    var body = { 'userid': this.userData.userInfo.userId };
    return this.httpService.makePost(url, body, '改变当前状态');
  }

  /**
   * 保存当前位置
   * @param id
   * @param lon
   * @param lat
   */
  getCurLocation(lon: string, lat: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=main&op=location&m=hmj_housekeep";
    var body = { 'id': this.userData.userInfo.userId, 'lon': lon, 'lat': lat };
    return this.httpService.makePost(url, body, '更新服务人员位置坐标');
  }

  /**
   * 获取订单列表
   * @param page
   */
  getOrderList(pageIndex: number, filterParams: {} = null) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=order&m=hmj_housekeep";
    var body = { 'page': pageIndex };
    var workType = this.userData.userInfo.workType;
    workType ? body['work_type'] = workType : {};
    if (filterParams != null) {
      for (let filterParam in filterParams) {
        filterParams[filterParam] ? body[filterParam] = filterParams[filterParam] : {};
      }
    }
    return this.httpService.makePost(url, body, '获取订单列表');
  }

  /**
   * 获取订单详情
   * @param id 订单id
   */
  getOrderDetail(orderId: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=detail&do=order&m=hmj_housekeep";
    var body = { 'id': orderId };
    return this.httpService.makePost(url, body, '获取订单详情');
  }

  /**
   * 获取接单数据
   */
  getReceiverOrder() {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=detail&dd=personal&do=order&m=hmj_housekeep";
    var body = { 'id': this.userData.userInfo.userId };
    return this.httpService.makePost(url, body, '获取已接任务数据');
  }

  /**
   * 接单
   * @param userid
   * @param id 订单id
   */
  receiveOrder(orderId: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=detail&dd=jiedan&do=order&m=hmj_housekeep";
    var body = { 'userid': this.userData.userInfo.userId, 'id': orderId };
    return this.httpService.makePost(url, body, '接取任务');
  }

  /**
   * 报价
   * @param id 订单id
   * @param money
   */
  orderOffer(orderId: string, money: number) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=detail&dd=baojia&do=order&m=hmj_housekeep";
    var body = { 'id': orderId, 'money': money };
    return this.httpService.makePost(url, body, '进行报价');
  }

  /**
   * 开始任务
   * @param id 订单id
   * @param money
   */
  startWork(orderId: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=detail&dd=startwork&do=order&m=hmj_housekeep";
    var body = { 'id': orderId };
    return this.httpService.makePost(url, body, '开始任务');
  }

  /**
   * 结束任务
   * @param id 订单id
   * @param money
   */
  stopWork(orderId: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=detail&dd=stopwork&do=order&m=hmj_housekeep";
    var body = { 'id': orderId };
    return this.httpService.makePost(url, body, '结束任务');
  }

  /**
   * 个人中心数据
   * @param id 员工id
   */
  userCenter(userId: string) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=userc&op=center&m=hmj_housekeep";
    var body = { 'id': userId };
    return this.httpService.makePost(url, body, '获取个人中心数据');
  }

  /**
   * 获取筛选分类
   */
  filterClass() {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&op=typeclass&do=order&m=hmj_housekeep";
    var body = {};
    return this.httpService.makePost(url, body, '获取筛选分类');
  }

  /**
   * 获取地区列表
   */
  supportCity() {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=main&op=region&m=hmj_housekeep";
    var body = {};
    return this.httpService.makePost(url, body, '获取支持城市列表');
  }

  /**
   * 进行提现操作
   */
  takeCash(cutMoney: Number) {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=userc&op=commisson&m=hmj_housekeep";
    var body = { id: this.userData.userInfo.userId, cut: cutMoney };
    return this.httpService.makePost(url, body, '进行提现操作');
  }

  /**
   * 查询提现记录
   */
  takeCashHistory() {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=userc&op=commisson_log&m=hmj_housekeep";
    var body = { id: this.userData.userInfo.userId };
    return this.httpService.makePost(url, body, '查询提现记录');
  }

  /**
   * 查询历史任务
   */
  taskHistory() {
    var url = this.API_URL + "/app/index.php?i=2&c=entry&do=userc&op=task_list&m=hmj_housekeep";
    var body = { id: this.userData.userInfo.userId };
    return this.httpService.makePost(url, body, '查询历史任务');
  }

  /**
   * 获取APP最后版本信息
   * @param appType：'1：android' / :2：ios'
   * @return { note, time, appType, appUrl, versionNumber }
   */
  requestNewAppVersion(appType: string) {
    var url = this.API_URL + "/getNewAppVersion.do";
    var body = { 'appType': appType };
    return this.httpService.makePost(url, body, '获取APP最后版本信息');
  }
}