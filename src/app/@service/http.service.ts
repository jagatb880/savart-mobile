import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders, HttpRequest, HttpEventType } from "@angular/common/http";
import { environment } from "environments/environment";
import { map, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { ServiceURL } from "@service/urls/service.url";
import { Plugins, FilesystemDirectory } from "@capacitor/core";
const { Browser, Filesystem } = Plugins;

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(public http: HttpClient) {}

  get(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<any> {
    return this.http.get(`${environment.domain + url}`, { headers, params }).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  delete(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<any> {
    return this.http.delete(`${environment.domain + url}`, { headers, params }).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  post(url: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<any> {
    return this.http.post(`${environment.domain + url}`, body, { headers, params }).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  getRestCountriesByName(name): Observable<any> {
    return this.http.get(`https://restcountries.eu/rest/v2/name/${name}`).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  getRazorPayPaymentById(payId) {
    return this.http
      .get(
        `https://${environment.RAZORPAY_API_KEY}:${environment.RAZORPAY_API_SECRET_KEY}@api.razorpay.com/v1/payments/${
          payId || ""
        }`
      )
      .pipe(
        map((res) => res),
        catchError((err) => throwError(err))
      );
  }

  getOrderId(): Observable<any> {
    return this.http.get(`https://api.razorpay.com/v1/orders`).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  uploadDocuments(formData): any {
    return this.http.post(`${environment.domain + ServiceURL.UPLOAD_DOCUMENTS}`, formData).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }
  deletePortfolio(data): any {
    return this.http.post(`${environment.domain + ServiceURL.DELETE_PORTFOLIO}`, data).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }
  deleteContractNotes(data): any {
    return this.http.post(`${environment.domain + ServiceURL.DELETE_CONTRACT_NOTES}`, data).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  portfoliouploadDocuments(formData): any {
    return this.http.post(`${environment.domain + ServiceURL.PORTFOLIO_UPLOAD_DOCUMENTS}`, formData).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  contractNotesuploadDocuments(formData): any {
    return this.http.post(`${environment.domain + ServiceURL.CONTRACT_NOTES_UPLOAD_DOCUMENTS}`, formData).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }
}
