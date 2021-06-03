import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-nk-radio",
  templateUrl: "./nk-radio.component.html",
  styleUrls: ["./nk-radio.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NkRadioComponent),
      multi: true,
    },
  ],
})
export class NkRadioComponent implements OnInit, ControlValueAccessor {
  @Input() name: string;
  @Input() id: string;
  @Input() values: any[] = [];
  @Input() fieldset: string;
  @Input() order: number;
  @Output() ionChange = new EventEmitter();
  @Input() value = null;
  @Input() disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {}

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
}
