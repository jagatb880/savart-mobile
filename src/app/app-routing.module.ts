import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { IsLogginGuard } from "@shared/guard/is-loggin.guard";
const routes: Routes = [
  {
    path: "",
    redirectTo: "/welcome-login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () => import("@modules/Authentication/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "register",
    loadChildren: () => import("@modules/Authentication/register/register.module").then((m) => m.RegisterPageModule),
  },
  {
    path: "verify-otp",
    loadChildren: () =>
      import("./@modules/Authentication/verify-otp/verify-otp.module").then((m) => m.VerifyOtpPageModule),
  },
  {
    path: "set-your-password",
    loadChildren: () =>
      import("./@modules/Authentication/set-your-password/set-your-password.module").then(
        (m) => m.SetYourPasswordPageModule
      ),
  },
  {
    path: "welcome-login",
    canActivate: [IsLogginGuard],
    loadChildren: () =>
      import("./@modules/Authentication/welcome-login/welcome-login.module").then((m) => m.WelcomeLoginPageModule),
  },
  {
    path: "tabs",
    loadChildren: () => import("@modules/tabs/tabs.module").then((m) => m.TabsPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
