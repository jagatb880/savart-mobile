import { Injectable } from "@angular/core";
import { HttpService } from "@service/http.service";
import { Observable } from "rxjs";
import { ServiceURL } from "@service/urls/service.url";
import { AlertController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { Logout } from "@store/actions/auth.actions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(public http: HttpService, private alertController: AlertController, private store: Store) {}

  sendOTP(body): Observable<any> {
    return this.http.post(ServiceURL.SEND_OTP, body);
  }

  resendOTP(body): Observable<any> {
    return this.http.post(ServiceURL.RESEND_OTP, body);
  }
  storeFireAuthToken(body): Observable<any> {
    return this.http.post(ServiceURL.STORE_FIRE_TOKEN, body);
  }

  verifyOTP(body): Observable<any> {
    return this.http.post(ServiceURL.VERIFY_OTP, body);
  }

  setYourPassword(body): Observable<any> {
    return this.http.post(ServiceURL.SET_YOUR_PASSWORD, body);
  }

  loginOrValidatePassword(body): Observable<any> {
    return this.http.post(ServiceURL.LOGIN_OR_VALIDATE_PASSWORD, body);
  }
  getPhoneDigitRange(body): Observable<any> {
    return this.http.post(ServiceURL.PHONE_DIGIT_RANGE, body);
  }

  logout() {
    this.store.dispatch(new Logout());
  }

  async presentLogoutAlertConfirm() {
    const alert = await this.alertController.create({
      // cssClass: "my-custom-class",
      header: "Logout!",
      mode: "ios",
      message: "Are you sure you want to logout Savart ?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Yes",
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }
}
