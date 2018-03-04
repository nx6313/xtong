import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../providers/storage-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storageService: StorageService) {
  }

  ionViewDidLoad() {
  }

  startUse() {
    this.storageService.setToHasIn();
    this.navCtrl.setRoot(LoginPage);
  }

}
