import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CusstatusGuard } from "@shared/guard/cusstatus.guard";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";
import { Tab2Page } from "./tab2.page";

const routes: Routes = [
  {
    path: "",
    component: Tab2Page,
    canActivate: [IsexpiredGuard],

    children: [
      // { path: "", redirectTo: "/tabs/tab2/transaction-log", pathMatch: "full" },
      { path: "", redirectTo: "/tabs/tab2/portfolio-dashboard", pathMatch: "full" },
      {
        path: "portfolio-dashboard",
        canActivate: [CusstatusGuard],
        loadChildren: () =>
          import("@modules/portfolio/portfolio-dashboard/portfolio-dashboard.module").then(
            (m) => m.PortfolioDashboardPageModule
          ),
      },
      {
        path: "investment-dashboard",
        loadChildren: () =>
          import("@modules/portfolio/investment-dashboard/investment-dashboard.module").then(
            (m) => m.InvestmentDashboardPageModule
          ),
      },
      {
        path: "select-goal",
        loadChildren: () =>
          import("@modules/portfolio/select-goal/select-goal.module").then((m) => m.SelectGoalPageModule),
      },
      {
        path: "set-a-goal",
        loadChildren: () => import("@modules/portfolio/set-a-goal/set-a-goal.module").then((m) => m.SetAGoalPageModule),
      },
      {
        path: "request-advice",
        loadChildren: () =>
          import("@modules/portfolio/request-advice/request-advice.module").then((m) => m.RequestAdvicePageModule),
      },
      {
        path: "upload-portfolio",
        loadChildren: () =>
          import("@modules/portfolio/upload-portfolio/upload-portfolio.module").then(
            (m) => m.UploadPortfolioPageModule
          ),
      },
      {
        path: "transaction-log",
        loadChildren: () =>
          import("@modules/portfolio/transaction-log/transaction-log.module").then((m) => m.TransactionLogPageModule),
      },
      {
        path: "transaction-log-detail",
        loadChildren: () =>
          import("@modules/portfolio/transaction-log-detail/transaction-log-detail.module").then(
            (m) => m.TransactionLogDetailPageModule
          ),
      },
      {
        path: "view-advice",
        loadChildren: () =>
          import("@modules/portfolio/view-advice/view-advice.module").then((m) => m.ViewAdvicePageModule),
      },
      {
        path: "upload-contract",
        loadChildren: () =>
          import("@modules/portfolio/upload-contract/upload-contract.module").then((m) => m.UploadContractPageModule),
      },
      {
        path: "full-dashboard",
        loadChildren: () =>
          import("@modules/portfolio/full-dashboard/full-dashboard.module").then((m) => m.FullDashboardPageModule),
      },
      {
        path: "view-portfolio",
        loadChildren: () =>
          import("@modules/portfolio/view-portfolio/view-portfolio.module").then((m) => m.ViewPortfolioPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab2PageRoutingModule {}
