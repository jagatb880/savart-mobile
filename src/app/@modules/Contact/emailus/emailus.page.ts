import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ContactService } from "@service/contact.service";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { SubSink } from "subsink";
import { ProfileService } from '@service/profile.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: "app-emailus",
  templateUrl: "./emailus.page.html",
  styleUrls: ["./emailus.page.scss"],
})
export class EmailusPage implements OnInit, OnDestroy {
  private subs = new SubSink();
  emailForm: FormGroup;
  answer = new FormControl(null, Validators.required);
  editorConfig: any = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "200px",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Share your thoughts here..",
    imageEndPoint: "",
    toolbar: [
      ["bold", "underline", "italic"],
      ["orderedList", "unorderedList"],
    ],
  };
  constructor(
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private navCtrl: NavController,
    private contactService: ContactService
  ) {
    this.createEmailForm();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.getCompletedPersonalProfileQuestions();
    this.subs.sink = this.answer.valueChanges.subscribe((res) => {
      console.log({ res });
      this.emailForm.patchValue({
        html: res,
      });
    });
  }

  getCompletedPersonalProfileQuestions() {
    this.loadingService.show();
    this.subs.sink = this.profileService.getCompletedPersonalProfileQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        if(res.data[3] != undefined){
          this.emailForm.controls.from.setValue(res.data[3].custresponse)
          this.emailForm.controls['from'].disable({onlySelf: true});
        }else{
          this.presentAlertConfirm();
        }
      }
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: "my-custom-class",
      header: "Warning!",
      mode: "ios",
      message: "Please complete your personal profile.",
      backdropDismiss: false,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            console.log("Confirm Okay");
            this.navCtrl.navigateRoot(['tabs/tab1/personal-profile'])
          },
        },
      ],
    });
    await alert.present();
  }


  createEmailForm() {
    this.emailForm = this.fb.group({
      from: [null, Validators.required],
      html: [null, Validators.required],
      subject: [null],
    });
  }
  submit(value) {
    let request: any = null;
    if (this.emailForm.valid) {
      console.log({ value });
      this.loadingService.show();
      request = {
        subject: value.subject || "",
        html: value.html || "",
        text: value.text || "",
        to: [{ email: "hi@savart.in", name: value.from || "", type: "to" }],
      };

      console.log({ request });
      this.contactService.sendEmail(request).subscribe((res) => {
        this.loadingService.hide();
        console.log(res);
        if (res.statusCode === 0) {
          this.toastrService.show({ message: res.message });
          this.emailForm.reset();
        } else {
          this.toastrService.show({ message: res.data, type: "error" });
        }
      });
    } else {
      this.toastrService.show({ message: "Please fill all the fields", type: "error" });
    }
  }
}
