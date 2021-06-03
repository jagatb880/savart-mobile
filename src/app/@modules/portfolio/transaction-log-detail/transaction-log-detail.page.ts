import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { SubSink } from "subsink";

@Component({
  selector: "app-transaction-log-detail",
  templateUrl: "./transaction-log-detail.page.html",
  styleUrls: ["./transaction-log-detail.page.scss"],
})
export class TransactionLogDetailPage implements OnInit, OnDestroy {
  item: any;
  private subs = new SubSink();
  constructor(private navCtrl: NavController, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe((res) => {
      if (res) {
        console.log({res});

        this.item = res || null;
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async showAdvice() {
    await this.navCtrl.navigateForward("/tabs/tab2/view-advice", {
      queryParams: { id: (this.item && this.item.invreq_id) || null },
    });
  }

  async uploadContract() {
    await this.navCtrl.navigateForward("/tabs/tab2/upload-contract");
  }
}
