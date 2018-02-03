import { Component, ViewChild, Input, Output, OnInit, EventEmitter, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { UtilService } from '../../providers/util-service';

declare var MarLog;

@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
  @Output('rightClickFn') rightClickFn = new EventEmitter<any>();
  @ViewChild('titleBarTxt', { read: ElementRef }) _titleBarTxt: ElementRef;
  @Input() title: string = '';
  @Input() leftIcon: string = '';
  @Input() rightIcon: string = '';
  @Input() rightTxt: string = '';

  constructor(public navCtrl: NavController,
    private platform: Platform,
    private utilService: UtilService) {
    this.title != '' ? {} : this.title = '效通';
    this.leftIcon != '' ? {} : this.leftIcon = '';
    this.rightIcon != '' ? {} : this.rightIcon = '';
    this.rightTxt != '' ? {} : this.rightTxt = '';
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      MarLog.bind(this._titleBarTxt.nativeElement);
    });
  }

  back() {
    this.utilService.goToBack(this.navCtrl);
  }

  rightClick() {
    this.rightClickFn.emit(this);
  }

}
