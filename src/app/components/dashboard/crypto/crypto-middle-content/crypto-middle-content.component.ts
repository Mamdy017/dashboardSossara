import { Component } from '@angular/core';
import * as data from '../../../../shared/data/dashboard/crypto'
@Component({
  selector: 'app-crypto-middle-content',
  templateUrl: './crypto-middle-content.component.html',
  styleUrls: ['./crypto-middle-content.component.scss']
})
export class CryptoMiddleContentComponent {

  public Bitcoin = data.Bitcoin
  public Ethereum = data.Ethereum
  public LeaveTravel = data.LeaveTravel
}
