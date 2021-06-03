import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { ToolsService } from "@service/tools.service";
import { AuthState } from "@store/state/auth.state";
import { environment } from "environments/environment";
import { ServiceURL } from "@service/urls/service.url";

@Component({
  selector: "app-watchlist",
  templateUrl: "./watchlist.page.html",
  styleUrls: ["./watchlist.page.scss"],
})
export class WatchlistPage implements OnInit {
  watchList: any[] = [];

  constructor(
    private loadingService: LoadingService,
    private toastService: ToastrService,
    private toolsService: ToolsService,
    private navCtrl: NavController,
    private store: Store
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getWatchList();
  }

  getWatchList() {
    this.loadingService.show();
    this.toolsService.getWatchList().subscribe(
      (res) => {
        this.loadingService.hide();
        if (res.statusCode === 0) {
          this.watchList = res.data || [];
        } else {
          this.toastService.show({ message: res.data, type: "error" });
        }
      },
      (error) => {
        this.loadingService.hide();
      }
    );
  }

  goTowatch(item) {
    console.log({ item });
    this.navCtrl.navigateForward("/tabs/tab5/watchlistdetail", { queryParams: item });
  }
  removeWatchlist(item) {
    if (item && item.id) {
      this.loadingService.show();
      let req = {
        data: [{ watchlist_id: item && item.id }],
      };
      this.toolsService.removeWatchlist(req).subscribe(
        (res) => {
          if (res.statusCode === 0) {
            this.toastService.show({ message: res.data });
            this.loadingService.hide();
            this.getWatchList();
          } else {
            this.loadingService.hide();
            this.toastService.show({ message: res.data, type: "error" });
          }
        },
        (error) => {
          this.loadingService.hide();
        }
      );
    }
    // this.navCtrl.navigateForward("/tabs/tab5/watchlistdetail", { queryParams: item });
  }
}
