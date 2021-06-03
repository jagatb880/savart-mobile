import { Injectable } from "@angular/core";
import { HttpService } from "@service/http.service";
import { ServiceURL } from "@service/urls/service.url";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InboxService {
  constructor(public http: HttpService) {}

  getNotifications(): Observable<any> {
    return this.http.get(ServiceURL.GET_NOTIFICATION);
  }

  readNotifications(body): Observable<any> {
    return this.http.post(ServiceURL.READ_NOTIFICATION, body);
  }
}
