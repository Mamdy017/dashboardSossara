import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss']
})
export class ClipboardComponent implements OnInit {

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  cutInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('cut');
    inputElement.setSelectionRange(0, 0);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
