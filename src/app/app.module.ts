import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import 'firebase/app';
import 'firebase/functions';

import { LoginPageModule } from '../pages/login/login.module';
import { LoginEmailPageModule } from '../pages/login-email/login-email.module';
import { SignupPageModule } from '../pages/signup/signup.module';

import { AuthService } from '../services/auth.service';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { ConnectorProvider } from '../providers/connector/connector';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    NgxErrorsModule,
    LoginPageModule,
    LoginEmailPageModule,
    SignupPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFireAuth,
    AuthService,
    ConnectorProvider
  ]
})
export class AppModule {}
