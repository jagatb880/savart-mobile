import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { AuthState } from "@store/state/auth.state";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { environment } from "environments/environment";
import { AlertController } from "@ionic/angular";

@Injectable({ providedIn: "root" })
export class TokenInterceptors implements HttpInterceptor {
  constructor(
    private store: Store,
    private toastService: ToastrService,
    private loadingService: LoadingService,
    private alertController: AlertController
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();
    if (this.store.selectSnapshot(AuthState.getToken) && !request.url.includes("https://api.razorpay.com/v1/orders")) {
      headers = headers.append("Authorization", `token ${this.store.selectSnapshot(AuthState.getToken)}`);
    }

    if (request.url.includes("https://api.razorpay.com/v1/orders")) {
      headers = headers.append(
        "Authorization",
        "Basic " + btoa(`${environment.RAZORPAY_API_KEY + ":" + environment.RAZORPAY_API_SECRET_KEY}`)
      );
    }

    console.log("interceptor called", JSON.stringify(request));
    console.log(!request.url.includes("/clients/documents/portfoliosubmit") && request.method !== "POST");
    if (
      (!request.url.includes("@api.razorpay.com/") &&
        !request.url.includes("https://restcountries.eu") &&
        !request.url.includes("https://api.razorpay.com/v1/orders")) ||
      (!request.url.includes("/clients/documents/portfoliosubmit") && request.method !== "POST") ||
      (!request.url.includes("/clients/documents/contractnotessubmit") && request.method !== "POST")
    ) {
      request = request.clone({
        headers,
        setHeaders: {
          // Authorization: `token ${this.store.selectSnapshot(AuthState.getToken)}`,
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    }
    if (
      request.url.includes("/clients/documents/portfoliosubmit") ||
      request.url.includes("/clients/documents/contractnotessubmit")
    ) {
      request = request.clone({
        headers,
        setHeaders: {
          // Authorization: `token ${this.store.selectSnapshot(AuthState.getToken)}`,
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
          Accept: "application/json",
        },
      });
    }
    return next.handle(request).pipe(
      map((res) => res),
      tap((res: any) => {
        console.log("ress", { res });
        if (res.body && res.body.statusCode === 1) {
          this.loadingService.hide();
          console.log("ress", res.body.data);

          if (res.body.data) this.toastService.show({ message: res.body.data, type: "error" });
        }
      }),
      catchError((err) => {
        console.log({ err });
        this.loadingService.hide();
        if ((err && err.statusText === "Unknown Error") || (err && err.status === 0)) {
          this.presentAlertConfirm();
        }
        return throwError(err);
      })
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Warning!",
      mode: "ios",
      backdropDismiss: false,
      message: "Server is down , Please try again later",
      buttons: [
        {
          text: "Exit",
          handler: () => {
            console.log("Confirm Okay");
            if (navigator["app"]) {
              navigator["app"].exitApp();
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
