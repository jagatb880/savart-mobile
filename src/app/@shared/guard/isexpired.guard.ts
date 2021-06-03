import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { NavController, ToastController } from "@ionic/angular";
import { ToastrService } from "@service/toastr.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IsexpiredGuard implements CanActivate {
  constructor(private navCtrl: NavController, private toastrService: ToastrService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loggedInDate = JSON.parse(localStorage.getItem("loggedInDate"));
    let loggedInDatetimes = new Date(loggedInDate).getTime() + 1 * 24 * 60 * 60 * 1000;
    let OneDay = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    console.log({ loggedInDate });
    console.log(loggedInDate && OneDay > loggedInDatetimes);
    console.log(OneDay);
    console.log(loggedInDatetimes);
    if (loggedInDate && OneDay > loggedInDatetimes) {
      return true;
    } else {
      this.toastrService.show({ message: "your session is expired , Please login again" });
      this.navCtrl.navigateRoot("/login");
      return false;
    }
  }
}
