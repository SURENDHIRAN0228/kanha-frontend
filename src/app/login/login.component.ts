import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private fb:FormBuilder, private router:Router, private toastr:ToastrService, private authService:AuthService){}

  loginForm !: FormGroup;

  ngOnInit(): void {
    //Login form validations
    this.loginForm = this.fb.group({
      email : ['' , Validators.compose([Validators.required , Validators.email])],
      password : ['' , Validators.required]
    });
  }

  //Password visibility
  visible:boolean = true;
  changetype:boolean = true;

  viewPass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  //Login button click
  login(){
    this.authService.loginService(this.loginForm.value)
    .subscribe({
      next:(res)=>{
        if(res.status == true) {
          this.toastr.success('User Logged In Successfully !');
          this.loginForm.reset();
          this.router.navigate(['']);
        }
        else {
          this.toastr.error(res.message);
        }
        
        
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
