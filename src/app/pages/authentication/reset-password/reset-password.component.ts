import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "src/app/services/login.service";
import { StorageService } from "src/app/services/sotarage.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  public show: boolean = false;
  public showcn: boolean = false;

  public newPassword: FormGroup;
  currentUser: any;
  token: any;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private connexion: LoginService,
    private storage: StorageService,
    private routes: ActivatedRoute
  ) {
    this.newPassword = this.fb.group({
      password: ["", Validators.required],
      cnPpassword: ["", Validators.required],
    });
  }
  ngOnInit() {}

  resetPassword() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "",
        cancelButton: "",
      },
      heightAuto: false,
    });
    this.token = this.routes.snapshot.params["token"];
    const password = this.newPassword.value["password"];
    console.log(this.token);
    this.connexion.newPassword(this.token, password).subscribe((data) => {
      // console.log("mes donnees", data);
      if(data.message=="erreur"){
        swalWithBootstrapButtons.fire(
          "",
          `<h1  style='font-size:1em; font-weight: bold;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${data.message}</h1>`,
          "error"
        );
      }else{
        swalWithBootstrapButtons.fire(
          "",
          `<h1  style='font-size:1em; font-weight: bold;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${data.message}</h1>`,
          "success"
        );
        this.router.navigate(["/auth/login"]);
      }
    },(error) => {
      console.error('Erreur lors de la connexion :', error);
      const errorMessage = error.error && error.error.message ? error.error.message : 'Erreur inconnue';
      // Utilisez errorMessage comme vous le souhaitez, par exemple, l'afficher à l'utilisateur.
      
      swalWithBootstrapButtons.fire(
        "",
        `<h1  style='font-size:1em; font-weight: bold;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
        "error"
      );
      // console.log(errorMessage);
    });
  }
  showPassword() {
    this.show = !this.show;
  }
  showCnPassword() {
    this.showcn = !this.showcn;
  }
}
