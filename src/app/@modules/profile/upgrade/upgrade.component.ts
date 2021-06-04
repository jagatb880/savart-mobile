import { DOCUMENT } from "@angular/common";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { custstatus } from "@core/constants/constants";
import { ModalController, NavController, AlertController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { CommonService } from "@service/common.service";
import { LoadingService } from "@service/loading.service";
import { ServiceURL } from "@service/urls/service.url";
import { UpdateCusStatus } from "@store/actions/common.action";
import { AuthState } from "@store/state/auth.state";
import { CommonState } from "@store/state/common.state";
import { environment } from "environments/environment";
import { SubSink } from "subsink";
import { ProfileService } from '@service/profile.service';
import { HttpService } from '@service/http.service';

declare var Razorpay: any;
declare var RazorpayCheckout: any;

@Component({
  selector: "app-upgrade",
  templateUrl: "./upgrade.component.html",
  styleUrls: ["./upgrade.component.scss"],
})
export class UpgradeComponent implements OnInit {
  constructor(
    private store: Store,
    private commonService: CommonService,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private loadingService: LoadingService,
    private httpService: HttpService,
    private alertCtrl: AlertController,
    private profileService: ProfileService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  isChecked = false;
  private subs = new SubSink();
  @Input() data;

  ngOnInit() {
    this.isChecked = false;
  }

  back() {
    this.modalCtrl.dismiss();
  }
  onChecked(event) {
    this.isChecked = event.detail.checked;
  }

  async termsAndCondition() {
    if(this.commonService.androidPermission == null){
      this.commonService.getAndroidPermission();
    }else if(this.commonService.androidPermission){
      this.commonService.downloadPdfAndOpen('https://savart.in/media/Terms%20and%20conditions/Terms__Conditions.pdf');
    }else {
      this.commonService.getAndroidPermission();
    }
  }

  // async upgradeSubscriptionPayments() {
  //   console.log(this.data);
  //   if (this.data) {
  //     this.data["ismobile"] = true;
  //     this.data["t"] = this.store.selectSnapshot(AuthState.getToken);
  //     let url: any = new URL(
  //       `${environment.domain}${ServiceURL.UPGRADE_SUBSCRPTION_PAYMENT}[${JSON.stringify(this.data)}]`
  //     );
  //     console.log({ url });
  //     // await window.location.assign(url);
  //     this.router.navigate(["/tabs/tab1"]);

  //     const browser = await this.iab.create(url, "_blank", {
  //       toolbar: "no",
  //       fullscreen: "yes",
  //       presentationstyle: "fullscreen",
  //       footer: "no",
  //       location: "no",
  //     });
  //     await browser.on("loadstart").subscribe((event) => {
  //       if (
  //         event.url.includes("https://savart.in/ui/login") ||
  //         event.url.includes("https://savart.in/clients/savart/cancelled") ||
  //         event.url.includes("http://savart.eastus.cloudapp.azure.com:8000/ui/login") ||
  //         event.url.includes("http://savart.eastus.cloudapp.azure.com:8000/clients/savart/cancelled") ||
  //         event.url.includes("https://api.razorpay.com/v1/payments/pay")
  //       ) {
  //         setTimeout(() => {
  //           browser.close();
  //         }, 500);
  //       }
  //       console.log("event", { event });
  //       console.log("event", event.url);
  //     });
  //     await this.modalCtrl.dismiss();

  //     // await Browser.open({ url, windowName: "_system" });
  //     // Browser.addListener("browserFinished", () => {
  //     //   console.log("browser closed");
  //     //   this.redirectBasedonStatus();
  //     // });
  //     // Browser.addListener("browserPageLoaded", () => {
  //     //   this.commonService.isMobilePaused = true;
  //     // });

  //     this.document.addEventListener(
  //       "pause",
  //       () => {
  //         console.log("pause");
  //         this.commonService.isMobilePaused = true;
  //       },
  //       false
  //     );
  //     this.document.addEventListener(
  //       "resume",
  //       () => {
  //         console.log("resume");
  //         if (this.commonService.isMobilePaused) {
  //           this.redirectBasedonStatus();
  //           this.commonService.isMobilePaused = false;
  //         }
  //       },
  //       false
  //     );
  //   } else {
  //     this.modalCtrl.dismiss();
  //   }
  // }

  async redirectBasedonStatus() {
    this.loadingService.show();
    this.subs.sink = this.store.dispatch(new UpdateCusStatus()).subscribe((res) => {
      this.loadingService.hide();
      console.log(res);
      if (res && res.common.cusStatus) {
        let cust: any[] = this.store.selectSnapshot(CommonState.getCusStatus);
        console.log({ cust });
        if (cust.length > 0) {
          let pendings: any[] = cust.filter((val) => val.status === custstatus.P) || [];
          if (pendings && pendings[0]) {
            this.commonService.redirectBasedOnCusStatus(pendings[0]);
          } else {
            this.navCtrl.navigateRoot("/tabs/tab2");
          }
        }
      } else {
        this.navCtrl.navigateRoot("/tabs/tab1");
      }
    });
  }

  async upgradeSubscriptionPayments() {
    console.log(this.data)
    let data = this.data
    let options: any = {
      key: this.data.api_key,
      // amount: 1 * 100, // amount should be in paise format to display Rs 1255 without decimal point
      amount: this.data.amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: "INR",
      name: "Savart", // company name or product name
      description: "", // product description
      image: "https://www.flyerssoft.com/images/logoheader.png", // company logo or product image
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
        ondismiss: function () {
          alert("Cancelled by user")
        },
      },
      prefill: {
        contact:
        this.data.phone ||
          `+ ${this.store.selectSnapshot(CommonState.getCountryCode)}${this.store.selectSnapshot(
            CommonState.getMobileNumber
          )}`,
        name: this.data.name,
        email: this.data.email,
      },
      handler: (response, error) => {
        options.response = response.razorpay_payment_id;
        console.log("handelr" + { response });
        //this.sendPaymentStatusToServer(data,response.razorpay_payment_id)
        // call your backend api to verify payment signature & capture transaction
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: "#8a6edd",
      },
    };

    this.modalCtrl.dismiss();
    // Razorpay.open(
    Razorpay.open(
          options,
          (payment_id) => {
            this.sendPaymentStatusToServer(data,payment_id)
          },
          (err) => {
            this.showAlertCallBack("Payment Failed!","Please contact to admin or try after sometime.").then(data=>{
            })
            // if (err.code === 3) {
            //   this.toastrService.show({
            //     message: err.description,
            //     type: "error",
            //   });
            // } else if (err.code === 0) {
            //   this.toastrService.show({
            //     message: err.description,
            //     type: "error",
            //   });
            // } else {
            //   this.toastrService.show({
            //     message: "Oops! Seems like your payment failed. Please try again or contact support",
            //     type: "error",
            //   });
            // }
          }
        );
  }

  async sendPaymentStatusToServer(data, payment_id){
    this.loadingService.show();
    let params = "t="+window.btoa(data["t"])+"&payment_id="+payment_id+"&amount="+data["amount"]+
    "&order_id="+data["order_id"]+"&upgrade_from_serid="+data["upgrade_from_serid"]+"&upgrade_to_serid="+data["upgrade_to_serid"];
    this.subs.sink = this.profileService.upgradeRazorPayPayment(params).subscribe((res) => {
      this.loadingService.hide();
      if (res.status_code === "100") {
        this.showAlertCallBack("Payment Successful!","Thanks for your trust and upgraded your investment!").then(data=>{
          if(data)
          this.redirectBasedonStatus();
        })
      }else{
        this.showAlertCallBack("Payment Failed!","Please contact to admin or try after sometime.").then(data=>{
        })
      }
    });
  }

  showAlertCallBack(title: string, message: string, okBtn: string = 'Ok'): Promise < boolean > {
    let promise: Promise < boolean > = new Promise(async (resolve, reject) => {
      let confirm = await this.alertCtrl.create({
        header: title,
        message: message,
        cssClass: 'my-custom-class',
        backdropDismiss: false,
        buttons: [
          {
            text: okBtn,
            handler: () => {
              resolve(true)
            }
          }
        ]
      });
      confirm.present();
    })
    return promise;
  }
}
