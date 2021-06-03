import { Component, OnInit, Input, forwardRef, ElementRef, Renderer2 } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from "@angular/forms";

@Component({
  selector: "app-dynamic-input",
  templateUrl: "./dynamic-input.component.html",
  styleUrls: ["./dynamic-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true,
    },
  ],
})
export class DynamicInputComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = "How much amount you too invest ?";
  @Input() inputType: string = null;
  @Input() values: any[] = [];
  @Input() order: number;
  @Input() name: string;
  @Input() id: string;
  @Input() fieldset: string;
  @Input() formGroup: FormGroup;
  @Input() isOrder = false;
  @Input() isFirstDisabled = false;
  @Input() disabled = false;

  value;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private elemRef: ElementRef, private render: Renderer2) {}

  onChanged(value) {
    console.log({ value });
    this.writeValue(value);
  }

  allowNumberOnly(evt) {
    var Num = evt.target.value;
    console.log('Nummdata',evt.data)
    const regExp = new RegExp(/^[0-9,]*$/);
    if (regExp.test(evt.data)) {
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
      var result : string =  x1 + x2;
      if(result.charAt(0) == '.'){
        result = result.slice(1);
      }
      this.render.setValue(this.elemRef.nativeElement, result);
      this.onChange(result || null);
    } else {
      console.log('Num1',Num);
      Num = Num.replace('INR.','') ;
      console.log('Num2',Num);
      console.log(Num.replace(new RegExp(/[^0-9,.]/), ""));
      this.render.setValue(this.elemRef.nativeElement, Num.replace(new RegExp(/[^0-9,.]/), ""));
      this.onChange(Num.replace(new RegExp(/[^0-9,.]/), ""));
    }
  }

  keypressnumber(event) {
    console.log(event);
    // event.preventDefault();
  }
  ngOnInit() {
    console.log(this.formGroup);
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
