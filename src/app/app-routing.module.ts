import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetManageComponent } from './asset-manage/asset-manage.component';
import { AssetManagementComponent } from './asset-management/asset-management.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  // {path : '' , component : AssetManageComponent}
  {path : '' , component : AssetManagementComponent},
  {path : 'register' , component : RegisterComponent},
  {path : 'login' , component : LoginComponent},
  {path : 'forgot' , component : ForgotPasswordComponent},
  {path : 'reset/:token' , component : ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
