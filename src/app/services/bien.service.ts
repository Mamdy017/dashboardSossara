import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageService } from "./sotarage.service";

const env = environment.Url_BASE;

@Injectable({
  providedIn: "root",
})
export class BienService {
  // storageService: any;
  constructor(private http: HttpClient,  private storageService: StorageService) {}

  private accessToken : string ;

  setAccessToken(token:string){
    this.accessToken = token
  }

  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  //afficher tous les biens
  allBien(): Observable<any> {
    return this.http.get(`${env}/bien/immo`);
  }
  // allBien(): Observable<any> {
  //   return this.http.get(`${env}/bien/immo/all`); admin/blog/add
  // }

      //AJOUTER UN BIEN
      registerBien(
        commodite: [],
        type: number,
        commune: number,
        nb_piece: number,
        nom: string,
        chambre: number,
        cuisine: number,
        toilette: number,
        surface: number,
        prix: number,
        statut: string,
        description: string,
        quartier: string,
        rue: string,
        porte: number,
        periode: number,
        longitude: number,
        latitude: number,
        photos: File[],
        // photo: File // Liste de photos
      ): Observable<any> {
        const headers = this.getHeaders();
        headers.append('Content-Type', 'multipart/form-data');
       
        const formData = new FormData();
  
        commodite.forEach(i => { formData.append('commodite[]', i) });
        formData.append('type', type.toString());
        formData.append('commune', commune.toString());
        formData.append('nb_piece', nb_piece.toString());
        formData.append('nom', nom);
        formData.append('chambre', chambre.toString());
        formData.append('cuisine', cuisine.toString());
        formData.append('toilette', toilette.toString());
        formData.append('surface', surface.toString());
        formData.append('prix', prix.toString());
        formData.append('statut', statut);
        formData.append('description', description);
        formData.append('quartier', quartier);
        formData.append('rue', rue);
        formData.append('porte', porte.toString());
        // Si le statut est "A vendre", définissez la période sur 6
        if (statut === "A vendre") {
          formData.append('periode', '6');
        } else {
          formData.append('periode', periode.toString());
        }
        formData.append('longitude', longitude.toString());
        formData.append('latitude', latitude.toString());
        photos.forEach(p => { formData.append('photo[]', p) });
  
        return this.http.post(
          env + '/bien/immo/new',
          formData,
          { headers }
        );
      }
      commodite(): Observable<any> {
        return this.http.get(env+`/type/immo`);
      }

        // admin/bien/imo/get/rent
        // admin/bien/imo/get/sale
  
        
    bienVendu(): Observable<any> {
      const headers = this.getHeaders();
      console.log(headers);
      return this.http.get(`${env}/admin/bien/immo/get/sell`, {headers});
    }
    bienLouer(): Observable<any> {
      const headers = this.getHeaders();
      console.log(headers);
      return this.http.get(`${env}/admin/bien/immo/get/rent`, {headers});
    }
}
