import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ContactService } from "@service/contact.service";
import { LoadingService } from "@service/loading.service";
import { ToastrService } from "@service/toastr.service";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.page.html",
  styleUrls: ["./faq.page.scss"],
})
export class FaqPage implements OnInit, AfterViewChecked {
  faqList: any[] = [];
  constructor(
    private contactService: ContactService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getFAQ();
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getFAQ() {
    this.loadingService.show();
    this.contactService.getFAQ().subscribe((res) => {
      this.loadingService.hide();
      if (res.statusCode === 0) {
        this.faqList = res.data || [];
      } else {
        this.toastrService.show({ message: res.data, type: "error" });
      }
    });
  }

  expandItem(item, id): void {
    console.log(item, id);
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.faqList.map((res) => {
        res.questions.map((listItem) => {
          if (item == listItem) {
            listItem.expanded = !listItem.expanded;
          } else {
            listItem.expanded = false;
          }
          let scroolll = document.getElementById(id);
          if (scroolll) {
            scroolll.scrollIntoView({ behavior: "smooth", block: "end" });
          }
          return listItem;
        });
        return res;
      });
    }
  }
}
