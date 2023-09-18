import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-live-products',
  templateUrl: './live-products.component.html',
  styleUrls: ['./live-products.component.scss']
})
export class LiveProductsComponent {

  public liveProducts = chartData.liveProducts
}
