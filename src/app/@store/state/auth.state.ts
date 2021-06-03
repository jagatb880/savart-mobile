import { Injectable } from "@angular/core";
import { State, StateContext, Action, Selector, Store } from "@ngxs/store";
import { Login, Logout, AuthToken } from "../actions/auth.actions";
import { CommonState } from "@store/state/common.state";
import { NavController } from "@ionic/angular";
import { Reset } from "@store/actions/common.action";

@State<any>({
  name: "auth",
  defaults: {
    token: null,
  },
})
@Injectable({ providedIn: "root" })
export class AuthState {
  constructor(private store: Store, private navCtrl: NavController) {}
  @Selector()
  static getToken(state: any) {
    return state.token;
  }

  @Action(Login)
  login(ctx: StateContext<any>, action: Login) {
    return ctx.getState();
  }

  @Action(Logout)
  logout(ctx: StateContext<any>) {
    this.store.dispatch(new Reset());
    this.store.reset(AuthState);
    localStorage.clear();
    this.navCtrl.navigateRoot("/login");
  }

  @Action(AuthToken)
  AuthToken(ctx: StateContext<any>, payload: AuthToken) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      token: payload.token,
    });
  }
}
