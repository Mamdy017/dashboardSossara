import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-cryptocurrency-prices',
  templateUrl: './cryptocurrency-prices.component.html',
  styleUrls: ['./cryptocurrency-prices.component.scss']
})
export class CryptocurrencyPricesComponent {

  public cryptocurrencyPrices = chartData.cryptocurrencyPrices
}
