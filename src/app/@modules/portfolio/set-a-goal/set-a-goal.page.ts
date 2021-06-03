import { AfterViewChecked, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";
import { rejects } from "assert";
import { SubSink } from "subsink";

declare var $: any;
@Component({
  selector: "app-set-a-goal",
  templateUrl: "./set-a-goal.page.html",
  styleUrls: ["./set-a-goal.page.scss"],
})
export class SetAGoalPage implements OnInit, OnDestroy {
  goalForm: FormGroup;
  private subs = new SubSink();

  sliderValue = 3;

  constructor(
    private alertController: AlertController,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private portfolioService: PortfolioService,
    private loadingService: LoadingService,
    private ngZone: NgZone
  ) {
    this.createGoalForm();
  }
  createGoalForm() {
    this.goalForm = this.fb.group({
      goalid: [null],
      goaltargetamount: [null, Validators.required],
      goaltimeline: [3, Validators.required],
      goalicon1: null,
      goalicon2: null,
      goalname: null,
      isSelected: false,
    });
  }

  ngOnInit() {
    new Promise((resolve) => {
      this.subs.sink = this.activatedRoute.queryParams.subscribe((res) => {
        console.log({ res });
        if (res) {
          this.goalForm.patchValue({
            goalid: res.goalid || null,
            goaltargetamount: res.goaltargetamount || null,
            goaltimeline: (res.goaltimeline && res.goaltimeline.split(" ")[0]) || 3,
            goalicon1: res.goalicon1 || null,
            goalicon2: res.goalicon2 || null,
            goalname: res.goalname || null,
            isSelected: res.isSelected || false,
          });

          if (res.goaltimeline === "25 Years & beyond") {
            console.log({ res });
            this.goalForm.patchValue({
              goaltimeline: 26,
            });
          }
          console.log(res.goaltimeline);
          $("#slider").roundSlider({
            radius: 80,
            // circleShape: "half-top",
            circleShape: "pie",
            sliderType: "min-range",
            mouseScrollAction: true,
            value: res.goaltimeline === "25 Years & beyond" ? 26 : res.goaltimeline || 3,
            handleSize: "+5",
            min: 3,
            max: 26,
            startAngle: 315,
            editableTooltip: false,
            tooltipFormat: (e) => {
              return this.changeTooltip(e);
            },
          });
          resolve({});
        } else {
          this.navCtrl.pop();
        }
      });
      resolve({});
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  changeTooltip(e) {
    var val = null;
    console.log(e.value);
    val = e.value + " Years";
    if (this.goalForm) {
      this.goalForm.patchValue({
        goaltimeline: e.value || 3,
      });
    }

    if (e.value === 26) {
      val = 25 + " Years<div>& beyond</div>";
      if (this.goalForm) {
        this.goalForm.patchValue({
          goaltimeline: 25 + " Years & beyond" || 3,
        });
      }
    }
    return val;
  }

  deleteGoal() {
    console.log("delete goal clicked");
    this.loadingService.show();
    let request = {
      data: {
        delete_goalid: this.goalForm.controls.goalid.value,
      },
    };

    this.portfolioService
      .deleteGoal({
        data: {
          delete_goalid: this.goalForm.controls.goalid.value,
        },
      })
      .subscribe(
        (res) => {
          console.log({ res });
          this.loadingService.hide();
          if (res.statusCode === 0) {
            this.toastrService.show({ message: "Deleted successfully" });
            this.navCtrl.navigateRoot("/tabs/tab2");
          } else {
            this.toastrService.show({ message: res.data, type: "error" });
          }
        },
        (err) => {
          if (err.status === 200) {
            this.toastrService.show({ message: "Deleted successfully" });
          } else {
            this.toastrService.show({
              message: err.status + " \n something went wrong pls contact your admin",
              type: "error",
            });
          }
        }
      );
  }

  cancel() {
    this.goalForm.reset();
    this.navCtrl.pop();
  }

  submit() {
    console.log(this.goalForm.value);
    if (this.goalForm.valid) {
      let request: any = {};
      request.goalid = this.goalForm.controls.goalid.value || null;
      request.goaltimeline = this.goalForm.controls.goaltimeline.value || null;
      request.goaltargetamount = this.goalForm.controls.goaltargetamount.value || null;
      let a = "";
      request.goaltargetamount.split(",").forEach((val) => {
        a = a + val;
      });
      request.goaltargetamount = a;

      this.loadingService.show();
      if (this.goalForm.controls.isSelected.value) {
        this.portfolioService.editGoals({ data: [request] }).subscribe((res) => {
          this.loadingService.hide();
          console.log({ res });
          if (res.statusCode === 0) {
            this.toastrService.show({ message: "Goal updated successfully" });
            this.navCtrl.navigateRoot("/tabs/tab2/transaction-log");
          } else {
            this.toastrService.show({ message: res.data, type: "error" });
          }
        });
      } else {
        this.portfolioService.selectGoals({ data: [request] }).subscribe((res) => {
          this.loadingService.hide();
          console.log({ res });
          if (res.statusCode === 0) {
            this.toastrService.show({ message: "Goal selected successfully" });
            this.navCtrl.navigateRoot("/tabs/tab2/transaction-log");
          } else {
            this.toastrService.show({ message: res.data, type: "error" });
          }
        });
      }
    } else {
      this.toastrService.show({ message: "Please enter goal target amount", type: "error" });
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Confirm!",
      mode: "ios",
      message: "Are you sure to delete this Goal!!!",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Confirm Okay");
            this.deleteGoal();
          },
        },
      ],
    });

    await alert.present();
  }
}
