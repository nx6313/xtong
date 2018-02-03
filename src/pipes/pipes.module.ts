import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PhoneEncryPipe } from './phone-encry/phone-encry';
import { OrderStatusPipe } from './order-status/order-status';
import { StrIsNullPipe } from './str-is-null/str-is-null';
import { CustomListDataPipe } from './custom-list-data/custom-list-data';

@NgModule({
	declarations: [
		PhoneEncryPipe,
		OrderStatusPipe,
		StrIsNullPipe,
		CustomListDataPipe
	],
	imports: [CommonModule],
	exports: [
		PhoneEncryPipe,
		OrderStatusPipe,
		StrIsNullPipe,
		CustomListDataPipe
	]
})
export class PipesModule { }
