import { Component, OnInit, Input, forwardRef, Renderer2, ElementRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup } from "@angular/forms";

@Component({
  selector: "app-nk-text",
  templateUrl: "./nk-text.component.html",
  styleUrls: ["./nk-text.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NkTextComponent),
      multi: true,
    },
  ],
})
export class NkTextComponent implements OnInit, ControlValueAccessor {
  @Input() type: string;
  @Input() mask;
  @Input() value: any = null;
  @Input() formGroup: FormGroup;
  @Input() placeholder = "";
  @Input() disabled = false;
  @Input() commoa = false;
  @Input() prefix = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private render: Renderer2, private elemRef: ElementRef) {}

  ngOnInit() {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  onInput(event) {
    console.log("onInput", event.target.value);
    console.log("onInput", event);
    console.log("onInput", this.commoa);
    if (this.commoa) {
      var Num = event.target.value;
      console.log({ Num });
      const regExp = new RegExp(/^[0-9,]*$/);
      if (regExp.test(event.data)) {
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
        console.log(result);
        this.value = result;
        this.render.setValue(this.elemRef.nativeElement, result);
        this.onChange(result || null);
      } else {
        console.log(Num);
        let v = Num.replace(new RegExp(/[^0-9,.]/), "");
        console.log(v);
        this.value = v;
        this.onChange(v);
        this.render.setValue(this.elemRef.nativeElement, v);
      }
    } else {
      this.render.setValue(this.elemRef.nativeElement, event.target.value);
      this.value = event.target.value;
      this.onChange(event.target.value);
    }
  }
}
