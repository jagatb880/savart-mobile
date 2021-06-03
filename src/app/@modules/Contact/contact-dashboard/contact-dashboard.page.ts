import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { NavController } from "@ionic/angular";

const { SplashScreen, Browser } = Plugins;
@Component({
  selector: "app-contact-dashboard",
  templateUrl: "./contact-dashboard.page.html",
  styleUrls: ["./contact-dashboard.page.scss"],
})
export class ContactDashboardPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  navigate(name) {
    this.navCtrl.navigateForward(name);
  }

  async chatInapp() {
    await Browser.open({ url: "https://tawk.to/chat/5f7306034704467e89f32883/default", windowName: "_system" });
  }

  dialPad() {
    let a = document.createElement("a");
    a.href = "tel:+919966693655";
    a.click();
  }
}
