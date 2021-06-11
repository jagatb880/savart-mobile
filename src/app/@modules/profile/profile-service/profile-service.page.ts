import { AfterViewChecked, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit } from "@angular/core";
import { ProfileService } from "@service/profile.service";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { CommonService } from "@service/common.service";
import { LoadingService } from "@service/loading.service";
import { environment } from "environments/environment";
import { HttpService } from "@service/http.service";
import { custstatus, ServiceType } from "@core/constants/constants";
import { Store } from "@ngxs/store";
import { AuthState } from "@store/state/auth.state";
import { CommonState } from "@store/state/common.state";
import { ToastrService } from "@service/toastr.service";
import { AlertController, ModalController, NavController, Platform } from "@ionic/angular";
import { UpdateCusStatus } from "@store/actions/common.action";
import { SubSink } from "subsink";
import { Plugins } from "@capacitor/core";
import * as moment from "moment";
import { ServiceURL } from "@service/urls/service.url";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { UpgradeComponent } from "@modules/profile/upgrade/upgrade.component";
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser/ngx";
const { Browser, Filesystem } = Plugins;
// import  'capacitor-razorpay';
// const { Checkout } = Plugins;

declare var Razorpay: any;

declare var RazorpayCheckout: any;

@Component({
  selector: "app-profile-service",
  templateUrl: "./profile-service.page.html",
  styleUrls: ["./profile-service.page.scss"],
})
export class ProfileServicePage implements OnInit, AfterViewChecked, OnDestroy {
  subscriptionForm: any;
  selectedPlanArray: any[] = [];
  selectedSubscriptionList: any[] = [];
  isChecked = false;

