import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MessageStatus } from "@core/constants/constants";
import { NavController } from "@ionic/angular";
import { Store } from "@ngxs/store";
import { InboxService } from "@service/inbox.service";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";
import { SetNotificationCount } from "@store/actions/common.action";
import { SubSink } from "subsink";

@Component({
  selector: "app-inbox",
  templateUrl: "./inbox.page.html",
  styleUrls: ["./inbox.page.scss"],
})
export class InboxPage implements OnInit, OnDestroy, AfterViewChecked {
  segmentValue = "All";
  messageList: any[] = [];
  unReadMessageList: any[] = [];

  private subs = new SubSink();

  constructor(
    private inboxService: InboxService,
    private navCtrl: NavController,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private cdk: ChangeDetectorRef,
    private store: Store
  ) {}

  ngOnInit() {
    this.segmentValue = "All";
  }

  ngAfterViewChecked() {
    this.cdk.detectChanges();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ionViewWillEnter() {
    this.getNotifications();
  }

  async doRefresh(event) {
    console.log(event);
    await this.getNotifications(event);
  }

  getNotifications(event?: any) {
    this.loadingService.show();
    this.subs.sink = this.inboxService.getNotifications().subscribe((res) => {
      console.log(res);
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.messageList = res.data || [];
        this.unReadMessageList = res.data.filter((val) => val.status == MessageStatus.NEW) || [];
        this.store.dispatch(new SetNotificationCount(this.unReadMessageList.length || ""));
        if (event) {
          event.target.complete();
        }
      } else {
        this.toastrService.show({ message: res.data + "\n " + res.error, type: "error" });
      }
    });
  }

  open(item) {
    console.log(item);
    if(item.subject.includes('Subscription Expired')){
      item.msgbody = item.msgbody.replace('href=\"subscription\"','onclick="Window.myComponent.navigateNewInvestigate()"')
    }else if(item.subject.includes('Subscription')){
      try {
        let exp = /href=(["|'])(.*)\1/.exec(item.msgbody)[2]
        let splitUrl = exp.split("target")[0]
        let trimUrl = splitUrl.trim();
        let replaceUrl = trimUrl.replace('"','');
        let finalUrl = replaceUrl.trim();
        let a  = item.msgbody.replace(/<[^>]+>/g, '');
        item.msgbody = a.replace('Click here','<a onclick="Window.myComponent.openLinkInPdf()"><u>Click here</u></a>');
        item["url"] = finalUrl;
      } catch (error) {
        let a  = item.msgbody.replace(/<[^>]+>/g, '');
        item.msgbody = a.replace('Click here','<a onclick="Window.myComponent.openLinkInPdf()"><u>Click here</u></a>');
        item["url"] = "";
      }
    }
    if (item.status === MessageStatus.NEW) {
      this.loadingService.show();
      this.subs.sink = this.inboxService.readNotifications({ data: { msg_id: item.id } }).subscribe((res) => {
        console.log({ res });
        this.loadingService.hide();
        if (res.statusCode === 0) {
          this.navCtrl.navigateForward("/tabs/tab3/message", { queryParams: item });
        } else {
          this.toastrService.show({ message: res.data + "\n " + res.error, type: "error" });
        }
      });
    } else {
      this.navCtrl.navigateForward("/tabs/tab3/message", { queryParams: item });
    }
  }

  async segmentChanged(event) {
    console.log(event);
  }
}
