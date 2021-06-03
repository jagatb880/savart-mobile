import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ToastrService } from "@service/toastr.service";
import { SubSink } from "subsink";
import { CommonService } from '@service/common.service';

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"],
})
export class MessagePage implements OnInit, OnDestroy {
  messages: any;
  private subs = new SubSink();
  constructor(
    private navCtrl: NavController,
    private toastService: ToastrService,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    Window["myComponent"] = this;
  }

  ngOnInit() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe((res) => {
      console.log({ res });
      if (res) {
        this.messages = res || null;
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  navigate() {
    console.log(this.messages);
    let redirectUrl;
    let actionLink: string = (this.messages && this.messages.actionlink) || null;
    this.ngZone.run(() => {
      if(this.messages.subject.split(" ")[0].trim() == 'Investment'){
        redirectUrl = '/tabs/tab2/view-advice'
        let invreq_id = actionLink.split("adviced");
        console.log(invreq_id);
        if (invreq_id.length > 1) {
          this.navCtrl.navigateForward(redirectUrl, { queryParams: { id: invreq_id[1] } });
        } else {
          this.toastService.show({ message: "Not allowed to this page !..", type: "error" });
        }
      }else{
        redirectUrl = '/tabs/tab3/portfolio-advice'
        this.navCtrl.navigateForward(redirectUrl, { queryParams: { url: this.messages.actionlink } });
      }
    });
  }

  navigateNewInvestigate(){
    this.navCtrl.navigateForward(['/tabs/tab1/profile-service']);
  }

  openLinkInPdf(){
    if(this.messages.url != ""){
      if(this.commonService.androidPermission == null){
        this.commonService.getAndroidPermission();
      }else if(this.commonService.androidPermission){
        this.commonService.downloadPdfAndOpen(this.messages.url);
      }else {
        this.commonService.getAndroidPermission();
      }
    }else{
      this.toastService.show({ message: "No pdf found, please contact to admin", type: "error" });
    }
  }
}
