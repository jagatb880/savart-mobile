import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpService } from "@service/http.service";
import { ServiceURL } from "@service/urls/service.url";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToolsService {
  constructor(public http: HttpService) {}

  investmentCalculator(params?: HttpParams): Observable<any> {
    return this.http.get(ServiceURL.INVESTMENT_CALCULATOR, params);
  }

  getScreener(params?: HttpParams): Observable<any> {
    return this.http.get(ServiceURL.GET_SCREENER, params);
  }

  getWatchList(params?: HttpParams): Observable<any> {
    return this.http.get(ServiceURL.WATCHLIST, params);
  }
  addTowatchlist(body): Observable<any> {
    return this.http.post(ServiceURL.WATCHLIST, body);
  }
  removeWatchlist(body): Observable<any> {
    return this.http.post(ServiceURL.REMOVE_WATCHLIST, body);
  }
  researchRequest(body): Observable<any> {
    return this.http.post(ServiceURL.RESEARCH_REQUEST, body);
  }
}
