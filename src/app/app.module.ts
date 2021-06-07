import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgxsModule } from "@ngxs/store";
import { environment } from "environments/environment";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptors } from "@core/interceptors/TokenInterceptor";
import { CommonState } from "@store/state/common.state";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { AuthState } from "@store/state/auth.state";
import { AngularFireModule } from "@angular/fire";
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { File } from '@ionic-native/file/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgxsModule.forRoot([CommonState, AuthState], { developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: AuthState,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileOpener,
    FCM,
    FirebaseAnalytics,
    File,
    DocumentViewer,
    AndroidPermissions,
    // FirebaseMessaging,
    // FirebaseX,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptors, multi: true },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
