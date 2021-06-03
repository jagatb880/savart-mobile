import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";

import { AlertController, Platform, ToastController, NavController } from "@ionic/angular";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { GetCountryCode, SetNotificationCount, SetPlanExpired } from "@store/actions/common.action";
import { BaseService } from "@service/base.service";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { InboxService } from "@service/inbox.service";
import { MessageStatus } from "@core/constants/constants";

// import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from "@capacitor/core";
import { AuthService } from "@service/auth.service";
import { AuthState } from "@store/state/auth.state";
// import { Firebase } from '@ionic-native/firebase/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
// import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
// const { PushNotifications } = Plugins;
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private platform: Platform,
    public store: Store,
    public actions: Actions,
    public baseService: BaseService,
    public loadingService: LoadingService,
    public toastService: ToastrService,
    public inboxService: InboxService,
    private authService: AuthService,
    private toastController: ToastController,
    private fcm: FCM,
    private navCtrl: NavController,
    private statusBar: StatusBar,
    private splahScreen: SplashScreen,
    private alertController: AlertController
    // private firebase: FirebaseX
    // private firebase: FirebaseMessaging,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    //this.loadingService.show();
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#8a6ddc");
      // StatusBar.setBackgroundColor({ color: "#8147d4" });
      //setTimeout(() => {
        //this.loadingService.hide();
        this.splahScreen.hide();
        this.initFirebase()
      //}, 3000);
    });
  }

  // pushNotificationTrigger() {
  //   // Request permission to use push notifications
  //   // iOS will prompt user and return if they granted permission or not
  //   // Android will just grant without prompting
  //   PushNotifications.requestPermission().then((result) => {
  //     if (result.granted) {
  //       // Register with Apple / Google to receive push via APNS/FCM
  //       PushNotifications.register();
  //     } else {
  //       // Show some error
  //       console.log({ result });
  //       console.log(JSON.stringify(result));
  //       this.toastService.show({ message: `You've blocked your push notifications` });
  //     }
  //   });

  //   // On success, we should be able to receive notifications
  //   PushNotifications.addListener("registration", (token: PushNotificationToken) => {
  //     console.log("token",token);
  //     alert(token)
  //     console.log("Push registration success, token: " + token.value);
  //     //  alert("Push registration success, token: " + token.value);
  //     if (this.store.selectSnapshot(AuthState.getToken)) {
  //       let data = {
  //         auth: this.store.selectSnapshot(AuthState.getToken),
  //         firebase: token.value,
  //       };
  //       this.authService.storeFireAuthToken(data).subscribe((res) => {});
  //     }
  //   });

  //   // Some issue with our setup and push will not work
  //   PushNotifications.addListener("registrationError", (error: any) => {
  //     //  alert("Error on registration: " + JSON.stringify(error));
  //     console.log("Error on registration: " + JSON.stringify(error));
  //   });

  //   // Show us the notification payload if the app is open on our device
  //   PushNotifications.addListener("pushNotificationReceived", (notification: PushNotification) => {
  //     // alert("Push received: " + JSON.stringify(notification));
  //     console.log("Push received: " + JSON.stringify(notification));
  //     this.presentAlertConfirm(notification);
  //   });

  //   // Method called when tapping on a notification
  //   PushNotifications.addListener(
  //     "pushNotificationActionPerformed",
  //     (notification: PushNotificationActionPerformed) => {
  //       // alert("Push action performed: " + JSON.stringify(notification));
  //       console.log("Push action performed: " + JSON.stringify(notification));
  //       console.log(notification.inputValue);
  //     }
  //   );
  // }

  ngOnInit() {
    // this.pushNotificationTrigger();
    this.store.dispatch(new SetPlanExpired());
    this.baseService.backButtonAction();
    this.baseService.firebaseAnalyticsInit();
    this.inboxService.getNotifications().subscribe(async (res) => {
      console.log(res);
      this.loadingService.hide();
      let value = (await res.data.filter((val) => val.status == MessageStatus.NEW)) || [];
      await this.store.dispatch(new SetNotificationCount(value.length || ""));
    });
  }

  initFirebase(){
    //grant permission for firebase in ios device.
    this.fcm.subscribeToTopic("all");

    // get firebase token
    this.fcm.getToken().then(token => {
      console.log("token",token)
      if (this.store.selectSnapshot(AuthState.getToken)) {
        let data = {
          auth: this.store.selectSnapshot(AuthState.getToken),
          firebase: token,
        };
        this.authService.storeFireAuthToken(data).subscribe((res) => {});
      }
    });

    // receive push notification from Firebase Cloud Messaging
    this.fcm.onNotification().subscribe(data => {
      console.log(data)
      if (data.wasTapped) {
        this.navCtrl.navigateRoot(['/tabs/tab3/inbox']);
      } else {
        this.presentAlertConfirm(data);
      }
    });

    //refresh the firebase token
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log("token",token)
      if (this.store.selectSnapshot(AuthState.getToken)) {
        let data = {
          auth: this.store.selectSnapshot(AuthState.getToken),
          firebase: token,
        };
        this.authService.storeFireAuthToken(data).subscribe((res) => {});
      }
    });

    this.fcm.hasPermission().then(hasPermission => {
      if (hasPermission) {
        console.log("Has permission!");
      }
    })

    this.fcm.clearAllNotifications();
    
    this.fcm.unsubscribeFromTopic("all");
  }

  async presentAlertConfirm(data) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Push Notification",
      subHeader: `${(data && data.title) || ""} `,
      mode: "ios",
      backdropDismiss: false,
      message: `${(data && data.body) || ""} `,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            console.log("Confirm Okay");
            this.navCtrl.navigateRoot(['/tabs/tab3/inbox']);
          },
        },
      ],
    });

    await alert.present();

    // const toast = await this.toastController.create({
    //   message: `${(data && data.body) || ""} `,
    //   duration: 5000,
    //   header: `${(data && data.title) || ""}`,
    //   color: "light",
    //   cssClass: "toast-success",
    //   animated: true,
    //   mode: "ios",
    //   position: "top",
    // });
    // await toast.present();
  }

  ngOnDestroy() {
    this.baseService.backDestory();
  }
}
