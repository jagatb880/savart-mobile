import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appNumcomma]",
})
export class NumcommaDirective {
  constructor(public elemRef: ElementRef, public render: Renderer2) {}

  @HostListener("input", ["$event"])
  onInput($event) {
    var Num = $event.target.value;
    console.log(Num);
    Num += "";
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    var x = Num.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) x1 = x1.replace(rgx, "$1" + "," + "$2");
    var result = x1 + x2;
    console.log(x1 + x2);
    console.log(result);
    this.render.setValue(this.elemRef.nativeElement, result);
    console.log(this.elemRef.nativeElement);
  }
}
