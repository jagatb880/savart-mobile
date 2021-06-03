import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-view-portfolio",
  templateUrl: "./view-portfolio.page.html",
  styleUrls: ["./view-portfolio.page.scss"],
})
export class ViewPortfolioPage implements OnInit {
  item: any;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log({ res });
      if (res) {
        this.item = res || null;
      }
    });
  }
}
