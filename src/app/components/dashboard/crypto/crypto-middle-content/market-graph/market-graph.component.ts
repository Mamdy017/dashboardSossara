import { Component } from '@angular/core';
import * as chartData from '../../../../../shared/data/dashboard/crypto'
@Component({
  selector: 'app-market-graph',
  templateUrl: './market-graph.component.html',
  styleUrls: ['./market-graph.component.scss']
})
export class MarketGraphComponent {

  public marketChart = chartData.marketChart
}
