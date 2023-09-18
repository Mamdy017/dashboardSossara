import { Component } from "@angular/core";
import * as data from "../../../../../shared/data/dashboard/crypto";
@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
})
export class TransactionsComponent {
  public openTab: string = "All";
  public transactions = data.transactions;
  public filterData = this.transactions;
  constructor() {}

  public tabbed(val: string) {
    this.openTab = val;
    this.filterData =
      val !== "All"
        ? this.transactions.filter((data: any) => {
            return data.type == this.openTab ? true : false;
          })
        : this.transactions;
  }
}
