import { Injectable } from "@angular/core";
import { HttpService } from "@service/http.service";
import { Observable } from "rxjs";
import { ServiceURL } from "@service/urls/service.url";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(public http: HttpService) {}

  getSubscriptionQuestions(): Observable<any> {
    return this.http.get(ServiceURL.SUBSCRIPTION_QUESTIONS);
  }

  getClientSubscriptionQuestions(): Observable<any> {
    return this.http.get(ServiceURL.CLIENT_SUBSCRIPTION_QUESTIONS);
  }
  getSelectedSubscriptionQuestions(): Observable<any> {
    return this.http.get(ServiceURL.SELECTED_SUBSCRIPTION_QUESTIONS);
  }

  selectedSubscriptionPayments(body): Observable<any> {
    return this.http.post(ServiceURL.SELECTED_SUBSCRIPTION_PAYMENT, body);
  }

  newselectedSubscriptionPayments(params): Observable<any> {
    console.log({ params });
    return this.http.get(`${ServiceURL.NEW_SELECTED_SUBSCRPTION_PAYMENT}[${JSON.stringify(params)}]`);
  }

  upgradeServices(body): Observable<any> {
    return this.http.post(ServiceURL.UPGRADE_SERVICE, body);
  }

  capturePayment(body): Observable<any> {
    return this.http.get(ServiceURL.CAPTURE_PAYMENT, body);
  }

  captureRazorPayPayment(params): Observable<any> {
    console.log({ params });
    return this.http.get(`${ServiceURL.CAPTURE_RAZORPAY_PAYMENT}?${params}`);
  }

  upgradeRazorPayPayment(params): Observable<any> {
    console.log({ params });
    return this.http.get(`${ServiceURL.UPGRADE_RAZORPAY_PAYMENT}?${params}`);
  }

  getPersonalProfileQuestions(): Observable<any> {
    return this.http.get(ServiceURL.PERSONAL_PROFILE_QUESTIONS);
  }

  getCompletedPersonalProfileQuestions(): Observable<any> {
    return this.http.get(ServiceURL.COMPLETED_PERSONAL_PROFILE_QUESTIONS);
  }

  savePersonalProfileQuestions(body): Observable<any> {
    return this.http.post(ServiceURL.SAVE_PERSONAL_PROFILE_QUESTIONS, body);
  }

  getInvestmentProfileQuestions(): Observable<any> {
    return this.http.get(ServiceURL.INVESTMENT_PROFILE_QUESTIONS);
  }

  getCompletedInvestmentProfileQuestions(): Observable<any> {
    return this.http.get(ServiceURL.COMPLETED_INVESTMENT_PROFILE_QUESTIONS);
  }

  saveInvestmentProfileQuestions(body): Observable<any> {
    return this.http.post(ServiceURL.SAVE_PERSONAL_INVESTMENT_QUESTIONS, body);
  }

  getDematQuestions(): Observable<any> {
    return this.http.get(ServiceURL.DEMAT_QUESTIONS);
  }

  saveDematQuestions(body): Observable<any> {
    return this.http.post(ServiceURL.SAVE_DEMAT_QUESTIONS, body);
  }

  getPreviousDemat(): Observable<any> {
    return this.http.get(ServiceURL.DEMAT_PREVIOUS);
  }

  getCountries(): Observable<any> {
    return this.http.get(ServiceURL.GET_COUNTRIES);
  }

  getPorfolioAdvice(porfolioAdviceUrl): Observable<any> {
    return this.http.get(ServiceURL.PORTFOFIO_ADVICE+"/"+porfolioAdviceUrl);
  }
}
