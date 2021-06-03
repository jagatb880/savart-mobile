import { Component, Inject, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { LoadingService } from "@service/loading.service";
import { Plugins } from "@capacitor/core";
import { DOCUMENT } from "@angular/common";
const { SplashScreen, Browser } = Plugins;

@Component({
  selector: "app-chatwithus",
  templateUrl: "./chatwithus.page.html",
  styleUrls: ["./chatwithus.page.scss"],
})
export class ChatwithusPage implements OnInit {
  s1 = this.document.createElement("script");
  s0 = this.document.getElementsByTagName("script")[0];
  constructor(private loaderService: LoadingService, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    // this.chatwithus();
    this.chatInapp();
    await this.loaderService.show();
    await setTimeout(() => {
      this.loaderService.hide();
    }, 2000);
  }

  async chatInapp() {
    await Browser.open({ url: "https://tawk.to/chat/5f7306034704467e89f32883/default", windowName: "_system" });
  }

  async chatwithus() {
    try {
      this.s1 = this.document.createElement("script");
      this.s0 = this.document.getElementsByTagName("script")[0];
      await this.loaderService.show();
      console.log("ionviewwillenter");
      this.s1.async = await true;
      this.s1.src = await "https://embed.tawk.to/5f7306034704467e89f32883/default";
      this.s1.charset = await "UTF-8";
      await this.s1.setAttribute("crossorigin", "*");
      await this.s0.parentNode.insertBefore(this.s1, this.s0);
      await setTimeout(() => {
        this.loaderService.hide();
      }, 2000);
    } catch (err) {
      console.log(err);
      // alert(err);
    }
  }

  ionViewDidLeave() {
    console.log("didleave");
  }
  async ionViewWillLeave() {
    console.log("Willleave");
    // await this.loaderService.show();
    // await window.location.reload();
    // await SplashScreen.show();

    // window.onload = (event) => {
    //   console.log("page is fully loaded");
    //   SplashScreen.hide();
    // };

    // console.log(this.s1);
    // this.s1.parentNode.removeChild(this.s1);
    // console.log(this.s1);
    // var box = document.getElementById("tawkchat-minified-box");
    // if (box) {
    //   box.style.display = "none";
    // }
  }
}
