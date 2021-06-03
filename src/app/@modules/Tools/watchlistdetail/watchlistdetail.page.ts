import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-watchlistdetail",
  templateUrl: "./watchlistdetail.page.html",
  styleUrls: ["./watchlistdetail.page.scss"],
})
export class WatchlistdetailPage implements OnInit {
  screener: any;
  constructor(private navCtrl: NavController, private activateRoute: ActivatedRoute) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.activateRoute.queryParams.subscribe((res) => {
      console.log({ res });
      if (res) {
        this.screener = res;
      } else {
        this.navCtrl.back();
      }
    });
  }
}
