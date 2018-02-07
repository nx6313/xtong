import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemandAddPage } from './remand-add';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RemandAddPage,
  ],
  imports: [
    IonicPageModule.forChild(RemandAddPage),
    ComponentsModule
  ]
})
export class RemandAddPageModule {}
