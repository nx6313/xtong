import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StrIsNullPipe } from './str-is-null/str-is-null';
import { CustomListDataPipe } from './custom-list-data/custom-list-data';
import { RemandDatePipe } from './remand-date/remand-date';

@NgModule({
	declarations: [
		StrIsNullPipe,
		CustomListDataPipe,
		RemandDatePipe
	],
	imports: [CommonModule],
	exports: [
		StrIsNullPipe,
		CustomListDataPipe,
		RemandDatePipe
	]
})
export class PipesModule { }
