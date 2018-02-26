import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { Toast } from '@ionic-native/toast';

import { EventsService } from '../providers/events-service';
import { HttpService } from '../providers/http-service';
import { ProtocolService } from '../providers/protocol-service';
import { StorageService } from '../providers/storage-service';
import { UpdateService } from '../providers/update-service';
import { UtilService } from '../providers/util-service';
import { LogService } from '../providers/log-service';

import { ComponentsModule } from '../components/components.module';

import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { TaskPage } from '../pages/task/task';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    AboutPage,
    TaskPage,
    TabsPage
  ],
  imports: [
    IonicStorageModule.forRoot(),
    BrowserModule,
    ComponentsModule,
    HttpModule,
    PipesModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    AboutPage,
    TaskPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EventsService,
    HttpService,
    ProtocolService,
    StorageService,
    UpdateService,
    UtilService,
    LogService,
    Toast,
    AppVersion,
    { provide: ErrorHandler, useClass: LogService }
  ]
})
export class AppModule { }
