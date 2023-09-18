import { Component } from '@angular/core';
import * as chartData from '../../../../../shared/data/dashboard/social'
@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent {

  public subscriberChart = chartData.subscriberChart
  public show: boolean = false

  toggle() {
    this.show = !this.show
  }
}
