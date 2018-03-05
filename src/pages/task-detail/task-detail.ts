import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { UtilService } from '../../providers/util-service';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { EventsService } from '../../providers/events-service';
import { LogService } from '../../providers/log-service';
import { Remand } from '../../model/remand';

@IonicPage()
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
})
export class TaskDetailPage {
  taskData: Remand = new Remand();

  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private utilService: UtilService,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService,
    private logService: LogService) {
  }

  ionViewDidEnter() {
    this.eventsService.subscribe('taskDetailPage:goToBack', () => {
      this.eventsService.unsubscribe('taskDetailPage:goToBack');
      this.logService.log('任务详情页面获取到事件触发：taskDetailPage:goToBack');
      this.viewCtrl.dismiss();
    });
    this.taskData = this.navParams.get('taskData');
    console.log(this.taskData);
  }

  ionViewDidLoad() {
  }
  
  updateRemand() {
    
  }

}