  paymentId: any;
  modal: any;
  donwloadProgress = 0;
  donwloadUrl = ''
  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
};

  private subs = new SubSink();
  constructor(
    private httpService: HttpService,
    private profileService: ProfileService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private store: Store,
    private ngZone: NgZone,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalController: ModalController,
    private plaform: Platform,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.createSubscriptionForm();
  }

  ngOnInit() {
    try {
      this.modalController.dismiss();
    } catch (e) {
      console.log(e);
    }
    // console.log(this.store.selectSnapshot(CommonState.getState));
  }

  ionViewWillEnter() {
    console.log("ionview");
    this.selectedPlanArray = [];
    this.commonService.getAndroidPermission();
    this.getSelectedSubscriptionQuestions();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  createSubscriptionForm() {
    this.subscriptionForm = this.fb.group({
      countries: this.fb.array([]),
      data: this.fb.array([]),
    });
  }

  getsubscriptionData(): FormArray {
    return this.subscriptionForm.get("data") as FormArray;
  }

  getCountrySubscriptionData(i): FormArray {
    return this.subscriptionForm.get("countries").controls[i].get("services") as FormArray;
  }

  getCountrylistData(): FormArray {
    return this.subscriptionForm.get("countries") as FormArray;
  }

  countryListDataArray(name, flag, planUpgraded, icon, key, service: any[], isFlag): FormGroup {
    let form: any[] = [];
    service.forEach((value, keyIn) => {
      form.push(
        this.subscriptionDataArray(
          value.id,
          value.sername,
          value.sercountry,
          value.serdesc,
          value.serstatus,
          value.type,
          value.serprice,
          value.serformula1,
          value.serformula2,
          value.pricing_type,
          value.short_code,
          value.minlimit,
          value.maxlimit,
          value.cursymbol,
          value.isRenewal === true ? false : value.isSelected,
          value.isSelected1,
          keyIn,
          value.paid_amount || 0,
          value.isDisabled || false,
          value.flag,
          value.isDiscription,
          value.plan,
          value.desc,
          value.isRenewal,
          value.isExpired,
          value.isDiscriptionContent,
          value.planUpgraded,
          value.isSelectedEitherAorB
        )
      );
    });
    return this.fb.group({
      countryName: name || null,
      icon: icon || null,
      services: this.fb.array(form),
      key: key || null,
      flag: flag || null,
      planUpgraded: planUpgraded || false,
      isFlag: isFlag,
    });
  }

  subscriptionDataArray(
    id,
    sername,
    sercountry,
    serdesc,
    serstatus,
    type,
    serprice,
    serformula1,
    serformula2,
    pricing_type,
    short_code,
    minlimit,
    maxlimit,
    cursymbol,
    isSelected,
    isSelected1,
    key,
    paid_amount,
    isDisabled,
    flag,
    isDiscription,
    plan,
    desc,
    isRenewal,
    isExpired,
    isDiscriptionContent,
    planUpgraded,
    isSelectedEitherAorB
  ): FormGroup {
    return this.fb.group({
      id: [id || null],
      sername: [sername || null],
      sercountry: [sercountry || null],
      serdesc: [serdesc || null],
      serstatus: [serstatus || null],
      type: [type || null],
      serprice: [
        serprice || null,
        Validators.compose([
          pricing_type === "F" ? Validators.min(minlimit) : null,
          // pricing_type === "F" ? Validators.max(maxlimit) : null, // TODO - max limit removed as per discussion with sushmitha malik bharath on (02-02-2020)
        ]),
      ],
      serformula1: [serformula1 || null],
      serformula2: [serformula2 || null],
      pricing_type: [pricing_type || null],
      short_code: [short_code || null],
      minlimit: [minlimit || null],
      maxlimit: [maxlimit || null],
      cursymbol: [cursymbol || null],
      isSelected: [isSelected || false],
      isSelected1: [isSelected1 || false],
      // isSelected: [paid_amount && paid_amount !== 0 ? true : isSelected || false],
      key: key,
      paid_amount: paid_amount || 0,
      isDisabled: isDisabled || false,
      isDiscription: isDiscription || false,
      flag: flag || "https://restcountries.eu/data/ind.svg",
      plan: plan || 0,
      desc: desc || null,
      isRenewal: isRenewal || false,
      isExpired: isExpired || false,
      isDiscriptionContent: isDiscriptionContent || false,
      planUpgraded: planUpgraded || false,
      isSelectedEitherAorB: isSelectedEitherAorB || false,
    });
  }

  getSelectedSubscriptionQuestions() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getSelectedSubscriptionQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.selectedSubscriptionList = res.data || [];
        this.getSubscriptionQuestions();
      }
    });
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


  checkIfRenewal(date) {
    let today = new Date();
    let currentDate = today.toISOString()
    let expireDate = date
    return expireDate < currentDate;
    // return true; // TODO - for testing
  }

  checkIsExpired(date) {
    let today = new Date();
    let currentDate = today.toISOString()
    let expireDate = date
    return expireDate < currentDate;
    // return true; // TODO - for testing
  }

  getSubscriptionQuestions() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getSubscriptionQuestions().subscribe((res) => {
      console.log(res);
      this.loadingService.hide();
      if (res.statusCode === 0) {
        new Promise((resolve) => {
          this.removeSubscriptionData();
          resolve({});
        })
          .then(() => {
            if (res.data.length > 0 && res.data[1]) {
              let countryList = [];
              res.data[1].forEach((value, i) => {
                let a = res.data[0].filter((val) => val.sercountry === value && val.type === ServiceType.ADVISORY);
                let sService: any[] = [];
                let flag = "https://restcountries.eu/data/ind.svg";
                let isDisabled = false;
                let planUpgraded = false;
                let isSelectedEitherAorB = false;
                if (a && a[0]) {
                  let isDiscription = false;
                  a.forEach((element, eleInd) => {
                    flag = element.flag;
                    let plan = 0;
                    let isRenewal = false;
                    let isExpired = false;
                    let isDiscriptionContent = false;
                    if (eleInd === 0) {
                      plan = 1;
                    } else if (eleInd === 1) {
                      plan = 2;
                    } else if (eleInd === 2) {
                      plan = 3;
                    } else if (eleInd === 3) {
                      plan = 4;
                    }
                    let isSelected = this.selectedSubscriptionList.filter((val) => val.servid === element.id);
                    let desc = null;
                    if (isSelected && isSelected[0]) {
                      isDisabled = true;
                      isDiscription = true;
                      isDiscriptionContent = true;
                      isSelectedEitherAorB = true;
                      if (plan === 2 || plan === 3 || plan === 4) {
                        planUpgraded = true;
                      }
                      desc = {
                        subscribed_date: (isSelected[0] && isSelected[0].subscribed_date) || null,
                        servexpdt: (isSelected[0] && isSelected[0].servexpdt) || null,
                        servlocation: (isSelected[0] && isSelected[0].servlocation) || null,
                        servname: (isSelected[0] && isSelected[0].servname) || null,
                        servtype: (isSelected[0] && isSelected[0].servtype) || null,
                        presentdt: (isSelected[0] && isSelected[0].presentdt) || null,
                        paid_amount: (isSelected[0] && isSelected[0].paid_amount) || null,
                        advised_amount: (isSelected[0] && isSelected[0].advised_amount) || null,
                      };
                      isRenewal = this.checkIfRenewal(desc.servexpdt);
                      isExpired = this.checkIsExpired(desc.servexpdt);
                    } else {
                      isDiscriptionContent = false;
                    }
                    let dummy = {
                      ...element,
                      ...isSelected[0],
                      isSelected1: isSelected.length > 0 ? true : false || false,
                      isDisabled,
                      isDiscription,
                      plan,
                      desc,
                      isRenewal,
                      isExpired,
                      planUpgraded,
                      isDiscriptionContent,
                      isSelectedEitherAorB,
                    };
                    console.log(dummy);
                    sService.push(dummy);
                    console.log(this.selectedSubscriptionList);
                    console.log({ isSelected });
                    console.log({ sService });
                  });
                  console.log({ a });
                  countryList.push({ countryName: value, flag, planUpgraded, service: sService });
                }
              });

              console.log({ countryList });
              countryList.forEach((arrValue, key) => {
                console.log(arrValue.countryName);
                console.log(arrValue.planUpgraded);
                this.getCountrylistData().push(
                  this.countryListDataArray(
                    arrValue.countryName,
                    arrValue.flag,
                    arrValue.planUpgraded,
                    "",
                    key,
                    arrValue.service,
                    true
                  )
                );
                console.log(this.getCountrylistData());
              });

              let traningList = res.data[0].filter((val) => val.type === ServiceType.TRAINING);

              let isSelectedEitherAorB1 = false;
              traningList.forEach((arrValue, key) => {
                arrValue.plan = 0;
                arrValue.planUpgraded = false;
                arrValue.isSelected1 = arrValue.isSelected;
                let isSelected = this.selectedSubscriptionList.filter((val) => val.servid === arrValue.id);
                arrValue.desc = null;
                if (isSelected && isSelected[0]) {
                  arrValue.isDisabled = true;
                  arrValue.isDiscription = true;
                  arrValue.isDiscriptionContent = true;
                  isSelectedEitherAorB1 = true;
                  arrValue.isSelectedEitherAorB = isSelectedEitherAorB1;
                  arrValue.desc = {
                    subscribed_date: (isSelected[0] && isSelected[0].subscribed_date) || null,
                    servexpdt: (isSelected[0] && isSelected[0].servexpdt) || null,
                    servlocation: (isSelected[0] && isSelected[0].servlocation) || null,
                    servname: (isSelected[0] && isSelected[0].servname) || null,
                    servtype: (isSelected[0] && isSelected[0].servtype) || null,
                    presentdt: (isSelected[0] && isSelected[0].presentdt) || null,
                    paid_amount: (isSelected[0] && isSelected[0].paid_amount) || null,
                    advised_amount: (isSelected[0] && isSelected[0].advised_amount) || null,
                  };
                  arrValue.isRenewal = this.checkIfRenewal(arrValue.desc.servexpdt);
                  arrValue.isExpired = this.checkIsExpired(arrValue.desc.servexpdt);
                } else {
                  arrValue.isSelectedEitherAorB = isSelectedEitherAorB1;
                  arrValue.isDiscriptionContent = false;
                }

                console.log(arrValue);
                this.getCountrylistData().push(
                  this.countryListDataArray(arrValue.sercountry, arrValue.flag, false, "", key, [arrValue], false)
                );
                console.log(this.getCountrylistData());
              });

              console.log(this.getCountrylistData());
            }
          })
          .then(() => {
            this.setSelectedPlanArray();
            console.log("console.log", this.subscriptionForm.value);
          });
      }
    });
  }

  removeSubscriptionData() {
    let length = this.getCountrylistData().length;
    for (let i = length; i >= 0; i--) {
      this.getCountrylistData().removeAt(i);
    }
  }

  inputPriceEmit(i, j, event) {
    console.log({ i, event });
    this.getCountrySubscriptionData(i).controls[j].patchValue({
      serprice: event,
    });
    this.setSelectedPlanArray();
  }

  upgradeButton(i, j, event) {
    console.log({ i, event });
    console.log(this.getCountrySubscriptionData(i).controls[j].value);
    let data = this.getCountrySubscriptionData(i).controls[j].value;
    console.log(data);

    let request = {
      upgrade_from_serid: data.isDiscriptionContent ? data.id : data.id - 1 || null,
      upgrade_to_serid: data.id || null,
      paid_amount: data.paid_amount || 0,
      investment_amount: data.serprice || 0,
    };
    console.log(request);

    this.loadingService.show();
    this.profileService.upgradeServices(request).subscribe(
      (res) => {
        this.loadingService.hide();
        console.log(res);
        if (res.status_code === 101) {
          this.toastrService.show({ message: res.data || res.message || "", type: "error" });
        } else if (res && res.razordict) {
          this.acceptUpgradeSubscriptionTermsAndCondition(res && res.razordict);
          // this.upgradeSubscriptionPayments(res && res.razordict);
        } else {
          this.toastrService.show({ message: res.data || res.message || "", type: "error" });
        }
      },
      (err) => {
        this.loadingService.show();
        this.isChecked = false;
        this.toastrService.show({
          message: "Something went wrong / Please try again later... ",
          type: "error",
        });
      }
    );
  }

  selectedButton(i, j, event) {
    console.log({ i, event });
    this.getCountrySubscriptionData(i).controls[j].patchValue({
      isSelected: event,
    });
    console.log(this.getCountrySubscriptionData(i).controls[j].value);
    this.checkifOnlyoneSelected(i, j);
  }

  checkifOnlyoneSelected(i, j) {
    let currentObj: any = this.getCountrySubscriptionData(i).controls[j].value;
    let totalArr: any[] = this.getCountrySubscriptionData(i).value;
    let changeArr: any[] = totalArr.filter(
      (val: any) =>
        val.sercountry === currentObj.sercountry && val.type !== ServiceType.TRAINING && val.id !== currentObj.id
    );
    console.log({ changeArr });
    console.log({ currentObj });
    changeArr.forEach((value) => {
      console.log(i, j, value.key);
      if (j !== value.key) {
        this.getCountrySubscriptionData(i).controls[value.key].patchValue({
          isSelected: false,
        });
      }
    });
    this.setSelectedPlanArray();
  }

  setSelectedPlanArray() {
    let data: any[] = [];
    for (var i = 0; i < this.getCountrylistData().length; i++) {
      this.getCountrySubscriptionData(i).value.forEach((val) => {
        data.push(val);
      });
    }
    this.selectedPlanArray = [];
    let totalArr: any[] = data;
    // let currentArray: any[] = totalArr.filter((res) => res.isSelected1 === true || res.isSelected === true);
    let currentArray: any[] = totalArr.filter((res) => res.isSelected === true);
    currentArray.forEach((res) => {
      if (res.type === ServiceType.TRAINING) {
        this.selectedPlanArray.push({ ...res, plans: `Investment Training ${res.sername}` });
      } else {
        this.selectedPlanArray.push({ ...res, plans: `Investment Plan ${res.sercountry} ( ${res.short_code} )` });
      }
    });
  }

  onChecked(event) {
    this.isChecked = event.detail.checked;
  }

  async proceedToPayment() {
    let request: any = await null;
    request = await this.payNewAdvisorySelected();
    console.log({ request });
    if (request) {
      this.loadingService.show();
      this.profileService.selectedSubscriptionPayments({ data: request }).subscribe(
        (res) => {
          this.loadingService.hide();
          console.log(res);
          if (res) {
            // this.newselectedSubscriptionPayments(res && res.razordict);
            this.proceedToPayment1(res)
          } else {
            this.toastrService.show({ message: res.data || "", type: "error" });
          }
        },
        (err) => {
          this.isChecked = false;
          this.toastrService.show({
            message: "Something went wrong / Please select a new plan before proceed... ",
            type: "error",
          });
        }
      );
    } else {
      this.toastrService.show({ message: "Please select a new plan before continue this...", type: "error" });
    }
  }

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

  async acceptUpgradeSubscriptionTermsAndCondition(data) {
    const modal = await this.modalController.create({
      component: UpgradeComponent,
      cssClass: "my-custom-class-modal",
      componentProps: { data: data },
      swipeToClose: false,
      showBackdrop: true,
    });
    return await modal.present();
  }

  async upgradeSubscriptionPayments(data) {
    data["ismobile"] = await true;
    data["t"] = await this.store.selectSnapshot(AuthState.getToken);
    let url: any = await new URL(
      `${environment.domain}${ServiceURL.UPGRADE_SUBSCRPTION_PAYMENT}[${JSON.stringify(data)}]`
    );
    console.log({ url });
    // await window.location.assign(url);
    this.router.navigate(["/tabs/tab1"]);

    const browser = await this.iab.create(url, "_self", {
      toolbar: "no",
      fullscreen: "yes",
      presentationstyle: "fullscreen",
      footer: "no",
      location: "no",
    });
    await browser.on("loadstart").subscribe((event) => {
      if (
        event.url.includes("https://savart.in/ui/login") ||
        event.url.includes("https://savart.in/clients/savart/cancelled") ||
        event.url.includes("http://savart.eastus.cloudapp.azure.com:8000/ui/login") ||
        event.url.includes("http://savart.eastus.cloudapp.azure.com:8000/clients/savart/cancelled") ||
        event.url.includes("https://api.razorpay.com/v1/payments/pay") ||
        event.url.includes("https://api.razorpay.com/v1/gateway/mocksharp/payment?key_id=rzp_test_tA5haXDJopDQY9")
      ) {
        setTimeout(() => {
          browser.close();
        }, 500);
      }
      console.log("event", { event });
      console.log("event", event.url);
    });

    this.document.addEventListener(
      "pause",
      () => {
        console.log("pause");
        this.commonService.isMobilePaused = true;
      },
      false
    );
    this.document.addEventListener(
      "resume",
      () => {
        console.log("resume");
        if (this.commonService.isMobilePaused) {
          this.redirectBasedonStatus();
          this.commonService.isMobilePaused = false;
        }
      },
      false
    );
  }

  async newselectedSubscriptionPayments(data) {
    data["ismobile"] = await true;
    data["t"] = await this.store.selectSnapshot(AuthState.getToken);
    let url: any = await new URL(
      `${environment.domain}${ServiceURL.NEW_SELECTED_SUBSCRPTION_PAYMENT}[${JSON.stringify(data)}]`
    );
    console.log({ url });
    // await window.location.assign(url);
    //let windowname = window.location.assign(url);
    // const browser = this.iab.create(url);
    this.router.navigate(["/tabs/tab1"]);
    // const browser = await this.iab.create(url, "_blank", {
    const browser = await this.iab.create(url, "_self", {
      toolbar: "no",
      fullscreen: "yes",
      presentationstyle: "fullscreen",
      footer: "no",
      location: "no",
    });
    browser.on("loadstart").subscribe((event) => {
      if (
        event.url.includes("https://savart.in/ui/login") ||
        event.url.includes("https://savart.in/clients/savart/cancelled") ||
        event.url.includes("http://savart.eastus.cloudapp.azure.com:8000/ui/login") ||
        event.url.includes("http://savart.eastus.cloudapp.azure.com:8000/clients/savart/cancelled") ||
        event.url.includes("https://api.razorpay.com/v1/payments/pay")
      ) {
        setTimeout(() => {
          browser.close();
        }, 500);
      }
      console.log("event", { event });
      console.log("event", event.url);
    });

    await Browser.open({ url, windowName: "_system" });

    this.document.addEventListener(
      "pause",
      () => {
        console.log("pause");
        this.commonService.isMobilePaused = true;
      },
      false
    );

    this.document.addEventListener(
      "resume",
      () => {
        console.log("resume", browser);
        if (browser) {
          browser.close();
          browser.hide();
          console.log("resume", browser);
        }
        if (this.commonService.isMobilePaused) {
          this.redirectBasedonStatus();
          this.commonService.isMobilePaused = false;
        }
      },
      false
    );
  }
  async proceedToPayment1(value) {
    let data = value.razordict
    console.log(this.subscriptionForm.value);
    let options: any = {
      key: value.razordict.api_key,
      // amount: 1 * 100, // amount should be in paise format to display Rs 1255 without decimal point
      amount: value.razordict.amount * 100, // amount should be in paise format to display Rs 1255 without decimal point
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
          value.razordict.phone ||
          `+ ${this.store.selectSnapshot(CommonState.getCountryCode)}${this.store.selectSnapshot(
            CommonState.getMobileNumber
          )}`,
        name: value.razordict.name,
        email: value.razordict.email,
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

    // Razorpay.open(
      RazorpayCheckout.open(
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
    let params = "t="+window.btoa(data["t"])+"&payment_id="+payment_id+"&order_id="+data["order_id"]+"&paid_per_service="+JSON.stringify(data["amount_paid_per_service"]).replace(/&#x27;/g,'"')
    this.subs.sink = this.profileService.captureRazorPayPayment(params).subscribe((res) => {
      this.loadingService.hide();
      if (res.status_code === "100") {
        this.showAlertCallBack("Payment Successful!","Thanks for your trust and choosing to invest with us!").then(data=>{
          if(data)
          this.navCtrl.navigateRoot("/tabs/tab1/personal-profile");
        })
      }else{
        this.showAlertCallBack("Payment Failed!","Please contact to admin or try after sometime.").then(data=>{
        })
      }
    });
  }


  async getTotalSelectedAmount() {
    let amount: any = await 0;
    await this.selectedPlanArray.forEach((value) => {
      if (value.serprice && value.isDisabled === false) {
        amount = parseFloat(amount) + parseFloat(value.serprice);
      }
    });
    console.log({ amount });
    return amount;
  }

  async payNewAdvisorySelected() {
    let list: any[] = await [];
    await this.selectedPlanArray.forEach((value) => {
      if (value.isDisabled === false) {
        list.push({
          short_code: value.short_code || "",
          sercountry: value.sercountry || "",
          sername: value.sername || "",
          pricing_type: value.pricing_type || "",
          inv_amount: value.serprice || "",
        });
      }
    });
    return list;
  }

  async payWithRazor(options) {
    // try {
    //   let data = (await Checkout.open(options));
    //   console.log(data['response']['razorpay_payment_id'])
    //   } catch (error) {
    //     console.log(error['description'])
    //   }
    var successCallback = function (payment_id) {
      alert('payment_id: ' + payment_id);
    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    Razorpay.open(options, successCallback, cancelCallback);


    this.document.addEventListener(
      "pause",
      () => {
        console.log("pause");
        alert("Pause")
        this.commonService.isMobilePaused = true;
      },
      false
    );

    this.document.addEventListener(
      "resume",
      () => {
        
        alert("Resume")
        if (this.commonService.isMobilePaused) {
          this.redirectBasedonStatus();
          this.commonService.isMobilePaused = false;
        }
      },
      false
    );
    // const rzp = new Razorpay(options);
    // rzp.open();
    // this.ngZone.run(() => {
    //   Razorpay.open(
    //     options,
    //     (value) => {
    //       this.ngZone.run(() => {
    //         alert("Success")
    //         console.clear();
    //         console.log(value);
    //         this.paymentId = value;
    //         this.toastrService.show({
    //           message: "Thanks for your trust and choosing to invest with us!",
    //         });
    //         // this.captureRazorPay(value);
    //       });
    //     },
    //     (err) => {
    //       alert("Failed")
    //       if (err.code === 3) {
    //         this.toastrService.show({
    //           message: err.description,
    //           type: "error",
    //         });
    //       } else if (err.code === 0) {
    //         this.toastrService.show({
    //           message: err.description,
    //           type: "error",
    //         });
    //       } else {
    //         this.toastrService.show({
    //           message: "Oops! Seems like your payment failed. Please try again or contact support",
    //           type: "error",
    //         });
    //       }
    //     }
    //   );
    // });
  }

  captureRazorPay(payment_id) {
    alert(payment_id)
    console.clear();
    console.log({ payment_id });
    this.loadingService.show();
    this.subs.sink = this.profileService.capturePayment({ payment_id }).subscribe(
      (res) => {
        this.loadingService.hide();
        console.log(res);
        // alert(JSON.stringify(res));
      },
      (err) => {
        this.loadingService.hide();
        if (err.status === 200) {
          this.subs.sink = this.store.dispatch(new UpdateCusStatus()).subscribe((res) => {
            this.navCtrl.navigateRoot("/tabs/tab2");
            console.log({ res });
          });
        } else {
          // alert(JSON.stringify(err));
          console.log(JSON.stringify(err));
        }
        console.log(err);
      }
    );
  }

  getOrderId() {
    this.subs.sink = this.httpService.getOrderId().subscribe((res) => {
      console.log({ res });
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
