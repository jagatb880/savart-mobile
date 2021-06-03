import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidatorUtils } from "@core/utils/validator";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { ToolsService } from "@service/tools.service";
import { ChartOptions, ChartDataSets, TimeScale } from "chart.js";

@Component({
  selector: "app-lumpsum",
  templateUrl: "./lumpsum.page.html",
  styleUrls: ["./lumpsum.page.scss"],
})
export class LumpsumPage implements OnInit {
  lumpsumForm: FormGroup;
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
          gridLines: { display: true, lineWidth: 0, zeroLineWidth: 1 },
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "#292828",
            fontSize: 7,
            fontFamily: "Roboto-Regular",
          },
          gridLines: { display: true, lineWidth: 0, zeroLineWidth: 1 },
        },
      ],
    },
  };
  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private toolsService: ToolsService,
    private fb: FormBuilder,
    private validator: ValidatorUtils
  ) {
    this.createlumpsumForm();
  }

  createlumpsumForm() {
    this.lumpsumForm = this.fb.group({
      investment: [null, Validators.compose([Validators.required, Validators.min(100)])],
      noOfYears: [null, Validators.required],
      expectedRate: [null, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.isActive = false;
  }

  calculateInvestment(value) {
    if (this.lumpsumForm.valid) {
      this.totalInvest = null;
      this.earnings = null;
      this.future = null;
      this.loadingService.show();
      let params = new HttpParams();
      params = params.append("investment", value.investment);
      params = params.append("expected_rate", value.expectedRate);
      params = params.append("no_years", value.noOfYears);
      params = params.append("investment_type", "L");
      let data = [];
      this.linelabels = [];
      this.toolsService.investmentCalculator(params).subscribe(
        (res) => {
          console.log({ res });
          this.loadingService.hide();
          if (res.statusCode === 0) {
            this.isActive = true;

            if (value.noOfYears <= 1) {
              res.data.monthWiseBreakup.forEach((val, ind) => {
                this.linelabels.push(`Month ${val.month}`);
                data.push(val.outcome);
              });
            } else {
              res.data.yearWiseBreakup.forEach((val, ind) => {
                this.linelabels.push(`Year ${val.year}`);
                data.push(val.outcome);
              });
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

            if (res.data && res.data.yearWiseBreakup) {
              let obj = res.data.yearWiseBreakup[res.data.yearWiseBreakup.length - 1] || null;
              this.earnings = obj.outcome - obj.investment || null;
              this.totalInvest = obj.investment || null;
              this.future = obj.outcome || null;
            }
            setTimeout(() => {
              let scroolll = document.getElementById("lumpsumGraph");
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
      this.validator.validateAllFormFields(this.lumpsumForm);
      this.toastrService.show({ message: " Please fill all the fields", type: "error" });
    }
  }
}
