import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  constructor(private fb:FormBuilder, private router:Router, private toastr:ToastrService, private authService:AuthService){}

  registerForm !: FormGroup;

  ngOnInit(): void {
    //Register form Validations
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  //Password visibility
  visible:boolean = true;
  changetype:boolean = true;


  viewPass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  //Register button click
  register(){
    this.authService.registerService(this.registerForm.value)
    .subscribe({
      next:(res)=>{
        this.toastr.success('User Created Successfully !');
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }  

}
