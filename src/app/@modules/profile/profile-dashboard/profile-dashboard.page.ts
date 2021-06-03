import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Select, Store } from "@ngxs/store";
import { CommonService } from "@service/common.service";
import { CommonState } from "@store/state/common.state";
import { Observable } from "rxjs";

@Component({
  selector: "app-profile-dashboard",
  templateUrl: "./profile-dashboard.page.html",
  styleUrls: ["./profile-dashboard.page.scss"],
})
export class ProfileDashboardPage implements OnInit {
  constructor(private navCtrl: NavController, private store: Store, private commonService: CommonService) {}
  @Select(CommonState.getExpired) getExpired$: Observable<any>;

  ngOnInit() {}

  navigate(name) {
    if (name === "/set-your-password") {
      this.commonService.isChangePassword = true;
    }
    this.navCtrl.navigateForward(`${name}`);
  }

  navigate1(name) {
    if (!this.store.selectSnapshot(CommonState.getExpired)) {
      this.navCtrl.navigateForward(`${name}`);
    }
  }
}
