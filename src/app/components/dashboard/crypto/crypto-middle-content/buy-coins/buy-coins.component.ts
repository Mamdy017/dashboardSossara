import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AgencesService } from "src/app/services/agences.service";

@Component({
  selector: "app-buy-coins",
  templateUrl: "./buy-coins.component.html",
  styleUrls: ["./buy-coins.component.scss"],
})
export class BuyCoinsComponent implements OnInit {
  public show: boolean = false;
  public addBlog: FormGroup;

  constructor(
      private fb: FormBuilder,
      public router: Router,
      private agence: AgencesService
  ) {
    this.addBlog = this.fb.group({
      titre: ["", [Validators.required]],
      description: ["", Validators.required],
      photo: new FormControl(""),
      fileSource: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  toggle() {
    this.show = !this.show;
  }
  onFileChangePhoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addBlog.patchValue({
        fileSource: file,
      });
      console.log("photo", event.photo);
    }
  }

  ajouterBlock() {
    const formData = new FormData();
    formData.append("titre", this.addBlog.value.titre);
    formData.append("description", this.addBlog.value.description);
    formData.append("photo", this.addBlog.value.fileSource);

    console.log("mes donnees", formData);
    console.log(this.addBlog.value.titre)
    alert(this.addBlog.value.fileSource.name)
    alert( this.addBlog.value.description)
    this.agence.AjouterBlog(formData).subscribe((data: any) => {
      this.ajouterBlock = data;
      this.addBlog.reset();
    });
  }
  // reset() {
  //   this.addBlog.reset();
  // }
}
