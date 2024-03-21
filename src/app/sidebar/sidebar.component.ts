import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
  }

  //Profile toggling
  isProfileVisible: boolean = false;

  toggleProfileDetails() {
      this.isProfileVisible = !this.isProfileVisible;
  }

  //Sidebar toggling
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
    const sidebar = document.querySelector('.sidebar')!;
    const btn = document.getElementById('btn')!;
    const btnClose = document.getElementById('btn-close')!;

    sidebar.classList.toggle('open');

    if (sidebar.classList.contains('open')) {
      btn.style.display = 'none';
      btnClose.style.display = 'block';
    } 
    else {
      btn.style.display = 'block';
      btnClose.style.display = 'none';
      sidebar.classList.add('close');
      setTimeout(() => {
          sidebar.classList.remove('close');
      }, 500);
    }
  }

  ngAfterViewInit():void{
    //Revealing animations of profile
    document.addEventListener("DOMContentLoaded", function() {
      const nameElement: HTMLElement | null = document.getElementById('name');
      const emailElement: HTMLElement | null = document.getElementById('email');

      if (nameElement) {
        nameElement.classList.add('reveal-animation');
      }
      if (emailElement) {
        emailElement.classList.add('reveal-animation');
      }
      
    });
  }

}
