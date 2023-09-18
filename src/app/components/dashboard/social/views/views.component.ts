import { Component } from "@angular/core";
import * as chartData from "../../../../shared/data/dashboard/social";
@Component({
  selector: "app-views",
  templateUrl: "./views.component.html",
  styleUrls: ["./views.component.scss"],
})
export class ViewsComponent {
  public views = chartData.views;
  public show: boolean = false;

  toggle() {
    this.show = !this.show;
  }
}
