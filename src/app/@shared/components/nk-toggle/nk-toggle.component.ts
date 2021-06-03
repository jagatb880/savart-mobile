import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup } from "@angular/forms";

@Component({
  selector: "app-nk-toggle",
  templateUrl: "./nk-toggle.component.html",
  styleUrls: ["./nk-toggle.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NkToggleComponent),
      multi: true,
    },
  ],
})
export class NkToggleComponent implements OnInit, ControlValueAccessor {
  @Input() value: any = null;
  @Input() disabled = false;
  @Output() ionChange = new EventEmitter();
  @Input() formGroup: FormGroup;

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

  onChanged(value) {
    console.log(value);
    this.onChange(value);
    this.ionChange.emit(value);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
