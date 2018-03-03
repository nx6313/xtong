import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StrIsNullPipe } from './str-is-null/str-is-null';
import { CustomListDataPipe } from './custom-list-data/custom-list-data';
import { RemandDatePipe } from './remand-date/remand-date';
import { DistancePipe } from './distance/distance';

@NgModule({
	declarations: [
		StrIsNullPipe,
		CustomListDataPipe,
		RemandDatePipe,
		DistancePipe
	],
	imports: [CommonModule],
	exports: [
		StrIsNullPipe,
		CustomListDataPipe,
		RemandDatePipe,
		DistancePipe
	]
})
export class PipesModule { }
