import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpService } from "@service/http.service";
import { ServiceURL } from "@service/urls/service.url";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PortfolioService {
  constructor(public http: HttpService) {}

  getSelectGoals(): Observable<any> {
    return this.http.get(ServiceURL.GET_SELECT_GOALS);
  }
  getSelectedGoals(): Observable<any> {
    return this.http.get(ServiceURL.GET_SELECTED_GOALS);
  }
  editGoals(body): Observable<any> {
    return this.http.post(ServiceURL.EDIT_GOALS, body);
  }
  selectGoals(body): Observable<any> {
    return this.http.post(ServiceURL.SELECT_GOALS, body);
  }
  deleteGoal(body): Observable<any> {
    return this.http.post(ServiceURL.DELETE_GOAL, body);
  }

  contractNotesSubmit(body): Observable<any> {
    return this.http.post(ServiceURL.CONTRACT_NOTES_SUBMIT, body);
  }
  checkRequestAdvice(): Observable<any> {
    return this.http.get(ServiceURL.CHECK_REQUEST_ADVICE);
  }
  requestAdvice(body): Observable<any> {
    return this.http.post(ServiceURL.REQUEST_ADVICE, body);
  }
  getTransactionLog(): Observable<any> {
    return this.http.get(ServiceURL.GET_TRANSACTION_LOG);
  }
  viewAdvice(id): Observable<any> {
    return this.http.get(`${ServiceURL.VIEW_ADVICE}${id}`);
  }

  fullDashboard(): Observable<any> {
    return this.http.get(ServiceURL.FULL_DASHBOARD);
  }
  currentPortfolio(): Observable<any> {
    return this.http.get(ServiceURL.CURRENT_PORTFOLIO);
  }

  getLatestPortfolio(param): Observable<any> {
    return this.http.get(`${ServiceURL.GET_LATEST_UPLOAD_PORTFOLIO}?${param}`);
  }
  getLatestContractNotes(param): Observable<any> {
    return this.http.get(`${ServiceURL.GET_LATEST_UPLOAD_CONTRACT_NOTES}?${param}`);
  }

  check_portfolio_request_received(): Observable<any> {
    return this.http.get(ServiceURL.PORTFOLIO_REQUEST_RECEIVED);
  }
}
