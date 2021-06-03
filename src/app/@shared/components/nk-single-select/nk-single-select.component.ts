import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "app-nk-single-select",
  templateUrl: "./nk-single-select.component.html",
  styleUrls: ["./nk-single-select.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NkSingleSelectComponent),
      multi: true,
    },
  ],
})
export class NkSingleSelectComponent implements OnInit, ControlValueAccessor {
  @Input() list: any[] = [];
  @Input() interfaceOptions: any = null;
  @Input() placeholder: string;
  @Input() interface: string = "alert";
  @Input() multiple = false;
  @Input() disabled = false;
  @Output() ionChange = new EventEmitter();
  @Input() value = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  customAlertOptions: any = {
    header: "Select",
    translucent: true,
  };

  constructor() {}

  ngOnInit() {}

  onChanged(e) {
    console.log(e);
    this.onChange(e.detail.value);
    this.ionChange.emit(e);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
