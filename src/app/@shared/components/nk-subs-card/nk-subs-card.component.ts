import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-nk-subs-card",
  templateUrl: "./nk-subs-card.component.html",
  styleUrls: ["./nk-subs-card.component.scss"],
})
export class NkSubsCardComponent implements OnInit {
  @Input() profile: FormGroup;
  @Input() planUpgrad = false;
  @Output() selectedButton = new EventEmitter();
  @Output() upgradeButton = new EventEmitter();
  @Output() inputPriceEmit = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  buttonEmit(event) {
    console.log(this.profile.value);
    console.log({ event });
    this.selectedButton.emit(event);
  }

  buttonEmitUpgrade(event) {
    console.log(this.profile.value);
    console.log({ event });
    this.upgradeButton.emit(event);
  }
}
