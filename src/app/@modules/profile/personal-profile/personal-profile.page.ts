import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ProfileService } from "@service/profile.service";
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from "@angular/forms";
import { ValidatorUtils } from "@core/utils/validator";
import { LoadingService } from "@service/loading.service";
import { CommonService } from "@service/common.service";
import { NavController } from "@ionic/angular";
import { ToastrService } from "@service/toastr.service";
import { SubSink } from "subsink";
import { Store } from "@ngxs/store";
import { UpdateCusStatus } from "@store/actions/common.action";
import { CommonState } from "@store/state/common.state";
import { custstatus } from "@core/constants/constants";
@Component({
  selector: "app-personal-profile",
  templateUrl: "./personal-profile.page.html",
  styleUrls: ["./personal-profile.page.scss"],
})
export class PersonalProfilePage implements OnInit, AfterViewChecked, OnDestroy {
  profileForm: FormGroup;

  isEditable = true;
  countryList: any = [];
  private subs = new SubSink();
  imgErrorStatus: boolean = false;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private helper: ValidatorUtils,
    private loadingService: LoadingService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private store: Store,
    private commonService: CommonService,
    private validator: ValidatorUtils
  ) {
    this.createForms();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ionViewWillLeave() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.isEditable = true;
    this.removeProfileData();
    this.getCountries();
  }

  getCountries() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getCountries().subscribe(
      (res) => {
        console.log({ res });
        this.loadingService.hide();
        if (res.statusCode === 0) {
          this.countryList = res.data || [];
          this.getPersonalProfileQuestions();
        }
      },
      (err) => {
        this.loadingService.hide();
        this.getPersonalProfileQuestions();
      }
    );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  createForms() {
    this.profileForm = this.fb.group({
      custProfile: this.fb.array([]),
    });
  }

  getProfiles(): FormArray {
    return this.profileForm.get("custProfile") as FormArray;
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

  dynamicNewProfiles(profqname, profqtype, profqorder, values, custresponse?: any): FormGroup {
    return this.fb.group({
      profqname: [profqname || null],
      profqtype: [profqtype || null],
      profqorder: [profqorder || null],
      values: [values || []],
      custresponse: [
        custresponse || null,
        Validators.compose([
          Validators.required,
          profqtype === "G" ? this.helper.validateEmail : null,
          // profqtype === "F" ? this.helper.validateOnlyNumber : null,
          profqtype === "F" ? null : null,
        ]),
      ],
    });
  }

  getPersonalProfileQuestions() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getPersonalProfileQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.getCompletedPersonalProfileQuestions();
        res.data &&
          res.data.forEach((value) => {
            console.log(value);
            if (value.profqname === "Country") {
              this.getProfiles().push(
                this.dynamicNewProfiles(
                  value.profqname,
                  value.profqtype,
                  value.profqorder,
                  this.countryList.length > 0 ? this.countryList : value.values,
                  value.custresponse
                )
              );
            } else {
              this.getProfiles().push(
                this.dynamicNewProfiles(
                  value.profqname,
                  value.profqtype,
                  value.profqorder,
                  value.values,
                  value.custresponse
                )
              );
            }
          });
      }
    });
  }

  getCompletedPersonalProfileQuestions() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getCompletedPersonalProfileQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        if (res.data.length > 0) {
          res.data &&
            res.data.forEach((value, i) => {
              this.getProfiles().controls[i].patchValue({
                custresponse: value.custresponse || null,
              });
              console.log(value.custresponse);
            });
          this.isEditable = false;
        } else {
          this.getProfiles().controls[0].patchValue({
            custresponse: (res.data && res.data.custregmobile) || null,
          });
        }
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
    this.imgErrorStatus = false;
    console.log(this.profileForm.valid);
    console.log(this.profileForm.value);
    let a: any = this.profileForm.controls.custProfile;
    if(a.controls[15].controls.custresponse.value != null && a.controls[15].controls.custresponse.value.Front.imgSrc == null){
      a.controls[15].controls.custresponse.setErrors({'incorrect': true});
      this.imgErrorStatus = true;
    }
    if(a.controls[15].controls.custresponse.value != null && a.controls[15].controls.custresponse.value.Back.imgSrc == null){
      a.controls[15].controls.custresponse.setErrors({'incorrect': true});
      this.imgErrorStatus = true;
    }
    if(a.controls[16].controls.custresponse.value != null && a.controls[16].controls.custresponse.value.Front.imgSrc == null){
      a.controls[16].controls.custresponse.setErrors({'incorrect': true});
      this.imgErrorStatus = true;
    }
    if (this.profileForm.valid) {
      this.imgErrorStatus = false;
      this.loadingService.show();
      this.subs.sink = this.profileService.savePersonalProfileQuestions(this.profileForm.value).subscribe((res) => {
        console.log(res);
        if (res.statusCode === 0) {
          this.loadingService.hide();
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
          this.loadingService.hide();
          this.toastrService.show({ message: res.data + "\n " + res.error, type: "error" });
        }
      });
    } else if(!this.imgErrorStatus){
      this.validator.validateAllFormFields(this.profileForm);
      let length = this.getProfiles().length;
      for (let i = length; i > 0; i--) {
        this.getProfiles().controls[i - 1].get("custresponse").markAsDirty();
        this.getProfiles().controls[i - 1].get("custresponse").updateValueAndValidity();
      }
      this.toastrService.show({ message: "Please fill all the details" });
    }else{
      this.toastrService.show({ message: "Please upload the image" });
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  setEditable() {
    console.log("clicked");
    this.isEditable = this.isEditable === true ? false : true;
  }
}
