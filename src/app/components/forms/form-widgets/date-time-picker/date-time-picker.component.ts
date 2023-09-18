import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit {
  model: NgbDateStruct;
  today = this.calendar.getToday();
  time
  times: boolean = false;

  public min = new Date(2018, 1, 12, 10, 30);
  public max = new Date(2018, 3, 21, 20, 30);
  constructor(private calendar: NgbCalendar) { }
  ngOnInit(): void {
  }
  toggled() {
    this.times = !this.times
  }
}
