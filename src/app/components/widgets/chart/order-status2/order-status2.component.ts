import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-order-status2',
  templateUrl: './order-status2.component.html',
  styleUrls: ['./order-status2.component.scss']
})
export class OrderStatus2Component {

  public orderStatus2 = chartData.orderStatus2 
}
