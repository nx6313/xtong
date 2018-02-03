import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'list-caption',
  templateUrl: 'list-caption.html'
})
export class ListCaptionComponent {
  @Input() style: string = '';

  constructor() {
    this.style != '' ? {} : this.style = '1';
  }

  ngOnInit() {
  }

}
