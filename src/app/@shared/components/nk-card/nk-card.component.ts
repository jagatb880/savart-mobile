import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-nk-card",
  templateUrl: "./nk-card.component.html",
  styleUrls: ["./nk-card.component.scss"],
})
export class NkCardComponent implements OnInit {
  @Input() label: string;
  @Input() icon: string;
  @Input() disabled = false;
  @Input() background = false;
  @Input() isSelected = false;
  constructor() {}

  ngOnInit() {}
}
