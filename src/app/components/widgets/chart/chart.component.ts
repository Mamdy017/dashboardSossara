import { Component, OnInit } from '@angular/core';
import * as chartData from '../../../shared/data/widget/chart'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  public optionslinechart = chartData.optionslinechart
  public chart2 = chartData.chart2
  public chart3 = chartData.chart3
  constructor() { }

  ngOnInit(): void {
  }

}
