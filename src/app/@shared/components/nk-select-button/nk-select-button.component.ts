import { Component, OnInit, Input, forwardRef, EventEmitter, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "app-nk-select-button",
  templateUrl: "./nk-select-button.component.html",
  styleUrls: ["./nk-select-button.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NkSelectButtonComponent),
      multi: true,
    },
  ],
})
export class NkSelectButtonComponent implements OnInit, ControlValueAccessor {
  @Input() isSelected = false;
  @Input() isRenewal = false;
  @Input() disabled = false;
  @Input() content = "Select";
  @Input() color = "primary";

  @Output() onEmit = new EventEmitter();

  value;

  constructor() {}

  onChange: any = () => {};
  onTouched: any = () => {};

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

  onButtonSelect() {
    // this.priceType = this.priceType === "P" ? "F" : "P";
    this.onChange(this.isSelected);
    this.onEmit.emit(this.isSelected === true ? false : true);
  }
}
