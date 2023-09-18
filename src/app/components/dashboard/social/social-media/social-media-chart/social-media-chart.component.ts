import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-social-media-chart',
  templateUrl: './social-media-chart.component.html',
  styleUrls: ['./social-media-chart.component.scss']
})
export class SocialMediaChartComponent {

  @Input() data: any
}
