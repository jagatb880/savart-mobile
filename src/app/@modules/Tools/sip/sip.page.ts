import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidatorUtils } from "@core/utils/validator";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { ToolsService } from "@service/tools.service";
import { ChartOptions } from "chart.js";

@Component({
  selector: "app-sip",
  templateUrl: "./sip.page.html",
  styleUrls: ["./sip.page.scss"],
})
export class SipPage implements OnInit {
  sipForm: FormGroup;
  datasets: any[] = [];

  totalInvest = null;
  earnings = null;
  future = null;
  isActive = false;
  lineChartType = "line";
  linelabels: any[] = [0, 2];
  lineChartOptions: ChartOptions = {
    legend: {
      display: false,
      position: "bottom",
      labels: {
        usePointStyle: true,
        fontColor: "black",
      },
    },
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "#292828",
            fontSize: 7,
            fontFamily: "Roboto-Regular",
          },
          gridLines: {
            display: true,
            lineWidth: 0,
            zeroLineWidth: 1,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontSize: 7,
            fontColor: "#A2A2A2",
            fontFamily: "Roboto-Regular",
          },
          gridLines: {
            display: true,

            lineWidth: 0,
            zeroLineWidth: 1,
          },
        },
      ],
    },
  };
  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private toolsService: ToolsService,
    private fb: FormBuilder,
    private validator: ValidatorUtils,
    private ngzone: NgZone
  ) {
    this.createSipForm();
  }

  createSipForm() {
    this.sipForm = this.fb.group({
      investment: [null, Validators.compose([Validators.required, Validators.min(100)])],
      noOfYears: [null, Validators.required],
      selectSIP: null,
      expectedRate: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
    });
  }

  ngOnInit() {}

  calculateInvestment(value) {
    if (this.sipForm.valid) {
      this.totalInvest = null;
      this.earnings = null;
      this.future = null;
      this.loadingService.show();
      let params = new HttpParams();
      params = params.append("investment", value.investment);
      params = params.append("expected_rate", value.expectedRate);
      params = params.append("no_years", value.noOfYears);
      params = params.append("investment_type", "S");
      let data = [];
      this.linelabels = [];
      this.toolsService.investmentCalculator(params).subscribe(
        (res) => {
          console.log({ res });
          this.loadingService.hide();
          this.isActive = true;
          if (res.statusCode === 0) {
            if (value.noOfYears <= 1) {
              if (value.selectSIP === "Monthly") {
                res.data.monthWiseBreakup.forEach((val, ind) => {
                  this.linelabels.push(`Month ${val.month}`);
                  data.push(val.outcome);
                });
              } else if (value.selectSIP === "Quarterly") {
                let Quarterly = 0;
                let QuarterlyValue = 0;
                res.data.monthWiseBreakup.forEach((val, ind) => {
                  console.log((ind + 1) / 3 === 0);
                  console.log((ind + 1) % 3 === 0);
                  QuarterlyValue = QuarterlyValue + parseFloat(val.outcome);
                  if ((ind + 1) % 3 === 0) {
                    Quarterly = Quarterly + 1;
                    this.linelabels.push(`Quarterly ${Quarterly}`);
                    data.push(QuarterlyValue);
                    QuarterlyValue = 0;
                  }
                });
              } else {
                let Halfyearly = 0;
                let HalfyearlyValue = 0;
                res.data.monthWiseBreakup.forEach((val, ind) => {
                  console.log((ind + 1) / 6 === 0);
                  console.log((ind + 1) % 6 === 0);
                  HalfyearlyValue = HalfyearlyValue + parseFloat(val.outcome);
                  if ((ind + 1) % 6 === 0) {
                    Halfyearly = Halfyearly + 1;
                    this.linelabels.push(`Halfyearly ${Halfyearly}`);
                    data.push(HalfyearlyValue);
                    HalfyearlyValue = 0;
                  }
                });
              }
            } else {
              res.data.yearWiseBreakup.forEach((val, ind) => {
                this.linelabels.push(`Year ${val.year}`);
                data.push(val.outcome);
              });
            }

            if (res.data && res.data.yearWiseBreakup) {
              let obj = res.data.yearWiseBreakup[res.data.yearWiseBreakup.length - 1] || null;
              this.earnings = obj.outcome - obj.investment || null;
              this.totalInvest = obj.investment || null;
              this.future = obj.outcome || null;
            }
            this.datasets = [
              {
                data: data || [],
                label: "Target",
                lineTension: 1,
                type: "line",
                pointRadius: 3,
                pointBorderColor: "#7B9AFE",
                pointBackgroundColor: "#7B9AFE",
                borderColor: "#7B9AFE",
                // borderWidth: 2,
                backgroundColor: "transparent",
              },
            ];
            setTimeout(() => {
              let scroolll = document.getElementById("sipGraph");
              if (scroolll) {
                scroolll.scrollIntoView({ behavior: "smooth", block: "end" });
              }
            }, 100);
          } else {
            this.toastrService.show({ message: res.data || res.message, type: "error" });
          }
        },
        (err) => {
          this.loadingService.hide();
        }
      );
    } else {
      this.validator.validateAllFormFields(this.sipForm);
      this.toastrService.show({ message: " Please fill all the fields", type: "error" });
    }
  }
}
