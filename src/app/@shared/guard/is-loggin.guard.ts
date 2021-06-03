import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IsLogginGuard implements CanActivate {
  constructor(private navCtrl: NavController) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isUserLoggedIn = JSON.parse(localStorage.getItem("isUserLoggedIn")) || false;
    console.log(localStorage.getItem("isUserLoggedIn"));
    console.log({ isUserLoggedIn });
    if (isUserLoggedIn) {
      this.navCtrl.navigateRoot("/tabs/tab2");
      return false;
    } else {
      return true;
    }
  }
}
