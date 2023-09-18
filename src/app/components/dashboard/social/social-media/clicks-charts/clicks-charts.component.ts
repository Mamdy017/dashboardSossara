import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-clicks-charts',
  templateUrl: './clicks-charts.component.html',
  styleUrls: ['./clicks-charts.component.scss']
})
export class ClicksChartsComponent {
  @Input() data:any
  public show: boolean = false

  toggle() {
    this.show = !this.show
  }
}
