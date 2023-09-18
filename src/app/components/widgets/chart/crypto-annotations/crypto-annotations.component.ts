import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-crypto-annotations',
  templateUrl: './crypto-annotations.component.html',
  styleUrls: ['./crypto-annotations.component.scss']
})
export class CryptoAnnotationsComponent {
  public cryptoAnnotations = chartData.cryptoAnnotations
}
