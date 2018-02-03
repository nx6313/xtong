import { Component } from '@angular/core';

@Component({
  selector: 'switch-page',
  templateUrl: 'switch-page.html'
})
export class SwitchPageComponent {
  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
