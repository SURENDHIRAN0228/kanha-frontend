import { FormGroup } from "@angular/forms"

//Password matching validator
export const confirmPasswordValidator = (controlName : string , controlNameToMatch : string)=>{
    return (FormGroup : FormGroup)=>{
        let control = FormGroup.controls[controlName];
        let controlToMatch = FormGroup.controls[controlNameToMatch];
        if(controlToMatch.errors && !controlToMatch.errors['confirmPasswordValidator']){
            return;
        }
        if(control.value !== controlToMatch.value){
            controlToMatch.setErrors({confirmPasswordValidator : true})
        }
        else{
            controlToMatch.setErrors(null);
        }
    }
}