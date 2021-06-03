import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { HttpService } from "@service/http.service";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";
import { SubSink } from "subsink";

declare var $: any;
@Component({
  selector: "app-upload-portfolio",
  templateUrl: "./upload-portfolio.page.html",
  styleUrls: ["./upload-portfolio.page.scss"],
})
export class UploadPortfolioPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  fileList: any[] = [];

  filePassword: any;
  latestFile: any;
  tracking = false;
  portfolioStatus: boolean;
  constructor(
    private loadingService: LoadingService,
    private portfolioService: PortfolioService,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  ionViewWillEnter() {
    this.portfolioStatus = false;
    this.getPortfolioStatus();
    this.getUploadportfolioDocuments();
  }

  browse() {
    $("#upload-porfolio").click();
  }

  cleanInputs(fileEle) {
    fileEle.value = "";
    $(fileEle).val("");
    var parEle = $(fileEle).parent();
    var newEle = $(fileEle).clone();
    $(fileEle).remove();
    $(parEle).prepend(newEle);
  }

  handleChange(event, password = "") {
    console.log({ event });
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size / 1024 <= 1025) {
        let formData = new FormData();
        this.latestFile = event || null;
        formData.append(`Portfolio`, event.target.files[0] as any);
        formData.append(`Portfolio_pdf_password`, password);
        formData.append(`source`, 'mobile');
        // formData.append(`file`, event.target.files[0] as any);
        // Portfolio_pdf_password
        console.log({ formData });
        this.loadingService.show();
        this.subs.sink = this.httpService.portfoliouploadDocuments(formData).subscribe(
          (res) => {
            this.loadingService.hide();
            console.log({ res });
            // alert(JSON.stringify(res, null, 2));
            if (res.statusCode === 0) {
              this.checkFileStatus(res);
            }
          },
          (err) => {
            this.loadingService.hide();
            console.log(err);
            // alert(JSON.stringify(err, null, 2));
            this.cleanInputs("#upload-porfolio");
            if (err.status === 200) {
              this.checkFileStatus();
            }
          }
        );
      } else {
        this.toastrService.show({
          message: "File size must be less than 2 mb",
          type: "error",
        });
      }
    }
  }

  checkFileStatus(res?: any) {
    console.log({ res });
    if (res.statusCode === 0) {
      this.fileList = res.data || [];
      if (res && res.error_doc === "password_protected") {
        this.toastrService.show({ message: "File is password protected", type: "error" });
        if (this.latestFile) {
          this.presentAlertConfirm();
        }
      } else if (res && res.error_doc === "failed") {
        this.toastrService.show({ message: "File not uploaded", type: "error" });
      } else {
        this.toastrService.show({
          message:
            "Our team will go through your investment and provide advice. Please note that this is chargeable based on your plan/quota",
        });
        this.getUploadportfolioDocuments();
      }
    } else {
      this.toastrService.show({ message: res.data, type: "error" });
    }
  }

  getUploadportfolioDocuments() {
    this.loadingService.show();
    this.subs.sink = this.portfolioService.getLatestPortfolio('mobile').subscribe((res) => {
      this.loadingService.hide();
      console.log({ res });
      this.fileList = res.data || [];
      this.cleanInputs("#upload-porfolio");
    });
  }
  deletePortfolio(item) {
    this.loadingService.show();
    let req = { data: { custdoc_id: (item && item.id) || null } };
    this.subs.sink = this.httpService.deletePortfolio(req).subscribe(
      (res) => {
        if (res.statusCode === 0) {
          this.loadingService.hide();
          this.toastrService.show({ message: "Deleted successfully" });
          this.getUploadportfolioDocuments();
        } else {
          this.loadingService.hide();
          this.toastrService.show({ message: res.data, type: "error" });
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  submitReview() {
    console.log("submit review");
    this.loadingService.show();
    let formData = new FormData();
    formData.append(`request_type`, this.tracking === false ? "advice" : "tracking");
    let req = {
      data: { request_type: this.tracking === false ? "advice" : "tracking" },
    };
    this.subs.sink = this.httpService.uploadDocuments(req).subscribe(
      (res) => {
        this.loadingService.hide();
        console.log({ res });
        if (res.statusCode === 0) {
          this.toastrService.show({ message: "Review submitted successfully" });
          this.navCtrl.navigateRoot("/tabs/tab2").then(() => {
            this.navCtrl.navigateForward("/tabs/tab2/portfolio-dashboard");
          });
        } else {
          this.toastrService.show({ message: res.data, type: "error" });
        }
      },
      (err) => {
        this.loadingService.hide();
        console.log(err);
        if (err.status === 200) {
          this.toastrService.show({ message: "Review submitted successfully" });
          this.navCtrl.back();
        }
      }
    );
  }

  getPortfolioStatus(){
    this.subs.sink = this.portfolioService.check_portfolio_request_received().subscribe(
      (res) => {
        if(res.statusCode == 0){
          if(res.data == 'disabled'){
            this.portfolioStatus = true;
          }else{
            this.portfolioStatus = false;
          }
        }
      });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      // cssClass: "my-custom-class",
      header: "Password Protected!",
      mode: "ios",
      message: "Please enter the document open password",
      inputs: [
        {
          name: "Password",
          type: "text",
          id: "name2-id",
          value: this.filePassword || null,
          placeholder: "Enter Password here",
          handler: (va) => {
            console.log({ va }, this.filePassword);
          },
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log({ blah }, this.filePassword);
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Upload",
          handler: (blah) => {
            console.log({ blah }, this.filePassword);
            console.log("Confirm Okay");
            this.handleChange(this.latestFile, blah.Password || "");
            // this.deleteGoal();
          },
        },
      ],
    });

    await alert.present();
  }
}
