import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { StorageService } from "../../services/sotarage.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public newUser = false;
  public loginForm: FormGroup;
  public show: boolean = false;
  public errorMessage: any;
  messageErreur = "";
  status: any;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private connexion: LoginService,
    private storage: StorageService
  ) {
    // Initialisation du formulaire de connexion
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnInit() {}

  // Fonction de connexion
  login() {
    const email = this.loginForm.value["email"];
    const password = this.loginForm.value["password"];

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "",
        cancelButton: "",
      },
      heightAuto: false,
    });

    // Utilisation du service de connexion pour vérifier les informations de connexion
    this.connexion.login(email, password).subscribe(
      (data) => {
        // Vérification si les informations de connexion sont correctes.
        if (data && data.success === true) {
          // Les informations de connexion sont correctes, vous pouvez rediriger l'utilisateur vers la page appropriée.
          // Par exemple, en fonction du rôle de l'utilisateur, vous pouvez le rediriger vers "/dashboard/admin" ou "/dashboard/super-admin".
        } else {
          // Les informations de connexion sont incorrectes, affichage d'un message d'erreur.
          this.storage.enregistrer(data);
          this.storage.connexionReussi();
          this.currentUser = this.storage.recupererUser();

          if (
            this.currentUser.user.role.includes("ROLE_ADMIN") ||
            this.currentUser.user.role.includes("ROLE_SUPER_ADMIN")
          ) {
            if (this.currentUser.user.role.includes("ROLE_ADMIN")) {
              this.router.navigate(["/dashboard/admin"]);
            } else if (this.currentUser.user.role.includes("ROLE_SUPER_ADMIN")) {
              this.router.navigate(["/dashboard/super-admin"]);
            }
          } else {
            // L'utilisateur n'a pas les autorisations nécessaires, affichage d'un message d'erreur.
            swalWithBootstrapButtons.fire(
              "",
              `<h1  style='font-size:1em; font-weight: bold;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</h1>`,
              "error"
            );
          }
        }
      },
      (error) => {
        // Gestion des erreurs lors de la connexion
        console.error('Erreur lors de la connexion :', error);
        const errorMessage = error.error && error.error.message ? error.error.message : "une erreur s'est produite";
        // Utilisation de errorMessage comme vous le souhaitez, par exemple, affichage à l'utilisateur.
        swalWithBootstrapButtons.fire(
          "",
          `<h1  style='font-size:1em; font-weight: bold;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
          "error"
        );
      });
  }

  // Fonction pour afficher/masquer le mot de passe
  showPassword() {
    this.show = !this.show;
  }
}
