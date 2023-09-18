import { Component } from "@angular/core";
import * as chartData from "../../../../../shared/data/dashboard/crypto";

@Component({
  selector: "app-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.scss"],
})
export class PortfolioComponent {
  public portfolio = chartData.portfolio;
  public show: boolean = false;

  toggle(){
    this.show = !this.show
  }
}
 