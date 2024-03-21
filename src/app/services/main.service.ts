import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient ) { }

  //Creating asset service
  assetService(assetObj:any){
    return this.http.post<any>(`${apiUrls.mainServiceApi}create` , assetObj);
  }

  //Fetching asset service
  assetServiceGet(){
    return this.http.get<any>(`${apiUrls.mainServiceApi}`);
  }

  //Single delete asset service
  assetServiceDelete(data: any) {
    return this.http.delete<any>(`${apiUrls.mainServiceApi}delete/${data}`);
  } 
  
  //Updating asset service
  assetServiceUpdate(data: any, assetObj:any) {
    return this.http.post<any>(`${apiUrls.mainServiceApi}update/${data}`, assetObj);
  } 

  //Uploading file asset service
  assetServiceFileUpload(assetObj:any){
    return this.http.post<any>(`${apiUrls.mainServiceApi}import` , assetObj);
  }
  
  //Multiple delete asset service
  deleteRows(ids: number[]): Observable<any> {
    return this.http.delete<any>(`${apiUrls.mainServiceApi}/delete-rows`, { body: { ids } });
  }
  
}
