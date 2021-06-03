import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-nk-button",
  templateUrl: "./nk-button.component.html",
  styleUrls: ["./nk-button.component.scss"],
})
export class NkButtonComponent implements OnInit {
  @Input() class = "prime-btn";
  @Input() shape = "round";
  @Input() expand = "block";
  @Input() disabled = false;
  @Input() focus = false;
  @Input() loading = false;
  @Output() onClick = new EventEmitter();

  constructor() {}
  ngOnInit() {}

  clicked() {
    console.log("click custom");
    this.onClick.emit();
  }
}
