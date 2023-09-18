import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-stock-market',
  templateUrl: './stock-market.component.html',
  styleUrls: ['./stock-market.component.scss']
})
export class StockMarketComponent {

  public stockMarket = chartData.stockMarket

}
