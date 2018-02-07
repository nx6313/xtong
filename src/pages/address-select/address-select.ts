import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController, NavParams, Platform } from 'ionic-angular';

import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { EventsService } from '../../providers/events-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { SelectMarkerAddress } from '../../model/position';

declare var AMap;

@IonicPage()
@Component({
  selector: 'page-address-select',
  templateUrl: 'address-select.html',
})
export class AddressSelectPage {
  @ViewChild('addressMapContainer', { read: ElementRef }) _addressMapContainer: ElementRef;
  @ViewChild('addressInputElem', { read: ElementRef }) _addressInputElem: ElementRef;

  addressInputVal: string = '';
  selectAddressPosition: SelectMarkerAddress = null;

  addressMap: any = null;
  placeSearch: any = null;
  autocomplete: any = null;

  constructor(public viewCtrl: ViewController,
    private platform: Platform,
    public navParams: NavParams,
    private storageService: StorageService,
    private protocolService: ProtocolService,
    private eventsService: EventsService,
    private utilService: UtilService,
    private logService: LogService) {
  }

  ionViewDidEnter() {
    this.eventsService.subscribe('page-address-select:goToBack', () => {
      this.eventsService.unsubscribe('page-address-select:goToBack');
      this.viewCtrl.dismiss();
    });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.addressMap = new AMap.Map(this._addressMapContainer.nativeElement, { mapStyle: 'fresh', showBuildingBlock: true, viewMode: '3D', pitch: 20 });
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      this.addressMap.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.plugin('AMap.Autocomplete', () => {
        var autoOptions = {
          city: '', //城市，默认全国
          input: this._addressInputElem.nativeElement
        };
        this.autocomplete = new AMap.Autocomplete(autoOptions);
      })
      AMap.event.addListener(this.autocomplete, "select", (selectedPoi) => {
        this.addressInputVal = selectedPoi.poi.name;
        this.searchAddress();
      });
      AMap.service('AMap.PlaceSearch', () => {
        this.placeSearch = new AMap.PlaceSearch({
          map: this.addressMap
        });
      });
      AMap.event.addListener(this.placeSearch, "markerClick", (selectedMarker) => {
        this.logService.log('JSON[选择的地址]', selectedMarker.data);
        this.selectAddressPosition = selectedMarker.data;
      });
    });
  }

  addressInputChange() {
    if (this.addressInputVal) {
      this.autocomplete.search(this.addressInputVal.trim(), (status, result) => {
        this.logService.log('JSON[获取输入地址联想]', {
          '返回地址信息状态': status,
          '地址信息结果': result
        });
      });
    }
  }

  searchAddress() {
    if (this.addressInputVal) {
      this.placeSearch.search(this.addressInputVal.trim(), (status, result) => {
        this.logService.log('JSON[检索地址]', {
          '返回地址信息状态': status,
          '地址信息结果': result
        });
      });
    }
  }

  useAddress() {
    this.eventsService.unsubscribe('page-address-select:goToBack');
    this.viewCtrl.dismiss({
      selectAddress: this.selectAddressPosition
    });
  }

}
