import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LogService } from '../../providers/log-service';

declare var AMap;

@Component({
  selector: 'address-map',
  templateUrl: 'address-map.html'
})
export class AddressMapComponent {
  @Output('initMap') initMapFn = new EventEmitter<any>();
  @Output('clickMap') clickMapFn = new EventEmitter<any>();
  @ViewChild('addressMapContainer', { read: ElementRef }) _addressMapContainer: ElementRef;
  @Input('shade') shade: boolean = false;

  mapParams: {
    startName?: string, startLat?: number, startLng?: number,
    endName?: string, endLat?: number, endLng?: number
  } = {
      startName: '', startLat: 0.0, startLng: 0.0,
      endName: '', endLat: 0.0, endLng: 0.0
    };

  addressMap: any = null;

  constructor(private platform: Platform,
    private logService: LogService) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.addressMap = new AMap.Map(this._addressMapContainer.nativeElement, { mapStyle: 'fresh', showBuildingBlock: true, viewMode: '3D', pitch: 20 });
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: false,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      this.initMapFn.emit({
        map: this.addressMap,
        geolocation: geolocation,
        aMap: AMap,
        mapParams: this.mapParams
      });
    });
  }

  private clickMap() {
    this.clickMapFn.emit({
      mapParams: this.mapParams
    });
  }

}
