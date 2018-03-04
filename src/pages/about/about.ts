import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  carListPage: any = 'CarListPage';

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private logService: LogService,
    private utilService: UtilService) {

  }

  toCarList() {
    let carListModal = this.modalCtrl.create(this.carListPage);
    carListModal.onDidDismiss(() => {
      this.logService.log('从车辆列表页面返回');
    });
    carListModal.present();
  }

}
