import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import * as moment from "moment-timezone";
import { Moment } from "moment";

@Component({
  selector: "app-welcome-login",
  templateUrl: "./welcome-login.page.html",
  styleUrls: ["./welcome-login.page.scss"],
})
export class WelcomeLoginPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {}

  login() {
    this.navCtrl.navigateRoot("/login");
  }
}
