import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { HttpService } from "@service/http.service";
import { LoadingService } from "@service/loading.service";
import { PortfolioService } from "@service/portfolio.service";
import { ToastrService } from "@service/toastr.service";
import { SubSink } from "subsink";

declare var $: any;
@Component({
  selector: "app-upload-contract",
  templateUrl: "./upload-contract.page.html",
  styleUrls: ["./upload-contract.page.scss"],
})
export class UploadContractPage implements OnInit, OnDestroy {
  fileList: any[] = [];
  filePassword = null;
  latestFile: any;
  private subs = new SubSink();
  constructor(
    private navCtrl: NavController,
    private httpService: HttpService,
    private alertController: AlertController,
    private loadingService: LoadingService,
    private portfolioService: PortfolioService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.fileList = [];
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ionViewWillEnter() {
    this.getContractNotesDocuments();
  }

  browse() {
    document.getElementById("uploadContract").click();
  }

  handleChange(event, password = "") {
    console.log({ event });
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size / 1024 <= 1025) {
        let formData = new FormData();
        this.latestFile = event || null;
        formData.append(`ContractNotes`, event.target.files[0]);
        formData.append(`ContractNotes_pdf_password`, password);
        formData.append(`source`, 'mobile');

        console.log({ formData });
        this.loadingService.show();
        this.subs.sink = this.httpService.contractNotesuploadDocuments(formData).subscribe(
          (res) => {
            this.loadingService.hide();
            if (res.statusCode === 0) {
              this.checkFileStatus(res);
            }

            console.log({ res });
            // alert(JSON.stringify(res, null, 2));
          },
          (err) => {
            this.cleanInputs("#upload-contract");
            this.loadingService.hide();
            // alert(JSON.stringify(err, null, 2));
            console.log(err);
            if (err.status === 200) {
              this.checkFileStatus();

              this.cleanInputs("#upload-contract");
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
        this.toastrService.show({ message: "Uploaded successfully" });
        this.getContractNotesDocuments();
      }
    } else {
      this.toastrService.show({ message: res.data, type: "error" });
    }
  }

  cleanInputs(fileEle) {
    $(fileEle).val("");
    var parEle = $(fileEle).parent();
    var newEle = $(fileEle).clone();
    $(fileEle).remove();
    $(parEle).prepend(newEle);
  }

  getContractNotesDocuments() {
    this.loadingService.show();
    this.subs.sink = this.portfolioService.getLatestContractNotes('mobile').subscribe((res) => {
      this.loadingService.hide();
      console.log({ res });
      this.fileList = res.data || [];
      this.cleanInputs("#upload-contract");
    });
  }

  deleteContractNotes(item) {
    this.loadingService.show();
    let req = { data: { custdoc_id: (item && item.id) || null } };
    this.subs.sink = this.httpService.deleteContractNotes(req).subscribe(
      (res) => {
        if (res.statusCode === 0) {
          this.loadingService.hide();
          this.toastrService.show({ message: "Deleted successfully" });
          this.getContractNotesDocuments();
        } else {
          this.loadingService.hide();
          this.toastrService.show({ message: res.data, type: "error" });
        }
      },
      (error) => {
        this.loadingService.hide();
      }
    );
  }

  contractNotesSubmit() {
    this.loadingService.show();
    let req = {
      data: { status: "P" },
    };
    this.portfolioService.contractNotesSubmit(req).subscribe((res) => {
      if (res.statusCode === 0) {
        this.loadingService.hide();
        this.toastrService.show({ message: "Submitted successfully" });
        this.showDashboard();
      } else {
        this.loadingService.hide();
        this.toastrService.show({ message: res.data, type: "error" });
      }
    });
  }

  showDashboard() {
    this.navCtrl.navigateRoot("/tabs/tab2").then(() => {
      this.navCtrl.navigateForward("/tabs/tab2/full-dashboard");
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
