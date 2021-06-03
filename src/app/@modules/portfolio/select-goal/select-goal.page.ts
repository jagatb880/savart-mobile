import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { CommonService } from "@service/common.service";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";

@Component({
  selector: "app-select-goal",
  templateUrl: "./select-goal.page.html",
  styleUrls: ["./select-goal.page.scss"],
})
export class SelectGoalPage implements OnInit {
  goalList: any[] = [];
  selectedGoals: any[] = [];
  selectGoalLength = 3;
  constructor(
    private loadingService: LoadingService,
    private navCtrl: NavController,
    private portfolioService: PortfolioService,
    private toastrService: ToastrService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.getSelectedGoals();
  }

  ionViewWillEnter() {
    this.getSelecteGoalLength();
  }

  getSelecteGoalLength() {
    this.commonService.getlookupDetails({ lookupname: "max_goals_limit" }).subscribe((res) => {
      if (res.statusCode === 0) {
        let a = res.data.filter((val) => val.lookupname === "max_goals_limit") || [];
        console.log({ a });
        if (a && a[0]) {
          this.selectGoalLength = a[0].displayval || 3;
        }
      }
    });
  }

  getSelectGoals() {
    this.loadingService.show();
    this.portfolioService.getSelectGoals().subscribe((res) => {
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.goalList = res.data || [];
        console.log(this.selectedGoals);
        this.selectedGoals.forEach((value) => {
          this.goalList.map((val) => {
            if (val.goalid === value.goalid) {
              val.isSelected = true;
              Object.keys(value).forEach((keys) => {
                val[keys] = value[keys];
              });
            } else {
              if (!val.isSelected) {
                val.isSelected = false;
              }
            }
            console.log(val);
            return val;
          });
          console.log(this.goalList);
        });
        console.log(this.goalList);
      } else {
        this.goalList = [];
      }
    });
  }

  getSelectedGoals() {
    this.loadingService.show();
    this.portfolioService.getSelectedGoals().subscribe((res) => {
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.selectedGoals = res.data || [];
        this.getSelectGoals();
      } else {
        this.selectedGoals = [];
      }
    });
  }

  navigate(item) {
    console.log({ item });
    if (this.selectedGoals.length < 3) {
      this.navCtrl.navigateForward("/tabs/tab2/set-a-goal", { queryParams: item });
    } else if (
      this.selectedGoals.length >= 3 &&
      this.selectedGoals.filter((val) => val.goalid === item.goalid).length > 0
    ) {
      this.navCtrl.navigateForward("/tabs/tab2/set-a-goal", { queryParams: item });
    } else {
      this.toastrService.show({ message: `You can't select more than ${this.selectGoalLength} Goals`, type: "error" });
    }
  }
}
