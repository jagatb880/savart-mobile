import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Store } from "@ngxs/store";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { ToolsService } from "@service/tools.service";
import { ServiceURL } from "@service/urls/service.url";
import { AuthState } from "@store/state/auth.state";
import { environment } from "environments/environment";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-screener",
  templateUrl: "./screener.page.html",
  styleUrls: ["./screener.page.scss"],
})
export class ScreenerPage implements OnInit {
  serachbox = new FormControl("");
  screener: any;
  constructor(
    private loadingService: LoadingService,
    private toastService: ToastrService,
    private toolsService: ToolsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.serachbox.valueChanges.pipe(debounceTime(100)).subscribe((res) => {
      console.log({ res });
      let params = new HttpParams();
      params = params.append("company_name", res);
      this.toolsService.getScreener(params).subscribe((res) => {
        console.log({ res });
        if (res.statusCode === 0) {
          this.screener = res.data;
        } else {
          this.screener = null;
          this.toastService.show({ message: res.data, type: "error" });
        }
      });
    });
  }

  researchRequest(company_name) {
    console.log({ company_name });
    this.loadingService.show();
    this.toolsService.researchRequest({ data: { company_name } }).subscribe((res) => {
      this.loadingService.hide();
      console.log({ res });
      if (res.statusCode === 0) {
        this.loadingService.hide();
        this.toastService.show({ message: res.data });
      } else if (res.razordict) {
        this.loadingService.hide();
        if (res && res.razordict) {
          this.openRazarPayment(res && res.razordict);
        }
      } else {
        this.toastService.show({ message: res.data, type: "error" });
      }
    });
  }

  async openRazarPayment(data) {
    data["ismobile"] = await true;
    data["t"] = await this.store.selectSnapshot(AuthState.getToken);
    let url: any = await new URL(`${environment.domain}${ServiceURL.REQUEST_RESEARCH}[${JSON.stringify(data)}]`);
    console.log({ url });
    await window.location.assign(url);
  }

  addToWatchlist() {
    console.log(this.screener);
    this.loadingService.show();
    this.toolsService
      .addTowatchlist({
        data: {
          company_name: this.screener.company_name || null,
          desc: this.screener.desc || null,
          market_gap: this.screener.market_gap || null,
          sales_growth: this.screener.sales_growth || null,
          current_price: this.screener.current_price || null,
          face_value: this.screener.face_value || null,
          ROCE: this.screener.ROCE || null,
          stock_P_E: this.screener.stock_P_E || null,
          isin: this.screener.isin || null,
        },
      })
      .subscribe((res) => {
        this.loadingService.hide();
        console.log({ res });
        if (res.statusCode === 0) {
          this.toastService.show({ message: res.data });
        } else {
          this.toastService.show({ message: res.data, type: "error" });
        }
      });
  }
}
