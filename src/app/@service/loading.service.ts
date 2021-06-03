import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  constructor(public loadingController: LoadingController) {}
  loading: any = this.loadingController.create({
    cssClass: "my-loader",
    message: "Please wait...",
    mode: "ios",
    duration: 4000,
  });
  async show() {
    this.loading = await this.loadingController.create({
      cssClass: "my-loader",
      message: "Please wait...",
      mode: "ios",
      duration: 4000,
    });
    (await this.loading).present();
  }
  async hide() {
    if (this.loading) {
      (await this.loading).dismiss();
    }
  }
}
