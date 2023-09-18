import { Component, OnInit } from '@angular/core';
import * as chartData from './../../../shared/data/chart/apex';

@Component({
  selector: 'app-apex-chart',
  templateUrl: './apex-chart.component.html',
  styleUrls: ['./apex-chart.component.scss']
})
export class ApexChartComponent implements OnInit {
  
  public splineArea1 = chartData.splineArea1;
  public splineArea2 = chartData.splineArea2;
  public column = chartData.column;
  public pie = chartData.pie;
  public bubble1 = chartData.bubble1;
  public radial = chartData.radial;
  public candelStick = chartData.candelStick;
  public radar = chartData.radar;
  public stepLine = chartData.stepLine;
  public bar = chartData.bar;
  public lineWithAnnotation = chartData.lineWithAnnotation;
  public donut = chartData.donut;
  public mixed = chartData.mixed;

  constructor() { }

  ngOnInit(): void {
  }

}
