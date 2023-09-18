import { Component } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {

  public show: boolean = false

  toggle() {
    this.show = !this.show
  }
  public activities = [
    {
      profile: "assets/images/dashboard/user/3.jpg",
      name: "Anna K.",
      to: "0x187...12bb",
      count: "+0.3BNB",
      count2: "29.09.22",
      className: "success"
    },
    {
      profile: "assets/images/dashboard/user/12.jpg",
      name: "	Guy Hawkins",
      to: "0x187...12bb",
      count: "-0.3BNB",
      count2: "29.09.22",
      className: "danger"
    },
    {
      profile: "assets/images/dashboard/user/10.jpg",
      name: "Jenny Wilson",
      to: "0x187...12bb",
      count: "+0.4ANB",
      count2: "29.09.22",
      className: "success"
      
    },
    {
      profile: "assets/images/dashboard/user/11.jpg",
      name: "Jacob B.",
      to: "0x187...12bb",
      count: "-0.1ANA",
      count2: "29.09.22",
      className: "danger"

    },
    {
      profile: "assets/images/dashboard/user/13.jpg",
      name: "Esther Howard",
      to: "0x187...12bb",
      count: "+0.5BNV",
      count2: "29.09.22",
      className: "success"

    },
    {
      profile: "assets/images/dashboard/user/5.jpg",
      name: "Leslie Alexander",
      to: "0x187...12bb",
      count: "+0.3BNB",
      count2: "29.09.22",
      className: "success"

    },
  ]
}
