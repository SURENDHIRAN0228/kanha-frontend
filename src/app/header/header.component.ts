import { Component } from '@angular/core';
import { SidebarService } from '../sidebar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  //Sidebar open
  isSidebarOpen: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    //Sidebar open
    this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

  //Notification toggling
  isNotificationVisible: boolean = false;

  toggleNotification() {
    this.isNotificationVisible = !this.isNotificationVisible;
  }

}
