import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Selector, Select, Store } from "@ngxs/store";
import { interval, Observable } from "rxjs";
import { CommonState } from "@store/state/common.state";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@service/auth.service";
import { NavController } from "@ionic/angular";
import { ActiveButton, SetCommonState, UpdateCusStatus } from "@store/actions/common.action";
import { tap } from "rxjs/operators";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { CommonService } from "@service/common.service";
import { SubSink } from "subsink";

@Component({
  selector: "app-verify-otp",
  templateUrl: "./verify-otp.page.html",
  styleUrls: ["./verify-otp.page.scss"],
})
export class VerifyOtpPage implements OnInit, AfterViewChecked, OnDestroy {
  @Select(CommonState.getState) commonState$: Observable<any>;

  private subs = new SubSink();
  otpForm: FormGroup;
  showClick = false;

  @ViewChild("first", { static: false }) first: ElementRef;
  @ViewChild("second", { static: false }) second: ElementRef;
  @ViewChild("third", { static: false }) third: ElementRef;
  @ViewChild("four", { static: false }) four: ElementRef;
  @ViewChild("singUp", { static: false }) singUp: ElementRef;

  constructor(
    public store: Store,
    public fb: FormBuilder,
    public authService: AuthService,
    public commonService: CommonService,
    public navCtrl: NavController,
    private loadingService: LoadingService,
    private toastService: ToastrService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.createOTPForm();
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.loadingService.hide();
    // this.isTimerOn
    this.showTimer();
  }

  showTimer() {
    this.showClick = false;
    var callDuration = this.elementRef.nativeElement.querySelector("#time");
    this.startTimer(callDuration);
  }

  focusNext(event, index) {
    console.log(index);
    console.log(event);
    if (index === 1) {
      console.log(event.which !== 8);
      if (event.which !== 8) {
        console.log(this.second);
        this.second.nativeElement.focus();
      }
    } else if (index === 2) {
      if (event.which !== 8) {
        console.log(this.second);
        this.third.nativeElement.focus();
      } else if (event.target.value.length <= 0) {
        this.first.nativeElement.focus();
      }
    } else if (index === 3) {
      if (event.which !== 8) {
        console.log(this.second);
        this.four.nativeElement.focus();
      } else if (event.target.value.length <= 0) {
        this.second.nativeElement.focus();
      }
    } else {
      if (event.which === 8 && event.target.value.length <= 0) {
        this.third.nativeElement.focus();
      }
    }
  }

  startTimer(display) {
    var timer = 120;
    var minutes;
    var seconds;

    let a = interval(1000).subscribe((x) => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      display.textContent = minutes + ":" + seconds;
      --timer;
      if (timer == 0) {
        this.showClick = true;
        display.textContent = "";
        a.unsubscribe();
      }
    });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  createOTPForm() {
    this.otpForm = this.fb.group({
      first: [null, Validators.required],
      second: [null, Validators.required],
      third: [null, Validators.required],
      four: [null, Validators.required],
    });
  }

  resendOTP(state) {
    this.loadingService.show();
    this.subs.sink = this.authService
      .resendOTP({
        custregmobile: state.custregmobile,
        otpType: "mobile",
        pwdchange: "pwdchange",
        custcountrycode: state.custcountrycode,
      })
      .subscribe((resendOTPRes) => {
        this.loadingService.hide();
        this.toastService.show({ message: resendOTPRes.data });
        this.otpForm.reset();
        this.showTimer();
        // if (resendOTPRes.statusCode === 0) {
        //   alert(resendOTPRes.data);
        // } else if (resendOTPRes.statusCode === 1) {
        //   this.toastService.show({ message: resendOTPRes.data });
        // }
        console.log({ resendOTPRes });
      });
  }

  signUP(state) {
    console.log({ state });
    const otp = this.getOtpValue();
    if (this.otpForm.valid) {
      this.loadingService.show();
      this.subs.sink = this.authService
        .verifyOTP({
          custregmobile: state.custregmobile,
          custcountrycode: state.custcountrycode,
          otp,
        })
        .subscribe((res) => {
          this.loadingService.hide();
          if (res.statusCode === 0) {
            this.loadingService.show();
            // this.navCtrl.navigateRoot("/set-your-password").then(() => {
            //   this.store.dispatch(new ActiveButton(0));
            // });

            // TODO - DYNAMIC IP
            this.store.dispatch(new ActiveButton(0));
            this.subs.sink = this.commonService.getCustomerStatus().subscribe(
              (cusres) => {
                this.loadingService.hide();
                if (cusres.statusCode === 0) {
                  if (cusres.data && cusres.data.length > 0) {
                    if (cusres.data[0].custstatus === "P") {
                      this.navCtrl.navigateRoot("/set-your-password");
                    } else {
                      localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
                      localStorage.setItem("loggedInDate", JSON.stringify(new Date()));
                      this.navCtrl.navigateRoot("/tabs/tab2").then(() => {
                        this.navCtrl.navigateForward("/tabs/tab2/portfolio-dashboard");
                      });
                    }
                  } else {
                    this.navCtrl.navigateRoot("/set-your-password");
                  }
                } else {
                  this.toastService.show({ message: cusres.data, type: "error" });
                }
                console.log({ cusres });
              },
              (err) => {
                this.toastService.show({
                  message: err.status + "/n Something went wrong contact your admin",
                  type: "error",
                });
              }
            );
          } else {
            this.toastService.show({ message: res.data, type: "error" });
          }
        });
    }
  }

  backbtn() {
    this.navCtrl.navigateRoot("/login").then(() => {
      this.store.dispatch(new ActiveButton(0));
    });
  }

  getOtpValue() {
    return (
      this.otpForm.controls.first.value +
      this.otpForm.controls.second.value +
      this.otpForm.controls.third.value +
      this.otpForm.controls.four.value
    );
  }
}
