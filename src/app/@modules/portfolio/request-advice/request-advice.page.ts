import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReqInvtype } from "@core/constants/constants";
import { MonthDate } from "@core/models/monthdate";
import { NavController } from "@ionic/angular";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";

@Component({
  selector: "app-request-advice",
  templateUrl: "./request-advice.page.html",
  styleUrls: ["./request-advice.page.scss"],
})
export class RequestAdvicePage implements OnInit {
  adviceForm: FormGroup;
  MonthDate = MonthDate;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private portfolioService: PortfolioService,
    private navCtrl: NavController,
    private toastrService: ToastrService
  ) {
    this.createAdviceForm();
  }

  createAdviceForm() {
    this.adviceForm = this.fb.group({
      investment_amount: [null, Validators.required],
      investmemnt_mode: [null, Validators.required],
      investment_req_invtype: false,
      investment_monthDate: null,
      comment: null
    });
  }

  ngOnInit() {
    this.isFieldChanges();
  }

  isFieldChanges() {
    this.adviceForm.controls.investmemnt_mode.valueChanges.subscribe((res) => {
      console.log(res);
      if (res === "Monthly") {
        this.adviceForm.controls.investment_monthDate.setValidators(Validators.required);
      } else {
        this.adviceForm.controls.investment_monthDate.setValidators(null);
      }
      this.adviceForm.controls.investment_monthDate.updateValueAndValidity();
    });
  }

  submit() {
    console.log(this.adviceForm.valid);
    console.log(this.adviceForm);
    if (this.adviceForm.valid) {
      let req: any = {};
      req.investment_amount = this.adviceForm.controls.investment_amount.value || null;
      req.investmemnt_mode = this.adviceForm.controls.investmemnt_mode.value || null;
      req.investment_req_invtype =
        this.adviceForm.controls.investment_req_invtype.value === true
          ? ReqInvtype.TAX_SAVING
          : ReqInvtype.NO_TAX_SAVING || null;

      req.investment_monthDate = this.adviceForm.controls.investment_monthDate.value || null;
      let a = "";
      req.investment_amount.split(",").forEach((val) => {
        a = a + val;
      });
      req.investment_amount = a;
      req.comment = this.adviceForm.controls.comment.value || null
      console.log(a);
      console.log(req);
      this.loadingService.show();
      this.portfolioService.requestAdvice(req).subscribe((res) => {
        console.log({ res });
        this.loadingService.hide();
        if (res.statusCode === 0) {
          this.navCtrl.navigateRoot("tabs/tab2/portfolio-dashboard");
          this.toastrService.show({ message: res.data });
        } else {
          this.toastrService.show({ message: res.data, type: "error" });
        }
      });
    } else {
      console.log(this.adviceForm);
    }
  }

  cancel() {
    this.navCtrl.back();
  }
}
