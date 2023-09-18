import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { StorageService } from "src/app/services/sotarage.service";
@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private storage: StorageService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Récupérer l'utilisateur depuis votre service ou votre stockage
    let user = this.storage.recupererUser();
    
    // if (user.user.role === user.user.role["ROLE_ADMIN"]) {
    //   // Utilisateur non connecté, redirigez-le vers la page de connexion
    //   this.router.navigate(["/auth/login"]);
    //   console.log("guard", user)
    //   return false; // Empêche la navigation à la nouvelle URL
    // } else if(!user || user === null ) {
    //   // L'utilisateur est un administrateur, redirigez-le vers la page de connexion
    //   this.router.navigate(["/auth/login"]);
    //   return false; // Empêche la navigation à la nouvelle URL
    // }
    // const user = this.storage.recupererUser();
    if (user && (user.user.role.includes('ROLE_ADMIN') || user.user.role.includes('ROLE_SUPER_ADMIN'))) {
      return true;
    } else {
      // this.route.navigate(['/']);
      // location.reload();
      // setInterval(() => {
      //   location.reload();
      // }, 10);
      return false;
    }
    
    // Pour les utilisateurs non administrateurs, autorisez la navigation
    return true;
  }
  



    // const user = this.storage.recupererUser();
    // if (user && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('adminuser'))) {
    //   return true;
    // } else {
    //   // this.route.navigate(['/']);
    //   location.reload();
    //   setInterval(() => {
    //     location.reload();
    //   }, 10);
    //   return false;
    // }


  }
