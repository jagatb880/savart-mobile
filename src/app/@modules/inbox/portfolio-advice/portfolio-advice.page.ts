import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@service/profile.service';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '@service/toastr.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from '@service/loading.service';

@Component({
  selector: 'app-portfolio-advice',
  templateUrl: './portfolio-advice.page.html',
  styleUrls: ['./portfolio-advice.page.scss'],
})
export class PortfolioAdvicePage implements OnInit {
  private subs = new SubSink();
  porfolioAdvices: any[];
  constructor(private profileSvc: ProfileService,
    private navCtrl: NavController,
    private toastService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private loadingServ: LoadingService) { }

  ionViewWillEnter() {
    this.loadingServ.show()
    this.subs.sink = this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      if (res && res.url) {
        this.getPortfolioAdvice(res.url);
      } else {
        this.toastService.show({ message: "Not allowed to this Page", type: "error" });
        this.navCtrl.back();
      }
    });
  }

  ngOnInit() {
    
  }

  getPortfolioAdvice(url){
    this.subs.sink = this.profileSvc.getPorfolioAdvice(url).subscribe((res) => {
      this.loadingServ.hide()
      if(res.statusCode == 0){
        if (res && res.data && res.data.length > 0) {
          this.porfolioAdvices = res.data
        } else {
          console.log("No data found")
        }
      }else{
        console.log(res.error)
      }
    }); 
  }

  portfolioAdviceDetails(data) {
    this.navCtrl.navigateForward((['/tabs/tab3/portfolio-advice-details']), { queryParams: { details: JSON.stringify(data) } });
  }
}
