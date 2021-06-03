import { Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { CommonState } from "@store/state/common.state";
import { Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "@service/auth.service";
import { NavController } from "@ionic/angular";
import { LoadingService } from "@service/loading.service";
import { AuthToken, Logout } from "@store/actions/auth.actions";
import { SubSink } from "subsink";
import { CommonService } from "@service/common.service";
import { customerStatus, custstatus } from "@core/constants/constants";
import { ToastrService } from "@service/toastr.service";
import { SetCommonState } from "@store/actions/common.action";
import { ValidatorUtils } from "@core/utils/validator";

@Component({
  selector: "app-set-your-password",
  templateUrl: "./set-your-password.page.html",
  styleUrls: ["./set-your-password.page.scss"],
})
export class SetYourPasswordPage implements OnInit {
  @Select(CommonState.getState) commonState$: Observable<any>;

  private subs = new SubSink();

  passwordEyeShow = false;
  confirmPasswordEyeShow = false;
  passwordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private authService: AuthService,
    private navCtrl: NavController,
    private store: Store,
    public commonService: CommonService,
    private toastService: ToastrService,
    private validtorUtil: ValidatorUtils
  ) {
    this.createPasswordForm();
  }

  ngOnInit() {}

  createPasswordForm() {
    this.passwordForm = this.fb.group({
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          this.validtorUtil.validateOneUppercase,
          this.validtorUtil.validateOneLowercase,
          this.validtorUtil.validateOneNumeric,
          this.validtorUtil.validateOneSpecialChar,
        ]),
      ],
      confirmPassword: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          this.validtorUtil.validateOneUppercase,
          this.validtorUtil.validateOneLowercase,
          this.validtorUtil.validateOneNumeric,
          this.validtorUtil.validateOneSpecialChar,
        ]),
      ],
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  submit(state) {
    if (this.passwordForm.controls.confirmPassword.value === this.passwordForm.controls.password.value) {
      this.loadingService.show();
      this.subs.sink = this.authService
        .setYourPassword({ password: this.passwordForm.controls.confirmPassword.value })
        .subscribe(
          (res) => {
            if (res.statusCode === 0) {
              this.loadingService.hide();
              this.subs.sink = this.commonService.getCustomerStatus().subscribe((res) => {
                console.log({ res });
                if (res.statusCode === 0) {
                  this.store.dispatch(
                    new SetCommonState({
                      cusStatus: res.data || [],
                    })
                  );
                  localStorage.setItem("loggedInDate", JSON.stringify(new Date()));

                  localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
                  if (this.commonService.isChangePassword) {
                    this.navCtrl.navigateRoot("/tabs/tab1/profile-dashboard");
                    this.commonService.isChangePassword = false;
                  } else if (this.store.selectSnapshot(CommonState.getpwdchange)) {
                    this.navCtrl.navigateRoot("/tabs/tab2").then(() => {
                      this.navCtrl.navigateForward("/tabs/tab2/portfolio-dashboard");
                      this.store.dispatch(new SetCommonState({ pwdchange: null }));
                    });
                  } else {
                    this.navCtrl.navigateRoot("/tabs/tab2").then(() => {
                      // this.navCtrl.navigateForward("/tabs/tab1/personal-profile");
                      this.navCtrl.navigateForward("/tabs/tab1/profile-service");
                    });
                  }
                } else {
                  this.toastService.show({ message: res.data + "\n " + res.error, type: "error" });
                }
              });
            } else {
              this.toastService.show({ message: res.data + "\n " + res.error, type: "error" });
            }
          },
          (error) => {
            // alert("failiure");
            console.log(JSON.stringify(error));
            localStorage.removeItem("isUserLoggedIn");
          }
        );
    } else {
      this.toastService.show({ message: "Confirm password must be same", type: "error" });
    }
  }
}
