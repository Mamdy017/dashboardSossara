import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-turn-over',
  templateUrl: './turn-over.component.html',
  styleUrls: ['./turn-over.component.scss']
})
export class TurnOverComponent {

  public turnOver = chartData.turnOver

}
