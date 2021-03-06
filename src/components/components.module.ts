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
import { SwitchPagesComponent } from './switch-pages/switch-pages';
import { SwitchPageComponent } from './switch-pages/switch-page';
import { UserLoginComponent } from './user-login/user-login';

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
        SwitchPagesComponent,
        SwitchPageComponent,
        UserLoginComponent
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
        SwitchPagesComponent,
        SwitchPageComponent,
        UserLoginComponent
    ]
})
export class ComponentsModule { }
