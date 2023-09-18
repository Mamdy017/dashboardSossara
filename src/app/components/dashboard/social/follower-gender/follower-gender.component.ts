import { Component } from "@angular/core";
import * as chartData from "../../../../shared/data/dashboard/social";

@Component({
  selector: "app-follower-gender",
  templateUrl: "./follower-gender.component.html",
  styleUrls: ["./follower-gender.component.scss"],
})
export class FollowerGenderComponent {
  public followerGender = chartData.followerGender;
}
