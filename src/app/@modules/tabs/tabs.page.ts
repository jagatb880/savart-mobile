import { AfterViewChecked, Component } from "@angular/core";
import { MessageStatus } from "@core/constants/constants";
import { NavController } from "@ionic/angular";
import { Select, Store } from "@ngxs/store";
import { InboxService } from "@service/inbox.service";
import { SetNotificationCount, SetPlanExpired } from "@store/actions/common.action";
import { CommonState } from "@store/state/common.state";
import { Observable } from "rxjs";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  @Select(CommonState.getExpired) getExpired$: Observable<any>;
  @Select(CommonState.getNotificationCount) count$: Observable<any>;

  count: any = "";
  constructor(private navCtrl: NavController, private inboxService: InboxService, private store: Store) {}

  async navigate(name) {
    await this.ionViewWillEnter();
    console.log("d", { name });
    await this.navCtrl.navigateRoot(`/tabs/${name}`);
  }

  async ionViewWillEnter() {
    await this.store.dispatch(new SetPlanExpired());
    await this.inboxService.getNotifications().subscribe(async (res) => {
      console.log(res);
      let value = (await res.data.filter((val) => val.status == MessageStatus.NEW)) || [];
      console.log(value.length, value);
      await this.store.dispatch(new SetNotificationCount(value.length || ""));
    });
  }

  tabClicked(event) {
    this.ionViewWillEnter();
    console.log({ event });
  }
}
