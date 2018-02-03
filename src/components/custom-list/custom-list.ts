import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Platform } from 'ionic-angular';
import { CustomList } from '../../model/comm';

@Component({
  selector: 'custom-list',
  templateUrl: 'custom-list.html'
})
export class CustomListComponent {
  @Input('cssStyle') cssStyle: {} = {};
  @Input('data') listArr: Array<CustomList> = [];

  dataBindContainer: {} = {}; // 数据绑定容器

  constructor(private platform: Platform,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    for (let index in this.listArr) {
      if (this.listArr[index].ngBind !== '') {
        this.dataBindContainer[this.listArr[index].ngBind] = this.listArr[index].initVal ? this.listArr[index].initVal : '';
      }
    }
    this.cd.detectChanges();
  }

  // 提供方法，设置列表中的数据
  setListDataByNgName(ngName, val) {
    if (this.dataBindContainer[ngName] !== undefined) {
      this.dataBindContainer[ngName] = val;
      this.cd.detectChanges();
    }
  }

}
