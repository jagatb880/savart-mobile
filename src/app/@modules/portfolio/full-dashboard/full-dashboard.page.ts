import { Component, OnInit } from "@angular/core";
import { fullDasborad } from "@core/models/fulldashboard";
import { ModalController, NavController } from "@ionic/angular";
import { ViewPortfolioPage } from "@modules/portfolio/view-portfolio/view-portfolio.page";
import { Store } from "@ngxs/store";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";
import { CommonState } from "@store/state/common.state";

declare var $: any;
@Component({
  selector: "app-full-dashboard",
  templateUrl: "./full-dashboard.page.html",
  styleUrls: ["./full-dashboard.page.scss"],
})
export class FullDashboardPage implements OnInit {
  goalList: any[] = [];
  fullDashboardList: any[] = [];
  fullDashboardListHeader: any[] = [];
  currentPortfolio: any;
  constructor(
    private toastrService: ToastrService,
    private portfolioService: PortfolioService,
    private loadingService: LoadingService,
    private navCtrl: NavController,
    private store: Store,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getFullDashboardGoals();
    this.getCurrentPortfolio();
  }

  getFullDashboardGoals() {
    this.loadingService.show();
    this.portfolioService.fullDashboard().subscribe((res) => {
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.fullDashboardListHeader = (res.data && res.data[0] && res.data[0][0].columns) || [];
        this.fullDashboardList = (res.data && res.data[1] && res.data[1].rows) || [];
        this.goalList = (res.data && res.data[2] && res.data[2].cust_goals) || [];
        // this.goalList = fullDasborad.data[0]; // TODO - REMOVE IN PRODUCTION
        console.log(this.goalList);
      } else {
        this.toastrService.show({ message: res.data + "\n " + res.error, type: "error" });
      }
    });
  }

  viewPortfolio() {
    console.log("viewPortfolio", $("#viewPortfolio").offset().top);
    document.querySelector("#viewPortfolio").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }

  getCurrentPortfolio() {
    this.loadingService.show();
    this.portfolioService.currentPortfolio().subscribe((res) => {
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.currentPortfolio = (res.data && res.data[0]) || null;
      } else {
        this.toastrService.show({ message: res.data, type: "error" });
      }
    });
  }

  navigate(name) {
    if (!this.store.selectSnapshot(CommonState.getExpired)) {
      this.navCtrl.navigateForward(`${name}`);
    } else {
      this.toastrService.show({ message: "You should select or renewal of you plan from service page" });
    }
  }

  async viewPortfolioModal(item) {
    console.log(item);
    await this.navCtrl.navigateForward("/tabs/tab2/view-portfolio", { queryParams: item });

    // const modal = await this.modalController.create({
    //   component: ViewPortfolioPage,
    //   cssClass: "my-custom-class",
    //   componentProps: { item },
    // });
    // return await modal.present();
  }
}
