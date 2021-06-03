import { Injectable } from "@angular/core";
import { ToastController, Platform, NavController } from "@ionic/angular";
import { AuthService } from "@service/auth.service";
import { Subscription } from "rxjs";

import { Plugins } from "@capacitor/core";
import { environment } from "environments/environment";

const { FirebaseAnalytics } = Plugins;

@Injectable({
  providedIn: "root",
})
export class BaseService {
  backButtonSubscription: Subscription;
  isBackEnable = false;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async firebaseAnalyticsInit() {
    await FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
    await FirebaseAnalytics.enable();
  }

  backButtonAction() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      console.log("back button presssed");

      const currentPath = window!.location!.pathname || "";
      // var activeBs: any = document.querySelectorAll('.modal.show');
      // if (activeBs.length > 0) {
      //   for (var i = 0; i < activeBs.length; i++) {
      //     console.log(activeBs[i].id);
      //     $('#' + activeBs[i].id).modal('hide');
      //   }
      // }
      // else
      if (currentPath.toLowerCase() === "/login" || currentPath.toLowerCase() === "/welcome-login") {
        if (navigator["app"]) {
          console.log(navigator["app"]);
          if (this.isBackEnable) {
            navigator["app"].exitApp();
            return;
          }
          this.presentToast();
        }
      } else if (
        currentPath.toLowerCase() == "/tabs/tab1" ||
        currentPath.toLowerCase() == "/tabs/tab3" ||
        currentPath.toLowerCase() == "/tabs/tab4" ||
        currentPath.toLowerCase() == "/tabs/tab5"
      ) {
        // this.router.navigate(['/layouts']);
        this.navCtrl.navigateRoot("/tabs/tab2");
      } else if (
        currentPath.toLowerCase() == "/tabs/tab2" ||
        currentPath.toLowerCase() === "/tabs/tab2/portfolio-dashboard" ||
        currentPath.toLowerCase() === "/tabs/tab2/investment-dashboard"
      ) {
        this.authService.presentLogoutAlertConfirm();
      } else {
        this.navCtrl.back({});
      }
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Press back again to exit.",
      duration: 1000,
      animated: true,
      color: "light",
      position: "top",
      mode: "ios",
    });
    toast.present();
    this.isBackEnable = true;
    setTimeout(() => {
      this.isBackEnable = false;
    }, 1000);
  }

  backDestory() {
    this.backButtonSubscription.unsubscribe();
  }
}
