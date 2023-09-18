import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "src/app/services/login.service";
import { StorageService } from "src/app/services/sotarage.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  public show: boolean = false;
  public showcn:boolean=false
  public resetForm: FormGroup;

  currentUser: any;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private connexion: LoginService,
    private storage: StorageService
  ) {
    this.resetForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
    
  }
  ngOnInit() {}

  sendMail() {
    const email = this.resetForm.value["email"];

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "",
        cancelButton: "",
      },
      heightAuto: false,
    });
    // Utilisez le service pour vérifier les informations de connexion
    this.connexion.forgotPassword(email).subscribe((data) => {
      // console.log("mes donnees", data);

      swalWithBootstrapButtons.fire(
        "",
        `<h1  style='font-size:1em; font-weight: bold;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${data.message}</h1>`,
        "error"
      );
    },(error) => {
      // console.error('Erreur lors de la connexion :', error);
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

}
