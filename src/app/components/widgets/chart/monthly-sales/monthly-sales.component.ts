import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.component.html',
  styleUrls: ['./monthly-sales.component.scss']
})
export class MonthlySalesComponent {

  public monthlySales = chartData.monthlySales
}
