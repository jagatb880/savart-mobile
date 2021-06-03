import { Component, OnInit } from "@angular/core";
import { Transaction } from "@core/models/transaction";
import { NavController } from "@ionic/angular";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";

@Component({
  selector: "app-transaction-log",
  templateUrl: "./transaction-log.page.html",
  styleUrls: ["./transaction-log.page.scss"],
})
export class TransactionLogPage implements OnInit {
  radioValue = "All";
  transactionList: any[] = [];
  transactionUIList: any[] = [];
  constructor(
    private portfolioService: PortfolioService,
    private loadingService: LoadingService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.transactionList = [];
    this.transactionUIList = [];
    this.getTransactionLog();
  }

  getTransactionLog() {
    this.loadingService.show();
    this.transactionList = [];
    this.transactionUIList = [];
    this.portfolioService.getTransactionLog().subscribe((res) => {
      this.loadingService.hide();
      console.log({ res });
      if (res.statusCode === 0) {
        // this.transactionList = Transaction.data;
        this.transactionUIList[0] = (res.data && res.data[0].investments_related) || [];
        this.transactionUIList[1] = (res.data && res.data[0].services_related) || [];
        this.transactionUIList.forEach((value) => {
          let values: any[] = value;
          values.forEach((val) => {
            this.transactionList.push(val);
          });
        });
      }
    });
  }

  goToTransactionDetail(item) {
    console.log({ item });
    this.navCtrl.navigateForward("/tabs/tab2/transaction-log-detail", { queryParams: item });
  }
}
