import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //Register service
  registerService(registerObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}createUser` , registerObj);
  }

  //Login service
  loginService(loginObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}userLogin` , loginObj);
  }

  //Forgot password service
  forgotPasswordService(forgotObj: any){
    return this.http.post<any>(`${apiUrls.authServiceApi}forgot-password` , forgotObj);
  }

  //Reset password service
  resetPasswordService(resetObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}reset-password` , resetObj);
  }
}
