import { Component } from '@angular/core';

import { TaskPage } from '../task/task';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = TaskPage;
  tab2Root = AboutPage;

  constructor() {

  }
}
