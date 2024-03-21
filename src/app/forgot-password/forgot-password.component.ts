import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  constructor(private fb:FormBuilder, private router:Router, private toastr:ToastrService, private authService:AuthService){}

  forgotForm !: FormGroup;

  ngOnInit(): void {
    //Forgot form validations
    this.forgotForm = this.fb.group({
      email : ['' , Validators.compose([Validators.required , Validators.email])],
    })
  }

  //Submit button click
  submit(){
    this.authService.forgotPasswordService(this.forgotForm.value)
    .subscribe({
      next:(res)=>{
        if(res.status == true) {
          this.toastr.success('Email Sent Successfully Kindly Check your email !');
          this.forgotForm.reset();
          this.router.navigate(['/login']);
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
