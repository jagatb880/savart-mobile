import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";
import { Tab1Page } from "./tab1.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: Tab1Page,
    children: [
      { path: "", redirectTo: "/tabs/tab1/profile-dashboard", pathMatch: "full" },
      {
        path: "profile-dashboard",
        loadChildren: () =>
          import("@modules/profile/profile-dashboard/profile-dashboard.module").then(
            (m) => m.ProfileDashboardPageModule
          ),
      },
      {
        path: "profile-service",
        loadChildren: () =>
          import("@modules/profile/profile-service/profile-service.module").then((m) => m.ProfileServicePageModule),
      },
      {
        path: "personal-profile",
        loadChildren: () =>
          import("@modules/profile/personal-profile/personal-profile.module").then((m) => m.PersonalProfilePageModule),
      },
      {
        path: "investment-profile",
        loadChildren: () =>
          import("@modules/profile/investment-profile/investment-profile.module").then(
            (m) => m.InvestmentProfilePageModule
          ),
      },
      {
        path: "demat",
        loadChildren: () => import("@modules/profile/demat/demat.module").then((m) => m.DematPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
