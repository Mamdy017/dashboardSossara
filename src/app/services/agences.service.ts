import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageService } from "./sotarage.service";
import { log } from "console";

const env = environment.Url_BASE;
@Injectable({
  providedIn: "root",
})
export class AgencesService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // Méthode pour ajouter le token JWT aux en-têtes
  // Méthode pour ajouter le token JWT aux en-têtes
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  //afficher tous les agences
  allAgence(): Observable<any> {
    return this.http.get(`${env}/user/agence/get`);
  }

  //AFFICHER UN AGENT EN FONCTION DE SON ID
  AfficherAgentParId(id: number): Observable<any> {
    return this.http.get(`${env}/bien/immo/user/agent/get/${id}`);
  }

  //AFFICHER UNE AGENCE EN FONCTION DE SON ID
  AfficherAgenceParId(id: number): Observable<any> {
    return this.http.get(`${env}/bien/immo/user/child/get/${id}`);
  }

  //AFFICHER LA LISTE DES AGENTS EN FONCTION DE L'ID DE AGENCE
  AfficherListeAgentParAgence(id: number): Observable<any> {
    return this.http.get(`${env}/user/child/get/${id}`);
  }

  AfficherListeLouer(): Observable<any> {
    return this.http.get(`${env}/bien/immo/get/rent/all`);
  }

  AfficherListeAgentParSell(): Observable<any> {
    return this.http.get(`${env}/bien/immo/get/sell/all`);
  }

  AfficherListeAgentAll(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    return this.http.get(`${env}/admin/user/agent/get`, { headers });
  }

  

  SupprimerAgent(id: number): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    return this.http.post(`${env}/admin/user/child/delete/${id}`,null, {headers});
  }

  AjouterBlog(formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    return this.http.post(`${env}/admin/blog/add`,formData, {headers});
  }

    //afficher tous les blogs
    blog(): Observable<any> {
      return this.http.get(`${env}/blog`);
    }

    SupprimerBlog(id: number): Observable<any> {
      const headers = this.getHeaders();
      console.log(headers);
      return this.http.post(`${env}/admin/blog/delete/${id}`,null, {headers});
    }

    modifierBlog(id: number,formData: FormData): Observable<any> {
      const headers = this.getHeaders();
      console.log(headers);
      return this.http.post(`${env}/admin/blog/update/${id}`,formData, {headers});
    }


}
