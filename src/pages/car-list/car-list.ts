import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabObj } from '../../model/comm';
import { SwitchPagesComponent } from '../../components/switch-pages/switch-pages';

@IonicPage()
@Component({
  selector: 'page-car-list',
  templateUrl: 'car-list.html',
})
export class CarListPage {
  private switchPages: SwitchPagesComponent;

  carPageTitleTabs: Array<TabObj> = [
    new TabObj().setId('car-list').setTxt('车辆列表').setKeyword('list').setSelected(true),
    new TabObj().setId('car-map').setTxt('司机地图').setKeyword('map')
  ];
  switchTabsForCar: Array<TabObj> = [
    new TabObj().setId('car_list').setTxt('车辆列表隐藏指示器').setKeyword('carList'),
    new TabObj().setId('car_map').setTxt('司机地图隐藏指示器').setKeyword('carMap')
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  titleTabChange(params) {
    this.switchPages.skipToPage(params.index);
  }

  switchChange(params) {
  }

}
