import { Injectable } from "@angular/core";
// import { HttpService } from "./http.service";
// import { ServiceURL } from "./urls/service.url";
import { Observable } from "rxjs";
import { HttpService } from "@service/http.service";
import { ServiceURL } from "@service/urls/service.url";
import { map } from "rxjs/operators";
import { taskName } from "@core/constants/constants";
import { NavController, ToastController } from "@ionic/angular";
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingService } from './loading.service';
import { File } from '@ionic-native/file/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { ToastrService } from './toastr.service';

@Injectable({
  providedIn: "root",
})
export class CommonService {
  public isChangePassword = false;
  public isMobilePaused = false;

  private donwloadProgress = 0;
  public androidPermission: boolean = false;
  constructor(public http: HttpService, private navCtrl: NavController,private fileOpener: FileOpener, private document: DocumentViewer,
    private loadingSvc: LoadingService, private file: File, private toastService: ToastrService,
    private platform: Platform, private androidPermissions: AndroidPermissions, private httpClient: HttpClient) {}

  getlookupDetails(body): Observable<any> {
    return this.http.post(ServiceURL.LOOK_UP_DETAILS, body);
  }

  checkWSValidatePhoneNumber(body): Observable<any> {
    return this.http.post(ServiceURL.VALIDATE_PHONE_NO, body);
  }

  getCustomerStatus(): Observable<any> {
    return this.http.get(ServiceURL.CUSTOMER_STATUS);
  }
  checkDashbaord(): Observable<any> {
    return this.http.get(ServiceURL.CHECK_DASHBOARD);
  }

  getRestCountriesByName(name): Observable<any> {
    return this.http.getRestCountriesByName(name);
  }

  redirectBasedOnCusStatus(name) {
    switch (name.taskname) {
      case taskName.SERVICE:
        this.navCtrl.navigateRoot("/tabs/tab1").then(() => {
          this.navCtrl.navigateForward("/tabs/tab1/profile-service");
        });
        break;
      case taskName.SUBSCRIPTION:
        this.navCtrl.navigateRoot("/tabs/tab1").then(() => {
          this.navCtrl.navigateForward("/tabs/tab1/profile-service");
        });
        break;
      case taskName.PERSONAL:
        this.navCtrl.navigateRoot("/tabs/tab1").then(() => {
          this.navCtrl.navigateForward("/tabs/tab1/personal-profile");
        });
        break;
      case taskName.INVESTMENT:
        this.navCtrl.navigateRoot("/tabs/tab1").then(() => {
          this.navCtrl.navigateForward("/tabs/tab1/investment-profile");
        });
        break;
      case taskName.DEMAT:
        this.navCtrl.navigateRoot("/tabs/tab1").then(() => {
          this.navCtrl.navigateForward("/tabs/tab1/demat");
        });
        break;
        // case taskName.DOCUMENT:
        //   this.navCtrl.navigateRoot("/tabs/tab1").then(() => {
        //     this.navCtrl.navigateForward("/tabs/tab1/document");
        //   });
        break;
      default:
        this.navCtrl.navigateRoot("/profile-dashboard");
        break;
    }
  }

  fetchPayment(paymentId) {}

  getAndroidPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          this.androidPermission = true
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              this.androidPermission = true
            } else {
              this.androidPermission = null;
            }
          }, err => {
            console.log(err)
            this.androidPermission = null;
          }, );
        }
      },
      err => {
        console.log(err)
        this.androidPermission = false;
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      }, );
  }

  downloadPdfAndOpen(url){
    this.loadingSvc.show();
    let downloadUrl = url;
    try {
      this.httpClient.get(downloadUrl, {
        responseType: 'arraybuffer',
        reportProgress: true,
        observe: 'events'
      }).subscribe(async event =>{
        this.loadingSvc.hide();
        try {
          if(event.type ==  HttpEventType.DownloadProgress){
            this.donwloadProgress = Math.round((100 * event.loaded) / event.total)
          }else if(event.type == HttpEventType.Response){
            this.donwloadProgress = 0;
            const fileName = downloadUrl.substr(downloadUrl.lastIndexOf('/') + 1);
            let filePath;
            if (this.platform.is('ios')) {
              filePath = this.file.dataDirectory;
            }else{
              filePath = this.file.externalRootDirectory;
            }
            this.file.checkFile(filePath, fileName).then(
              (files) => {
                this.file.removeFile(filePath,fileName).then(data=>{
                  this.file.writeFile(filePath,fileName,event.body).then(data=>{
                    let path = data.nativeURL;
                    this.loadingSvc.hide();
                    this.fileOpener.open(path,'application/pdf').then(()=>{
                      console.log('File is opened')
                    }).catch(error=>{
                      console.log('Error opening file',error)
                    })
                  }).catch(error=>{
                    this.loadingSvc.hide();
                    console.log('Error opening file',error)
                  })
                }).catch(error=>{
                  this.loadingSvc.hide();
                  console.log('Error opening file',error)
                })
              }
            ).catch(
              (err) => {
                this.file.writeFile(filePath,fileName,event.body).then(data=>{
                  let path = data.nativeURL;
                  this.loadingSvc.hide();
                  this.fileOpener.open(path,'application/pdf').then(()=>{
                    console.log('File is opened')
                  }).catch(error=>{
                    console.log('Error opening file',error)
                  })
                }).catch(error=>{
                  this.loadingSvc.hide();
                  console.log('Error opening file',error)
                })
              }
            );
          }
        } catch (error) {
          console.log(error)
          this.toastService.show({ message: "No pdf found, please contact to admin", type: "error" });
        }
        error=>{
          console.log(error)
        }
      })
    } catch (error) {
      this.loadingSvc.hide();
      console.log('Error opening file',error)
    }
    
  }
}
