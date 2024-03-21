import { Component , OnInit, inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { confirmPasswordValidator } from '../validators/confirm-password.validators';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  constructor(private fb:FormBuilder, private router:Router, private toastr:ToastrService, private authService:AuthService){}

  activatedRoute = inject(ActivatedRoute);
  resetForm !: FormGroup;
  token !: string;

  ngOnInit(): void {
    //Reset form validations
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword : ['' , Validators.required]
    },
    {
      //Custom Validator
      validator : confirmPasswordValidator('password' , 'confirmPassword')
    }
    );
    this.activatedRoute.params.subscribe(val=>{
      this.token = val['token'];
    })
  }

  //Password visibility
  visible : boolean = true;
  changetype : boolean = true

  viewPass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  //Confirm password visibility
  confirmVisible : boolean = true;
  confirmChangetype : boolean = true;

  viewConfirmPass(){
    this.confirmVisible = !this.confirmVisible;
    this.confirmChangetype = !this.confirmChangetype;
  }

  //Change password button click
  reset(){
    let resetObj = {
      token : this.token,
      password : this.resetForm.value.password
    }
    this.authService.resetPasswordService(resetObj)
    .subscribe({
      next:(res)=>{
        if(res.status == true ) {
          this.toastr.success('Password Changed Successfully Kindly Login with your New Password');
          this.resetForm.reset();
          this.router.navigate(['/login'])
        }
        else {
          this.toastr.success(res.message);
        }
        
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
