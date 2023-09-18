import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';


const env = environment.Url_BASE;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      env + '/login',
      {
        email,
        password,
      },
      httpOptions
    );
  }


  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      env + '/reset-password',
      {
        email
      },
      httpOptions
    );
  }

  // forgotPasswordmo(email: string): Observable<any> {
  //   return this.http.post(
  //     env + `/reset/${token}`,{
  //       email
  //     },
  //     httpOptions
  //   );
  // }

  newPassword(token: string,password:string): Observable<any> {
    // const headers = this.getHeaders();
    // console.log(headers);
    return this.http.post(`${env}/reset-password/reset/${token}`,{
      password
    },httpOptions);
  }

  // login2(usernameOrEmail: string, password: string): Observable<any> {
  //   return this.http.post(
  //     'http://localhost:8080/devs/auth/connexion2', /admin/blog/update/{id} / delete/{id}

  //     {
  //       usernameOrEmail,
  //       password,
  //     },
  //     httpOptions
  //   );
  // }

  logout(): Observable<any> {
    const req = new HttpRequest('POST', env + 'signout', {}, httpOptions);
    return this.http.request(req);
  }

}


