import { Injectable } from "@angular/core";
import { HttpService } from "@service/http.service";
import { ServiceURL } from "@service/urls/service.url";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  constructor(public http: HttpService) {}

  getFAQ(): Observable<any> {
    return this.http.get(ServiceURL.FAQS);
  }

  sendEmail(body): Observable<any> {
    return this.http.post(ServiceURL.SEND_EMAIL, body);
  }
}
