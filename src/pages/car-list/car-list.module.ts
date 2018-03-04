import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarListPage } from './car-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CarListPage,
  ],
  imports: [
    IonicPageModule.forChild(CarListPage),
    ComponentsModule
  ],
})
export class CarListPageModule { }
