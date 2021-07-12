import { Injectable, ApplicationRef, NgZone } from "@angular/core";
import { State, StateContext, Action, Selector, Store } from "@ngxs/store";
import { Login, Logout, AuthToken } from "../actions/auth.actions";
import {
  GetCountryCode,
  WSValidateMobileNumber,
  SendOTP,
  ActiveButton,
  Reset,
  SetMobileNumber,
  SetCommonState,
  UpdateCusStatus,
  SetNotificationCount,
  SetPlanExpired,
} from "@store/actions/common.action";
import { CommonService } from "@service/common.service";
import { map, tap } from "rxjs/operators";
import { AuthService } from "@service/auth.service";
import { NavController } from "@ionic/angular";
import { LoadingService } from "@service/loading.service";
import { ProfileService } from "@service/profile.service";
import * as moment from "moment";

@State<any>({
  name: "common",
  defaults: {
    countryList: [],
    activeButton: 0,
    notificationCount: "",
    custcountrycode: null,
    custregmobile: null,
    pwdchange: null,
    token: null,
    cusStatus: [],
    expired: false,
    Dashboard_view: "empty_dashboard",
  },
})
@Injectable({ providedIn: "root" })
export class CommonState {
  constructor(
    private store: Store,
    private commonService: CommonService,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingService: LoadingService,
    private profileService: ProfileService,
    private ngZone: NgZone
  ) {}

  @Selector()
  static countryList(state: any) {
    return state.countryList;
  }

  @Selector()
  static getState(state: any) {
    return state;
  }

  @Selector()
  static getNotificationCount(state: any) {
    return state.notificationCount;
  }

  @Selector()
  static getMobileNumber(state: any) {
    return state.custregmobile;
  }
  @Selector()
  static getCountryCode(state: any) {
    return state.custcountrycode;
  }

  @Selector()
  static getCusStatus(state: any) {
    return state.cusStatus;
  }

  @Selector()
  static getExpired(state: any) {
    return state.expired;
  }

  @Selector()
  static getpwdchange(state: any) {
    return state.pwdchange;
  }

  @Selector()
  static getDashview(state: any) {
    return state.Dashboard_view;
  }

  @Selector()
  static getActiveButton(state: any) {
    return state.activeButton;
  }

  @Selector()
  static getToken(state: any) {
    return state.token;
  }

  @Action(GetCountryCode)
  GetCountryCode(ctx: StateContext<any>, action: GetCountryCode) {
    const state = ctx.getState();
    return this.commonService.getlookupDetails({ lookupname: action.payload.lookupname }).pipe(
      tap((res) => {
        ctx.patchState({ ...state, countryList: res.data });
      })
    );
  }

  @Action(UpdateCusStatus)
  UpdateCusStatus(ctx: StateContext<any>) {
    const state = ctx.getState();
    return this.commonService.getCustomerStatus().pipe(
      map((res) => {
        ctx.patchState({ ...state, cusStatus: res.data || [] });
        return res;
      })
    );
    // .subscribe((res) => {
    //   console.log("cusStatus", { res });
    //   return (res && res.data) || [];
    // });
  }

  @Action(SetMobileNumber)
  SetMobileNumber(ctx: StateContext<any>, action: SetMobileNumber) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      custregmobile: action.mobileNumber || null,
    });
  }

  @Action(SetCommonState)
  SetCommonState(ctx: StateContext<any>, action: SetCommonState) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      ...action.payload,
    });
  }

  @Action(WSValidateMobileNumber)
  WSValidateMobileNumber(ctx: StateContext<any>, action: WSValidateMobileNumber) {
    console.log("WSValidateMobileNumber", ctx.getState());
    console.log(action.payload);
    const state = ctx.getState();
    this.loadingService.show();
    return this.commonService.checkWSValidatePhoneNumber(action.payload).pipe(
      tap((res) => {
        this.loadingService.hide();
        console.log({ res });
        if (res.statusCode === 0) {
          this.store.dispatch(new AuthToken(res.token));
          ctx.patchState({ ...state, token: res.token, activeButton: res.data === true ? 1 : 2 });
        } else {
          this.store.dispatch(new AuthToken(res.token));
          ctx.patchState({ ...state, token: null, activeButton: 0 });
        }
      })
    );
  }

  @Action(SendOTP)
  SendOTP(ctx: StateContext<any>, action: SendOTP) {
    console.log("SendOTP", ctx.getState());
    console.log(action.payload);
    const state = ctx.getState();
    this.loadingService.show();
    return this.authService.sendOTP(action.payload).pipe(
      tap((res) => {
        this.loadingService.hide();
        console.log({ res });
        if (res.statusCode === 0) {
          this.ngZone.run(() => {
            this.navCtrl.navigateForward("/verify-otp").then(() => {
              this.store.dispatch(new AuthToken(res.token));
              ctx.patchState({
                ...state,
                custcountrycode: action.payload.custcountrycode,
                custregmobile: action.payload.custregmobile,
                token: res.token,
                activeButton: 0,
              });
            });
          });
        } else {
          ctx.patchState({
            ...state,
            activeButton: 0,
            custcountrycode: action.payload.custcountrycode,
            custregmobile: action.payload.custregmobile,
          });
        }
      })
    );
  }

  @Action(ActiveButton)
  ActiveButton(ctx: StateContext<any>, action: ActiveButton) {
    console.log("ActiveButton", ctx.getState());
    console.log(action.activeButton);
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      activeButton: action.activeButton,
    });
  }

  @Action(SetNotificationCount)
  SetNotificationCount(ctx: StateContext<any>, action: SetNotificationCount) {
    console.log("ActiveButton", ctx.getState());
    console.log(action.notificationCount);
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      notificationCount: action.notificationCount,
    });
  }

  @Action(SetPlanExpired)
  SetPlanExpired(ctx: StateContext<any>) {
    console.log("ActiveButton", ctx.getState());
    const state = ctx.getState();
    return this.profileService.getSelectedSubscriptionQuestions().subscribe((res) => {
      console.log({ res });
      this.loadingService.hide();
      if (res.statusCode === 0) {
        let expired = false;
        if (res && res.data) {
          expired = res.data.length > 0 ? false : true;
          res.data.forEach((element) => {
            if (this.checkIsExpired(element.servexpdt)) {
              expired = true;
            }
          });
        }
        ctx.patchState({
          ...state,
          expired: expired,
        });
      }
    });
  }

  @Action(Reset)
  Reset(ctx: StateContext<any>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      activeButton: 0,
      custcountrycode: null,
      custregmobile: null,
      token: null,
      cusStatus: [],
      pwdchange: null,
      Dashboard_view: "empty_dashboard",
    });
  }

  checkIsExpired(date) {
    let expDate = new Date(date)
    let currentDate = new Date();
    return expDate < currentDate
  }
}
