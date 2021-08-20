import { Component, OnInit } from "@angular/core";
import { customerStatus } from "@core/constants/constants";
import { NavController, AlertController } from "@ionic/angular";
import { Select, Store } from "@ngxs/store";
import { CommonService } from "@service/common.service";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { CommonState } from "@store/state/common.state";
import { SubSink } from "subsink";
import { ProfileService } from '@service/profile.service';

@Component({
  selector: "app-investment-dashboard",
  templateUrl: "./investment-dashboard.page.html",
  styleUrls: ["./investment-dashboard.page.scss"],
})
export class InvestmentDashboardPage implements OnInit {
  private subs = new SubSink();
  isPendingList: any[] = [];
  statusList: any[] = []
  @Select(CommonState.getCusStatus) cusStatus$: any;
  @Select(CommonState.getExpired) getExpired$: any;
  selectedGoals: any[] = [];

  constructor(
    private navCtrl: NavController,
    private loadingService: LoadingService,
    private portfolioService: PortfolioService,
    private commonService: CommonService,
    private store: Store,
    private alertCtrl: AlertController,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    console.log("ngoninit investment dashbaord");
    this.subs.sink = this.cusStatus$.subscribe((res) => {
      if (res && res.length > 0) {
        this.isPendingList = res.filter((res) => res.status == customerStatus.P);
      } else {
        this.isPendingList = [];
      }
    });
  }

  ionViewWillEnter() {
    this.getCustomerStatus();
    this.getSelectedGoals();
    setTimeout(() => {
      this.checkverification();
    }, 4000);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  checkverification(){  
    this.profileService.checkVerificationDocument().subscribe((res) => {
      // alert(res.data);
      if(res.data == true){
        this.navCtrl.navigateRoot("/tabs/tab2");
      }else if(res.data == false){
        this.aler()
        
      }
    });
    }

    async aler(){
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Warning',
        message: 'Please complete your KYC to continue',
        buttons: [
          {
            text: "Ok",
            handler: () => {
              console.log("Confirm Okay");
              this.navCtrl.navigateRoot("tabs/tab1/personal-profile");
            },
          },
        ],
      });
      // this.navCtrl.navigateRoot("tabs/tab1/personal-profile");
      await alert.present();
    
      const { role } = await alert.onDidDismiss();
      
      
      console.log('onDidDismiss resolved with role', role);
    }

  getCustomerStatus() : Promise < any[] > {
    let promise: Promise < any[] > = new Promise(async (resolve, reject) => {
      this.loadingService.show();
      this.subs.sink = this.commonService.getCustomerStatus().subscribe((res) => {
        console.log(res);
        this.statusList = res.data;
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

  navigate(name) {
    this.getCustomerStatus().then((data)=>{
      if (this.isPendingList.length <= 0 && !this.store.selectSnapshot(CommonState.getExpired)) {
        if (name === "/tabs/tab2/request-advice") {
          this.loadingService.show();
          this.portfolioService.getSelectedGoals().subscribe((res) => {
            this.loadingService.hide();
            if (res.statusCode === 0) {
              this.selectedGoals = res.data || [];
              if (this.selectedGoals.length > 0) {
                this.navCtrl.navigateForward(`${name}`);
              } else {
                this.navCtrl.navigateForward(`/tabs/tab2/select-goal`);
              }
            } else {
              this.selectedGoals = [];
              if (this.selectedGoals.length > 0) {
                this.navCtrl.navigateForward(`${name}`);
              } else {
                this.navCtrl.navigateForward(`/tabs/tab2/select-goal`);
              }
            }
          });
        } 
        else {
          this.navCtrl.navigateForward(`${name}`);
        }
      }else{
        if(this.isPendingList.length >= 3){
          this.showExpireAlert("Please complete all your profile items to raise an investment request");
        }else if(this.isPendingList.length == 2){
          if(this.statusList[0].status == customerStatus.P && this.statusList[1].status == customerStatus.P){
            this.showExpireAlert("Please complete your personal profile and investment profile to raise an investment request");
          }else if(this.statusList[0].status == customerStatus.P && this.statusList[2].status == customerStatus.P){
            this.showExpireAlert("Please complete your personal profile and demat to raise an investment request");
          }else if(this.statusList[0].status == customerStatus.P && this.statusList[3].status == customerStatus.P){
            this.showExpireAlert("Please complete your personal profile and subscription to raise an investment request");
          }else if(this.statusList[1].status == customerStatus.P && this.statusList[2].status == customerStatus.P){
            this.showExpireAlert("Please complete your investment profile and demat to raise an investment request");
          }else if(this.statusList[1].status == customerStatus.P && this.statusList[3].status == customerStatus.P){
            this.showExpireAlert("Please complete your investment profile and subscription to raise an investment request");
          }else if(this.statusList[2].status == customerStatus.P && this.statusList[3].status == customerStatus.P){
            this.showExpireAlert("Please complete your demat and subscription to raise an investment request");
          }
        }else{
          switch (customerStatus.P) {
            case this.statusList[0].status:
              this.showExpireAlert("Please complete your personal profile to raise an investment request");
              break;
            case this.statusList[1].status:
              this.showExpireAlert("Please complete your investment profile to raise an investment request");
              break;
            case this.statusList[2].status:
              this.showExpireAlert("Please complete your demat to raise an investment request");
              break;
            case this.statusList[3].status:
              this.subs.sink = this.profileService.get_subscription().subscribe((res) => {
                if(res && res.data == null){
                  this.showExpireAlert("Please complete your subscription to raise an investment request");
                }else{
                  this.showExpireAlert("Your subscription is expired. Please renew it before starting the investment");
                }
              });
              break;
          }
        }
      }
    })
  }
  navigatePending() {
    this.commonService.redirectBasedOnCusStatus(this.isPendingList && this.isPendingList[0]);
  }

  getSelectedGoals() {
    this.loadingService.show();
    this.portfolioService.getSelectedGoals().subscribe((res) => {
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.selectedGoals = res.data || [];
      } else {
        this.selectedGoals = [];
      }
    });
  }

  async showExpireAlert(msg){
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      cssClass: 'my-custom-class',
      mode: 'ios',
      backdropDismiss: false,
      message: msg,
      buttons: ['Ok']
    });
    return await alert.present();
  }
}
