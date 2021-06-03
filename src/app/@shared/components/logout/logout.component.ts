import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { AuthService } from "@service/auth.service";
import { Logout } from "@store/actions/auth.actions";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"],
})
export class LogoutComponent implements OnInit {
  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit() {}

  async logout() {
    await this.authService.presentLogoutAlertConfirm();
  }
}
