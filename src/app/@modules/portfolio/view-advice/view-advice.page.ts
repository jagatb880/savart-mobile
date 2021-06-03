import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";
import { SubSink } from "subsink";
import { CommonService } from '@service/common.service';

@Component({
  selector: "app-view-advice",
  templateUrl: "./view-advice.page.html",
  styleUrls: ["./view-advice.page.scss"],
})
export class ViewAdvicePage implements OnInit, OnDestroy {
  viewAdviceList: any[] = [];
  private subs = new SubSink();
  constructor(
    private loadingService: LoadingService,
    private navCtrl: NavController,
    private portfolioService: PortfolioService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private commonService: CommonService
  ) {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      if (res && res.id) {
        this.getAdvices(res.id);
      } else {
        this.toastService.show({ message: "Not allowed to this Page", type: "error" });
        this.navCtrl.back();
      }
    });
  }

  getAdvices(id) {
    this.loadingService.show();
    this.subs.sink = this.portfolioService.viewAdvice(id).subscribe(
      (res) => {
        console.log({ res });
        this.loadingService.hide();
        if (res.statusCode === 0) {
          this.viewAdviceList = res.data || [];
        } else {
          this.toastService.show({ message: res.data, type: "error" });
        }
      },
      (err) => {
        this.toastService.show({ message: "something went wrong", type: "error" });
      }
    );
  }

  async contract() {
    let url = "https://savart.in/media/Contract%20note%20content-converted.pdf"
    if(this.commonService.androidPermission == null){
      this.commonService.getAndroidPermission();
    }else if(this.commonService.androidPermission){
      this.commonService.downloadPdfAndOpen(url);
    }else {
      this.commonService.getAndroidPermission();
    }
  }

  async openReaserchNote(note) {
    console.log({ note });
    if(note != ""){
      if(this.commonService.androidPermission == null){
        this.commonService.getAndroidPermission();
      }else if(this.commonService.androidPermission){
        this.commonService.downloadPdfAndOpen(note);
      }else {
        this.commonService.getAndroidPermission();
      }
    }else{
      this.toastService.show({ message: "No pdf found, please contact to admin", type: "error" });
    }
  }

  async showAdvice() {
    await this.navCtrl.navigateRoot("/tabs/tab2/transaction-log");
  }

  async uploadContract() {
    await this.navCtrl.navigateForward("/tabs/tab2/upload-contract");
  }
}
