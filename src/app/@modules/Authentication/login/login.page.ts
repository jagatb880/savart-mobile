import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { Store, Select, Actions, ofActionDispatched } from "@ngxs/store";
import { Observable } from "rxjs";
import { CommonState } from "@store/state/common.state";
import {
  WSValidateMobileNumber,
  GetCountryCode,
  SendOTP,
  SetMobileNumber,
  SetCommonState,
} from "@store/actions/common.action";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController } from "@ionic/angular";
import { AuthService } from "@service/auth.service";
import { SubSink } from "subsink";
import { AuthToken } from "@store/actions/auth.actions";
import { LoadingService } from "@service/loading.service";
import { debounceTime, tap } from "rxjs/operators";
import { CommonService } from "@service/common.service";
import { customerStatus, custstatus, taskName } from "@core/constants/constants";
import { ToastrService } from "@service/toastr.service";
import { ValidatorUtils } from "@core/utils/validator";

import { Plugins, PushNotificationToken } from "@capacitor/core";
import { environment } from "environments/environment";
import { AuthState } from "@store/state/auth.state";
import { FCM } from '@ionic-native/fcm/ngx';
const { SplashScreen, StatusBar, PushNotifications, Browser } = Plugins;
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit, OnDestroy {
  @Select(CommonState.countryList) countryCodeList$: Observable<any[]>;
  @Select(CommonState.getState) commonState$: Observable<any>;

  private subs = new SubSink();

  customAlertOptions: any = {
    header: "Select Country Code",
    translucent: true,
  };

  loginForm: FormGroup;
  activeButton = 0;

  passwordEyeShow = false;

  constructor(
    public store: Store,
    public fb: FormBuilder,
    private navCtrl: NavController,
    private actions: Actions,
    private authService: AuthService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private validtorUtil: ValidatorUtils,
    private firebaseAnalytics: FirebaseAnalytics,
    private fcm: FCM,
  ) {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      custregmobile: [null, Validators.compose([Validators.required, Validators.minLength(7)])],
      custcountrycode: [null, Validators.required],
      password: [null],
    });
  }

  ngOnInit() {
    this.activeButton = 0;
    this.getCountryCodeList();
    this.stateSubscribe();
    this.ifFieldDirty(); // TODO - NEED TO CHANGE SUBMIT BUTTON WHEN FIELD DIRTY

    this.loginForm.controls.custcountrycode.valueChanges.subscribe((res) => {
      if (res) {
        this.authService.getPhoneDigitRange({ country_code: res }).subscribe((res) => {
          this.loadingService.hide();
          if (res && res.data.lookupparam2) {
            this.loginForm.controls.custregmobile.setValidators(
              Validators.compose([
                Validators.required,
                Validators.minLength(res.data.lookupparam2),
                Validators.maxLength(res.data.lookupparam2),
              ])
            );
          } else {
            this.loginForm.controls.custregmobile.setValidators(
              Validators.compose([Validators.required, Validators.minLength(10)])
            );
          }
          this.loginForm.controls.custregmobile.updateValueAndValidity();
        });
      } else {
        this.loginForm.controls.custregmobile.setValidators(
          Validators.compose([Validators.required, Validators.minLength(7)])
        );
        this.loginForm.controls.custregmobile.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ionViewWillEnter() {
    this.store.dispatch(new SetCommonState({ pwdchange: null }));
  }

  ifFieldDirty() {
    this.subs.sink = this.loginForm.controls.custcountrycode.valueChanges.subscribe((res) => {
      if (res) {
        this.activeButton = 0;
        this.setPasswordRequired(false);
        this.store.dispatch(new AuthToken(null));
      }
    });
    this.subs.sink = this.loginForm.controls.custregmobile.valueChanges.pipe(debounceTime(100)).subscribe((res) => {
      if (res) {
        console.log(res);
        console.log(res.length);
        if (res.length === 10 && this.loginForm.controls.custcountrycode.value) {
          this.submit();
        } else {
          this.activeButton = 0;
          this.store.dispatch(new AuthToken(null));
          this.setPasswordRequired(false);
        }
      }
    });
  }

  openURL(url) {
    Browser.open({ url });
  }

  stateSubscribe() {
    this.subs.sink = this.commonState$.subscribe((res) => {
      console.log({ res });
      res && res.activeButton === 1 ? this.setPasswordRequired(true) : this.setPasswordRequired(false);
      if (res && res.activeButton) {
        this.activeButton !== res.activeButton
          ? (this.activeButton = (res && res.activeButton) || 0)
          : (this.activeButton = this.activeButton);
      } else {
        this.activeButton = 0;
      }
    });
  }

  setPasswordRequired(value: boolean) {
    if (value) {
      this.loginForm.controls.password.setValidators(Validators.required);
      this.loginForm.controls.password.updateValueAndValidity();
    } else {
      this.loginForm.controls.password.setValidators(null);
      this.loginForm.controls.password.updateValueAndValidity();
    }
  }
  getCountryCodeList() {
    this.store.dispatch(new GetCountryCode({ lookupname: "countryCode" })).subscribe(() => {
      this.loginForm.patchValue({
        custcountrycode: "91",
      });
    });
  }

  submit() {
    console.log(this.loginForm.value);
    this.store.dispatch(new WSValidateMobileNumber(this.loginForm.value));
  }

  login(state) {
    console.log({ state });
    let req: any = {};
    req.custregmobile = this.loginForm.controls.custregmobile.value;
    req.custcountrycode = this.loginForm.controls.custcountrycode.value;
    req.password = this.loginForm.controls.password.value;
    console.log(req);
    this.loadingService.show();
    this.subs.sink = this.authService.loginOrValidatePassword(req).subscribe((loginOrValidatePasswordres) => {
      this.loadingService.hide();
      console.log({ loginOrValidatePasswordres });
      if (loginOrValidatePasswordres.statusCode === 0) {
        this.firebaseAnalytics.logEvent(
          "LoggedIn",
          {
            custregmobile: req.custregmobile,
          },
        );

        // PushNotifications.requestPermission().then((result) => {
        //   if (result.granted) {
        //     // Register with Apple / Google to receive push via APNS/FCM
        //     PushNotifications.register();
        //   } else {
        //     // Show some error
        //     this.toastrService.show({ message: `You've blocked your push notifications` });
        //   }
        // });

        // // On success, we should be able to receive notifications
        // PushNotifications.addListener("registration", (token: PushNotificationToken) => {
        //   console.log(token);
        //   console.log("Push registration success, token: " + token.value);
        //   //  alert("Push registration success, token: " + token.value);
        //   if (this.store.selectSnapshot(AuthState.getToken)) {
        //     let data = {
        //       auth: this.store.selectSnapshot(AuthState.getToken),
        //       firebase: token.value,
        //     };
        //     this.authService.storeFireAuthToken(data).subscribe((res) => {});
        //   }
        // });

        this.fcm.hasPermission().then(hasPermission => {
          if (hasPermission) {
            console.log("Has permission!");
          }
        })

        //get firebase token
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

        this.subs.sink = this.commonService.getCustomerStatus().subscribe((getCustomerStatusres) => {
          console.log({ getCustomerStatusres });
          if (getCustomerStatusres.statusCode === 0) {
            this.loadingService.show();
            this.subs.sink = this.commonService.checkDashbaord().subscribe((checkRes) => {
              this.loadingService.hide();
              if (checkRes.statusCode === 0) {
                this.store
                  .dispatch(
                    new SetCommonState({
                      cusStatus: getCustomerStatusres.data || [],
                      custcustregmobile: req.custregmobile,
                      custcountrycode: req.custcountrycode,
                      Dashboard_view: checkRes.data.Dashboard_view,
                    })
                  )
                  .subscribe(() => {
                    localStorage.setItem("loggedInDate", JSON.stringify(new Date()));
                    localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
                    if (checkRes.data && checkRes.data.Dashboard_view === "empty_dashboard") {
                      this.navCtrl.navigateRoot("/tabs/tab2/investment-dashboard");
                    } else {
                      this.navCtrl.navigateRoot("/tabs/tab2/portfolio-dashboard");
                    }
                  });
              } else {
                localStorage.removeItem("isUserLoggedIn");
                this.toastrService.show({ message: checkRes.data, type: "error" });
              }
            });
          } else {
            this.toastrService.show({ message: getCustomerStatusres.data, type: "error" });
          }
        });
      } else {
        this.toastrService.show({ message: loginOrValidatePasswordres.data, type: "error" });
      }
    });
  }

  forgotPassword() {
    this.loadingService.show();
    let request: any = this.loginForm.value;
    request.pwdchange = "pwdchange";
    request.otpType = "mobile";
    console.log({ request });
    this.authService.resendOTP(request).subscribe((res) => {
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.navCtrl.navigateForward("/verify-otp").then(() => {
          this.store.dispatch(
            new SetCommonState({
              custcountrycode: request.custcountrycode || null,
              custregmobile: request.custregmobile || null,
              pwdchange: request.pwdchange || null,
            })
          );
        });
      } else {
        this.toastrService.show({ message: res.data, type: "error" });
      }
    });
  }

  sentOTP() {
    this.store.dispatch(new SendOTP(this.loginForm.value)).subscribe((res) => {
      console.log(res);
      this.activeButton = 0;
      this.loginForm.reset();
    });
  }
}
