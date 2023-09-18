import { Component } from '@angular/core';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent {

  constructor() {}

  public currencies = [
    {
      colorClass: "warning",
      icon: "beta",
      currenciesName: "Bitcoin",
      price: "13,098.09",
      growth: "5.90",
      arrow: "trending-up",
      totalBalance: "64,100.066",
      totalCoin: "1.09634721"
    },
    {
      colorClass: "success",
      icon: "ltc",
      currenciesName: "Litecoin",
      price: "11,098.04",
      growth: "2.90",
      arrow: "trending-down",
      totalBalance: "87,897.098",
      totalCoin: "1.09675432"
    },
    {
      colorClass: "primary",
      icon: "eth",
      currenciesName: "Eathereum",
      price: "45,198.09",
      growth: "0.12",
      arrow: "trending-up",
      totalBalance: "45,178.010",
      totalCoin: "1.41557127"
    },
    {
      colorClass: "secondary",
      icon: "bin",
      currenciesName: "Bitcoin",
      price: "35,098.34",
      growth: "3.56",
      arrow: "trending-up",
      totalBalance: "64,100.066",
      totalCoin: "1.78142254"
    },
    {
      colorClass: "dark-green",
      icon: "te",
      currenciesName: "Tether",
      price: "56,898.91",
      growth: "1.23",
      arrow: "trending-down",
      totalBalance: "61,574.218",
      totalCoin: "1.574215"
    },

    
  ]
}
