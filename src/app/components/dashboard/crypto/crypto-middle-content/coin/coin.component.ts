import { Component, Input } from "@angular/core";

@Component({
  selector: "app-coin",
  templateUrl: "./coin.component.html",
  styleUrls: ["./coin.component.scss"],
})
export class CoinComponent {
  @Input() data: any;
}
