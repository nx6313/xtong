import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompleteInfoPage } from './complete-info';

@NgModule({
  declarations: [
    CompleteInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CompleteInfoPage),
  ],
})
export class CompleteInfoPageModule {}
