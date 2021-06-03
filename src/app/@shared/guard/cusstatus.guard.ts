import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { CommonService } from "@service/common.service";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { Logout } from "@store/actions/auth.actions";
import { SetCommonState, UpdateCusStatus } from "@store/actions/common.action";
import { CommonState } from "@store/state/common.state";
import { Observable } from "rxjs";
import { SubSink } from 'subsink';
import { customerStatus } from "@core/constants/constants";

@Injectable({
  providedIn: "root",
})
export class CusstatusGuard implements CanActivate {
  private subs = new SubSink();
  isPendingList: any[] = [];
  constructor(
    private navCtrl: NavController,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private store: Store
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any> {
    console.log("CusstatusGuard");
    return new Promise((resolve) => {
      this.loadingService.show();
      this.store.dispatch(new UpdateCusStatus());
      this.commonService.checkDashbaord().subscribe(
        (checkRes) => {
          this.loadingService.hide();
          resolve();
          if (checkRes.statusCode === 0) {
            this.store.dispatch(new SetCommonState({ Dashboard_view: checkRes.data.Dashboard_view }));
          }
        },
        (err) => {
          resolve();
          this.loadingService.hide();
        }
      );
    }).then(() => {
      this.loadingService.hide();
      if (this.store.selectSnapshot(CommonState.getDashview) === "empty_dashboard") {
        this.navCtrl.navigateRoot("/tabs/tab2/investment-dashboard");
        return false;
      } else {
        return true;
      }
    });
  }
}
