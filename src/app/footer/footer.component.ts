import { Component } from '@angular/core';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  //Sidebar open
  isSidebarOpen: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(){
    //Sidebar open
    this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
  }

}
