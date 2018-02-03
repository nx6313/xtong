import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TitleBarComponent } from './title-bar/title-bar';
import { LoadingComponent } from './loading/loading';
import { ScrollviewComponent } from './scrollview/scrollview';
import { ListCaptionComponent } from './list-caption/list-caption';
import { TaskListComponent } from './task-list/task-list';
import { CustomFormComponent } from './custom-form/custom-form';
import { CustomListComponent } from './custom-list/custom-list';
import { AddressMapComponent } from './address-map/address-map';
import { SlideTabComponent } from './slide-tab/slide-tab';
import { SwitchPagesComponent } from './switch-pages/switch-pages';
import { SwitchPageComponent } from './switch-pages/switch-page';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    declarations: [
        TitleBarComponent,
        LoadingComponent,
        ScrollviewComponent,
        ListCaptionComponent,
        TaskListComponent,
        CustomFormComponent,
        CustomListComponent,
        AddressMapComponent,
        SlideTabComponent,
        SwitchPagesComponent,
        SwitchPageComponent
    ],
    imports: [
        CommonModule,
        PipesModule,
        FormsModule
    ],
    exports: [
        TitleBarComponent,
        LoadingComponent,
        ScrollviewComponent,
        ListCaptionComponent,
        TaskListComponent,
        CustomFormComponent,
        CustomListComponent,
        AddressMapComponent,
        SlideTabComponent,
        SwitchPagesComponent,
        SwitchPageComponent
    ]
})
export class ComponentsModule { }
