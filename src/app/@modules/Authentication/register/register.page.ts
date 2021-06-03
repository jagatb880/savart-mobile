import { Component, OnInit } from "@angular/core";
import { profile } from "@core/models/profile";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  profileForm: FormGroup;

  list = [
    {
      countryCodeValue: "91",
      countryCodeDisplayVal: "+91",
    },
    {
      countryCodeValue: "971",
      countryCodeDisplayVal: "+971",
    },
    {
      countryCodeValue: "1",
      countryCodeDisplayVal: "+1",
    },
  ];

  constructor(private fb: FormBuilder) {
    this.createForms();
  }

  dummyArr = profile.data;
  ngOnInit() {
    console.log(this.getProfiles());
    profile.data.forEach((value) => {
      this.getProfiles().push(
        this.dynamicNewProfiles(value.profqname, value.profqtype, value.profqorder, value.values)
      );
    });
  }

  createForms() {
    this.profileForm = this.fb.group({
      profiles: this.fb.array([]),
    });
  }

  getProfiles(): FormArray {
    return this.profileForm.get("profiles") as FormArray;
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

  dynamicNewProfiles(profqname, profqtype, profqorder, values): FormGroup {
    return this.fb.group({
      profqname: [profqname || null],
      profqtype: [profqtype || null],
      profqorder: [profqorder || null],
      values: [values || []],
      custresponse: null,
    });
  }

  getValue() {
    console.log(this.profileForm.value);
  }
}
