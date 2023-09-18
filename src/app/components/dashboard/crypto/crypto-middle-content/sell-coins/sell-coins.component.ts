import { Component } from '@angular/core';

@Component({
  selector: 'app-sell-coins',
  templateUrl: './sell-coins.component.html',
  styleUrls: ['./sell-coins.component.scss']
})
export class SellCoinsComponent {

  public show: boolean = false

  toggle() {
    this.show =  !this.show
  }
}
