import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: TabsPage,
    children: [
      {
        path: "tab1",
        canActivate: [IsexpiredGuard],
        loadChildren: () => import("@modules/tab1/tab1.module").then((m) => m.Tab1PageModule),
      },
      {
        path: "tab2",
        canActivate: [IsexpiredGuard],
        loadChildren: () => import("@modules/tab2/tab2.module").then((m) => m.Tab2PageModule),
      },
      {
        path: "tab3",
        loadChildren: () => import("@modules/tab3/tab3.module").then((m) => m.Tab3PageModule),
        canActivate: [IsexpiredGuard],
      },
      {
        path: "tab4",
        canActivate: [IsexpiredGuard],
        loadChildren: () => import("@modules/tab4/tab4.module").then((m) => m.Tab4PageModule),
      },
      {
        path: "tab5",
        canActivate: [IsexpiredGuard],
        loadChildren: () => import("@modules/tab5/tab5.module").then((m) => m.Tab5PageModule),
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/tab1",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
