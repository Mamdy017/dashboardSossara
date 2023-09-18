import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-common-top-chart',
  templateUrl: './common-top-chart.component.html',
  styleUrls: ['./common-top-chart.component.scss']
})
export class CommonTopChartComponent {

  @Input() data:any
}
