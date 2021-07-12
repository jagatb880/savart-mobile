import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { ProfileService } from "@service/profile.service";
import { ValidatorUtils } from "@core/utils/validator";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { NavController } from "@ionic/angular";
import { UpdateCusStatus } from "@store/actions/common.action";
import { CommonState } from "@store/state/common.state";
import { custstatus } from "@core/constants/constants";
import { CommonService } from "@service/common.service";
import { SubSink } from "subsink";
import { Store } from "@ngxs/store";

@Component({
  selector: "app-investment-profile",
  templateUrl: "./investment-profile.page.html",
  styleUrls: ["./investment-profile.page.scss"],
})
export class InvestmentProfilePage implements OnInit, AfterViewChecked {
  investmentForm: FormGroup;

  isEditable = true;
  private subs = new SubSink();
  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    public helper: ValidatorUtils,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private navCtrl: NavController,
    private commonService: CommonService,
    private store: Store
  ) {
    this.createForms();
  }

  ngOnInit() {
    this.isEditable = true;
    this.removeProfileData();
    this.getInvestmentProfileQuestions();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  createForms() {
    this.investmentForm = this.fb.group({
      custProfile: this.fb.array([]),
    });
  }

  getProfiles(): FormArray {
    return this.investmentForm.get("custProfile") as FormArray;
  }

  newProfiles(): FormGroup {
    return this.fb.group({
      profqname: null,
      profqtype: null,
      profqorder: null,
      values: [],
      custresponse: null,
    });
  }

  dynamicNewProfiles(profqname: any, profqtype, profqorder, values, custresponse?: any): FormGroup {
    console.log({ profqorder });
    return this.fb.group({
      profqname: [profqname || null],
      profqtype: [profqtype || null],
      profqorder: [profqorder || null],
      values: [values || []],
      custresponse: [
        custresponse || null,
        Validators.compose([
          profqorder === 1 ? Validators.maxLength(13) : null,
          Validators.required,
          profqtype === "G" ? this.helper.validateEmail : null,
          profqtype === "F" ? null : null,
          // profqtype === "F" ? this.helper.validateOnlyNumber : null,
        ]),
      ],
    });
  }

  getInvestmentProfileQuestions() {
    this.loadingService.show();
    this.profileService.getInvestmentProfileQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.getCompletedInvestmentProfileQuestions();
        res.data &&
          res.data.forEach((value) => {
            this.getProfiles().push(
              this.dynamicNewProfiles(value.profqname, value.profqtype, value.profqorder, value.values)
            );
          });
      }
    });
  }

  getCompletedInvestmentProfileQuestions() {
    this.loadingService.show();
    this.profileService.getCompletedInvestmentProfileQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        if (res.data && res.data.length > 0) {
          this.isEditable = true;
        }
        res.data &&
          res.data.forEach((value, i) => {
            this.getProfiles().controls[i].patchValue({
              custresponse: value.custresponse || null,
            });
          });
      }
    });
  }

  removeProfileData() {
    let length = this.getProfiles().length;
    for (let i = length; i >= 0; i--) {
      this.getProfiles().removeAt(i);
    }
  }

  submitProfile() {
    console.log(this.investmentForm.valid);
    console.log(this.investmentForm);
    console.log(this.investmentForm.value);
    if (this.investmentForm.valid) {
      this.loadingService.show();
      this.profileService
        .saveInvestmentProfileQuestions(this.investmentForm.controls.custProfile.value)
        .subscribe((res) => {
          this.loadingService.hide();
          console.log(res);
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
          } else {
            this.toastrService.show({ message: res.data, type: "error" });
          }
        });
    } else {
      this.helper.validateAllFormFields(this.investmentForm);
      // for (let i = 0; i <= this.getProfiles().length; i++) {
      //   this.helper.validateAllFormFields(this.investmentForm.get("profiles")[i]);
      // }
      let length = this.getProfiles().length;
      for (let i = length; i > 0; i--) {
        this.getProfiles().controls[i - 1].get("custresponse").markAsDirty();
        this.getProfiles().controls[i - 1].get("custresponse").updateValueAndValidity();
      }
    }
  }
  setEditable() {
    console.log("clicked");
    this.isEditable = this.isEditable === true ? false : true;
  }
}
