import { Component, OnDestroy, OnInit } from "@angular/core";
import { requestAdvice, customerStatus } from "@core/constants/constants";
import { ModalController, NavController, AlertController } from "@ionic/angular";
import { Select, Store } from "@ngxs/store";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";
import { CommonState } from "@store/state/common.state";
import { Observable } from "rxjs";
import { SubSink } from "subsink";
import { CommonService } from '@service/common.service';

@Component({
  selector: "app-portfolio-dashboard",
  templateUrl: "./portfolio-dashboard.page.html",
  styleUrls: ["./portfolio-dashboard.page.scss"],
})
export class PortfolioDashboardPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  isPendingList: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private portfolioService: PortfolioService,
    private navCtrl: NavController,
    private toastService: ToastrService,
    private store: Store,
    private modalController: ModalController,
    private commonService: CommonService,
    private alertCtrl: AlertController
  ) {}

  @Select(CommonState.getExpired) getExpired$: Observable<any>;

  ngOnInit() {
    try {
      this.modalController.dismiss();
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy() {}
  navigate(name) {
    this.navCtrl.navigateForward(`${name}`);
  }

  navigate1(name) {
    this.getCustomerStatus().then((data)=>{
      if (this.isPendingList.length <= 0 && !this.store.selectSnapshot(CommonState.getExpired)) {
        this.navCtrl.navigateForward(`${name}`);
      }else{
        this.showExpireAlert();
      }
    });
  }

  getCustomerStatus() : Promise < any[] > {
    let promise: Promise < any[] > = new Promise(async (resolve, reject) => {
      this.loadingService.show();
      this.subs.sink = this.commonService.getCustomerStatus().subscribe((res) => {
        console.log(res);
        this.loadingService.hide();
        if (res.statusCode === 0) {
          this.isPendingList = res.data.filter((res) => res.status == customerStatus.P);
        } else {
          this.isPendingList = [];
        }
        resolve(this.isPendingList)
      });
    })
    return promise;
  }
  
  checkRequsetAdivce(url) {
    //if (!this.store.selectSnapshot(CommonState.getExpired)) {
    this.getCustomerStatus().then((data)=>{
      if (this.isPendingList.length <= 0 && !this.store.selectSnapshot(CommonState.getExpired)) {
        this.navCtrl.navigateForward(`${name}`);
        this.loadingService.show();
        this.subs.sink = this.portfolioService.checkRequestAdvice().subscribe((res) => {
          this.loadingService.hide();
          if (res.statusCode === 0) {
            if (res.data.request_advice === requestAdvice.ALLOWED) {
              this.navigate1(url);
            } else {
              this.toastService.show({ message: "Not allowed", type: "error" });
            }
          }
        });
      }else{
        this.showExpireAlert();
      }
    });
  }

  async showExpireAlert(){
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      mode: 'ios',
      message: 'Your subscription is expired, please subscribe for raising the new investment request or review portfolio',
      buttons: ['Ok']
    });
    return await alert.present();
  }
}
