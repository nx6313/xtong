import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { EventsService } from './events-service';
import { LogService } from '../providers/log-service';
import { Result } from '../model/comm';

@Injectable()
export class HttpService {
  myInfoLocal: any;
  local: Storage;
  constructor(
    private http: Http,
    private events: EventsService,
    private logService: LogService) {
  }

  public makePost(url: string, body: any, tip?: string) {
    let startTimeZ = new Date().getTime();
    let requestNo = tip ? ' - ' + tip : '';
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options).timeout(10 * 1000).toPromise()
      .then(res => {
        let requestUseTime = (new Date().getTime() - startTimeZ) / 1000;
        this.logService.log('JSON[接口请求' + requestNo + '，耗时：' + requestUseTime + ' 秒]', { '请求地址': url, '参数': body, '返回值': res.json() });
        return <Result>res.json();
      })
      .catch(err => {
        this.logService.log('JSON[>>> 接口访问异常 <<< ' + requestNo + ']', { '请求地址': url, '参数': body, '错误信息': err });
        if (err.ok === false) {
          return <Result>{ error: 'neterr' };
        } else if (err.name === 'TimeoutError') {
          return <Result>{ error: 'timeout' };
        } else {
          this.handleError(err, url, body, requestNo);
        }
      });
  }

  private handleError(error: Response, url: string = '', body: any = null, requestNo: string) {
    return Observable.throw(error || 'Server Error');
  }
}
