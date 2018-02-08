import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, ViewController, NavParams, Platform } from 'ionic-angular';

import { StorageService } from '../../providers/storage-service';
import { ProtocolService } from '../../providers/protocol-service';
import { EventsService } from '../../providers/events-service';
import { UtilService } from '../../providers/util-service';
import { LogService } from '../../providers/log-service';
import { SelectMarkerAddress } from '../../model/position';

declare var AMap;
declare var AMapUI;

@IonicPage()
@Component({
  selector: 'page-address-select',
  templateUrl: 'address-select.html',
})
export class AddressSelectPage {
  @ViewChild('addressMapContainer', { read: ElementRef }) _addressMapContainer: ElementRef;

  addressSelfVal: string = '';
  addressInputVal: string = '';
  selectAddressPosition: SelectMarkerAddress = null;

  locationType: string = 'input';
  addressMap: any = null;
  userCityCode: string = ''; // 用户所在城市编号，地址联想使用，在定位后赋值; 为空时默认全国范围
  placeSearch: any = null;
  autocomplete: any = null;
  positionPicker: any = null;
  autoGetPoiArr: Array<any> = [];

  constructor(public viewCtrl: ViewController,
    private platform: Platform,
    public navParams: NavParams,
    private cd: ChangeDetectorRef,
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
      this.addressMap = new AMap.Map(this._addressMapContainer.nativeElement, {
        mapStyle: 'fresh',
        zoom: 16
      });
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
      AMap.event.addListener(geolocation, 'complete', (data) => {
        this.logService.log('JSON[获取到用户定位]', {
          '地址信息结果': data
        });
        if (data.info === 'SUCCESS') {
          this.addressInputVal = '';
          this.addressSelfVal = data.formattedAddress;
          this.selectAddressPosition = new SelectMarkerAddress(data.formattedAddress, data.position);
          this.userCityCode = data.addressComponent.citycode;
          this.cd.detectChanges();
        }
        AMap.plugin('AMap.Autocomplete', () => {
          var autoOptions = {
            city: this.userCityCode,
            citylimit: true
          };
          this.autocomplete = new AMap.Autocomplete(autoOptions);
        })
      });
      AMap.service('AMap.PlaceSearch', () => {
        this.placeSearch = new AMap.PlaceSearch({
          pageSize: 1,
          map: this.addressMap,
          autoFitView: true
        });
      });
      AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
        this.positionPicker = new PositionPicker({
          mode: 'dragMap', //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: this.addressMap
        });
        this.positionPicker.on('success', (positionResult) => {
          this.logService.log('JSON[获取地图拖拽选址信息]', {
            '地址信息结果': positionResult
          });
          if (positionResult.info == 'OK') {
            this.addressInputVal = positionResult.address;
            this.selectAddressPosition = new SelectMarkerAddress(positionResult.address, positionResult.position);
            this.cd.detectChanges();
          }
        });
        this.positionPicker.on('fail', (positionResult) => {
          this.utilService.showToast('选址信息错误，请重新选择');
          this.addressInputVal = '';
          this.selectAddressPosition = null;
          this.cd.detectChanges();
        });
      });
    });
  }

  addressInputChange() {
    this.addressSelfVal = '';
    this.selectAddressPosition = null;
    this.addressMap.clearMap();
    if (this.locationType != 'input') {
      this.locationType = 'input';
      this.utilService.showToast('已切换为输入选址方式');
      this.positionPicker.stop();
    }
    if (this.addressInputVal) {
      this.autocomplete.search(this.addressInputVal.trim(), (status, result) => {
        this.logService.log('JSON[获取输入地址联想]', {
          '返回地址信息状态': status,
          '地址信息结果': result
        });
        if (result.tips) {
          this.autoGetPoiArr = [].concat(result.tips)
        } else {
          this.autoGetPoiArr = [];
        }
        this.cd.detectChanges();
      });
    } else {
      this.autoGetPoiArr = [];
      this.cd.detectChanges();
    }
  }

  selectOnePoi(selectedPoi) {
    this.addressInputVal = selectedPoi.name;
    this.searchAddress();
    this.autoGetPoiArr = [];
    this.cd.detectChanges();
  }

  searchAddress() {
    if (this.addressInputVal) {
      this.placeSearch.search(this.addressInputVal.trim(), (status, result) => {
        this.logService.log('JSON[检索地址]', {
          '返回地址信息状态': status,
          '地址信息结果': result
        });
        if (status === 'complete' && result.info === 'OK' && result.poiList.count > 0) {
          this.selectAddressPosition = result.poiList.pois[0];
        } else {
          this.selectAddressPosition = null;
          this.addressInputVal = '';
          this.utilService.showToast('该位置未找到');
        }
        this.cd.detectChanges();
      });
    }
  }

  useAddress() {
    this.eventsService.unsubscribe('page-address-select:goToBack');
    this.viewCtrl.dismiss({
      selectAddress: this.selectAddressPosition
    });
  }

  changeLocationType() {
    this.addressSelfVal = '';
    this.addressInputVal = '';
    this.autoGetPoiArr = [];
    this.selectAddressPosition = null;
    this.addressMap.clearMap();
    this.cd.detectChanges();
    this.locationType == 'input' ? (() => {
      this.locationType = 'positionPicker';
      this.utilService.showToast('已切换为地图选址方式');
      this.positionPicker.start();
    })() : (() => {
      this.locationType = 'input';
      this.utilService.showToast('已切换为输入选址方式');
      this.positionPicker.stop();
    })();
  }

}
