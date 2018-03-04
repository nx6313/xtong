import { Component, ViewChild, Input, Output, OnInit, EventEmitter, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { UtilService } from '../../providers/util-service';
import { TabObj } from '../../model/comm';

declare var MarLog;

@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
  @Output('rightClickFn') rightClickFn = new EventEmitter<any>();
  @Output('titleTabChange') titleTabChangeFn = new EventEmitter<any>();
  @ViewChild('titleBarTxt', { read: ElementRef }) _titleBarTxt: ElementRef;
  @Input() title: string = '';
  @Input('titleTabs') titleTabs: Array<TabObj> = [];
  @Input() leftIcon: string = '';
  @Input() rightIcon: string = '';
  @Input() rightTxt: string = '';
  @Input('directBack') directBackFlag: Boolean = false;

  constructor(public navCtrl: NavController,
    private platform: Platform,
    private utilService: UtilService) {
    this.title != '' ? {} : this.title = '效通';
    this.leftIcon != '' ? {} : this.leftIcon = 'icon-left-hmj';
    this.rightIcon != '' ? {} : this.rightIcon = '';
    this.rightTxt != '' ? {} : this.rightTxt = '';
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      MarLog.bind(this._titleBarTxt.nativeElement);
    });
  }

  back() {
    this.utilService.goToBack(this.navCtrl, this.directBackFlag);
  }

  rightClick() {
    this.rightClickFn.emit(this);
  }

  clearSelected(newSelected, index) {
    let curSelectedId = '';
    this.titleTabs.forEach((value, index) => {
      if (value.selected) {
        curSelectedId = value.id;
      }
      value.selected = false;
    });
    if (curSelectedId !== newSelected.id) {
      this.titleTabChangeFn.emit({
        index: index,
        id: newSelected.id
      });
    }
  }

}
