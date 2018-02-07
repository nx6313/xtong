import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressSelectPage } from './address-select';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddressSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressSelectPage),
    ComponentsModule
  ]
})
export class AddressSelectPageModule {}
