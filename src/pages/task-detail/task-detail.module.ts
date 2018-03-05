import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskDetailPage } from './task-detail';
import { ComponentsModule } from '../../components/components.module';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TaskDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskDetailPage),
    ComponentsModule,
    PipesModule
  ],
})
export class TaskDetailPageModule { }
