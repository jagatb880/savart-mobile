import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { ValidatorUtils } from "@core/utils/validator";
import { LoadingService } from "@service/loading.service";
import { ProfileService } from "@service/profile.service";

import { ToastrService } from "@service/toastr.service";
import { NavController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { UpdateCusStatus } from "@store/actions/common.action";
import { CommonState } from "@store/state/common.state";
import { Logout } from "@store/actions/auth.actions";
import { SubSink } from "subsink";

import { Plugins } from "@capacitor/core";
import { custstatus } from "@core/constants/constants";
import { CommonService } from "@service/common.service";
const { Browser } = Plugins;

@Component({
  selector: "app-demat",
  templateUrl: "./demat.page.html",
  styleUrls: ["./demat.page.scss"],
})
export class DematPage implements OnInit, AfterViewChecked, OnDestroy {
  dematForm: any;
  brokerList: any[] = [];
  brokerListUrl: any[] = [];
  previousDematList: any[] = [];
  isDisabled = false;

  private subs = new SubSink();
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private helper: ValidatorUtils,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private store: Store
  ) {
    this.createForms();
  }

  ngOnInit() {
    this.brokerList = [];
    this.getDematQuestions();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async ionViewWillEnter() {
    await this.loadingService.show();
    this.subs.sink = await this.store.dispatch(new UpdateCusStatus()).subscribe(async () => {
      await this.loadingService.hide();
      let cust: any[] = await this.store.selectSnapshot(CommonState.getCusStatus);
      console.log({ cust });
      if (cust && cust[0]) {
        if (cust.filter((val) => val.taskname === "Demat")[0].status === "C") {
          this.isDisabled = await false;
        } else {
          this.isDisabled = await false;
        }
      } else {
        await this.toastrService.show({ message: "Something went wrong please login again", type: "error" });
        await this.store.dispatch(new Logout());
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  createForms() {
    this.dematForm = this.fb.group({
      data: this.fb.array([]),
    });
  }

  getDemat(): FormArray {
    return this.dematForm.get("data") as FormArray;
  }

  newDemat(): FormGroup {
    return this.fb.group({
      profqname: null,
      profqtype: null,
      profqorder: null,
      values: [],
      custresponse: null,
    });
  }

  dynamicnewDemat(profqname, profqtype, profqorder, values, custresponse?: any): FormGroup {
    return this.fb.group({
      profqname: [profqname || null],
      profqtype: [profqtype || null],
      profqorder: [profqorder || null],
      values: [values || []],
      custresponse: [
        custresponse || profqorder == 1 || profqorder == 3 ? false : null,
        Validators.compose([
          Validators.required,
          profqtype === "G" ? this.helper.validateEmail : null,
          profqtype === "F" ? null: null,
          // profqtype === "F" ? this.helper.validateOnlyNumber : null,
        ]),
      ],
    });
  }

  getPreviousDemat() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getPreviousDemat().subscribe((res) => {
      this.loadingService.hide();
      console.log({ res });
      if (res.statusCode === 0) {
        this.previousDematList = res.data || [];
        res.data &&
          res.data.forEach((val, index) => {
            console.log(val);
            if (val.profqorder === 1) {
              this.getDemat().controls[index].patchValue({
                custresponse: val.custresponse === "Yes" ? true : false || false,
              });
            }
            if (val.profqorder === 2) {
              this.getDemat().controls[index].patchValue({
                custresponse: val.custresponse || null,
              });
            }
            if (val.profqorder === 3) {
              this.getDemat().controls[index].patchValue({
                custresponse: val.custresponse === "Yes" ? true : false || false,
              });
            }
            if (val.profqorder === 4) {
              this.getDemat().controls[index].patchValue({
                custresponse: val.custresponse || null,
              });
            }
            console.log(this.dematForm.value);
          });
      }
    });
  }

  getDematQuestions() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getDematQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.brokerList = (res.data && res.data[1].brokers_list) || [];
        res.data &&
          res.data[0] &&
          res.data[0].dematQuestions.forEach((value, keyIndex) => {
            if (keyIndex === 1) {
              this.getDemat().push(
                this.dynamicnewDemat(
                  value.profqname,
                  value.profqtype,
                  value.profqorder,
                  value.values && value.values!.length > 0 ? value.values : this.brokerList || this.brokerList
                )
              );
            } else {
              this.getDemat().push(
                this.dynamicnewDemat(value.profqname, value.profqtype, value.profqorder, value.values)
              );
            }
          });
        this.getDemat().push(
          this.dynamicnewDemat(
            "Others",
            "M",
            res.data[0].dematQuestions.length + 1,
            (res.data && res.data[1].brokers_list) || []
          )
        );
        console.log(this.getDemat().value);
        console.log(this.brokerList);
        let countryBorkerList: any[] = [];
        countryBorkerList = this.brokerList.filter(
          (resp) => resp.broker_url.toString().trim() !== "" && resp.broker_url.toString().trim() !== null
        );
        let countryList = (res.data && res.data[1].demat_countries) || [];
        console.log({ countryBorkerList });
        console.log({ countryList });
        countryList.forEach((con) => {
          let arr: any = {};
          arr["name"] = con.country;
          arr["flag"] = con.flag;
          arr["brokerList"] = countryBorkerList.filter((list) => list.location === con.country) || [];
          this.brokerListUrl.push(arr);

          this.cdr.markForCheck();
        });
        console.log(this.brokerListUrl);
        console.log(this.dematForm.value);

        this.getPreviousDemat();
      }
    });
  }

  removeProfileData() {
    let length = this.getDemat().length;
    for (let i = length; i >= 0; i--) {
      this.getDemat().removeAt(i);
    }
  }

  async openBrowser(url) {
    await Browser.open({ url: url });
  }

  submitDemat() {
    console.log(this.dematForm.value);
    this.loadingService.show();
    let request: any = {};
    request.data = [];
    let req: any = this.dematForm.value;
    req.data.forEach((value, keyIndex) => {
      if (value.profqorder === 1) {
        request.data[keyIndex] = {
          profqorder: value.profqorder || null,
          profqname: value.profqname || null,
          custresponse: value.custresponse === true ? "Yes" : "No" || "No",
          profqtype: value.profqtype || "",
        };
      }

      if (value.profqorder === 2) {
        request.data[keyIndex] = {
          profqorder: value.profqorder || null,
          profqname: value.profqname || null,
          custresponse: value.custresponse || null,
          profqtype: value.profqtype || "",
        };
      }

      if (value.profqorder === 3) {
        request.data[keyIndex] = {
          profqorder: value.profqorder || null,
          profqname: value.profqname || null,
          custresponse: value.custresponse === true ? "Yes" : "No" || "No",
          profqtype: value.profqtype || "",
        };
      }

      if (value.profqorder === 4) {
        request.data[keyIndex] = {
          profqorder: value.profqorder || null,
          profqname: value.profqname || null,
          custresponse: value.custresponse || null,
          profqtype: value.profqtype || "",
        };
      }
    });
    console.log({ request });
    this.subs.sink = this.profileService.saveDematQuestions(request).subscribe((res) => {
      this.loadingService.hide();
      console.log({ res });
      if (res.statusCode === 0) {
        this.toastrService.show({ message: res.data });

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
                this.navCtrl.navigateRoot("/tabs/tab1");
              }
            }
          } else {
            this.navCtrl.navigateRoot("/tabs/tab1");
          }
        });

        this.subs.sink = this.store.dispatch(new UpdateCusStatus()).subscribe(() => {
          this.navCtrl.navigateForward("/tabs/tab2");
        });
      } else {
        this.toastrService.show({ message: res.data, type: "error" });
      }
    });
  }
}
