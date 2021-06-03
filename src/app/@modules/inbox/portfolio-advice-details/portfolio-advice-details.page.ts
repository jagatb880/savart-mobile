import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@service/profile.service';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '@service/toastr.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-portfolio-advice-details',
  templateUrl: './portfolio-advice-details.page.html',
  styleUrls: ['./portfolio-advice-details.page.scss'],
})
export class PortfolioAdviceDetailsPage implements OnInit {
  private subs = new SubSink();
  public porfolioDetails: any
  constructor( private navCtrl: NavController,
    private toastService: ToastrService,
    private activatedRoute: ActivatedRoute) { }

  ionViewWillEnter() {
    
  }

  ngOnInit() {
    this.subs.sink = this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      if (res && res.details) {
        this.porfolioDetails = JSON.parse(res.details);
      } else {
        this.toastService.show({ message: "Not allowed to this Page", type: "error" });
        this.navCtrl.back();
      }
    });
  }

}
