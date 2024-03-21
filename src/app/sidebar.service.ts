import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  //Sidebar open service
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  constructor() { }

  toggleSidebar() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
}
