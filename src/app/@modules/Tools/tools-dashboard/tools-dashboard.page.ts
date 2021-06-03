import { Component, NgZone, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-tools-dashboard",
  templateUrl: "./tools-dashboard.page.html",
  styleUrls: ["./tools-dashboard.page.scss"],
})
export class ToolsDashboardPage implements OnInit {
  constructor(private navCtrl: NavController, private ngzone: NgZone) {}

  ngOnInit() {}
  navigate(name) {
    this.ngzone.run(() => {
      this.navCtrl.navigateForward(name);
    });
  }
}
