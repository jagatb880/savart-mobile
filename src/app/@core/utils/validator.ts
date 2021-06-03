import { Injectable } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
@Injectable({
  providedIn: "root",
})
export class ValidatorUtils {
  validateEmail(controls: any) {
    const regExp = new RegExp(
      /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    );
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateEmail: true };
    }
  }

  validatePassword(controls: any) {
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[,.<>/#@$!%*?&])[A-Za-z\d,.<>/#@$!%*?&]{8,}$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validatePassword: true };
    }
  }

  validateOneUppercase(controls: any) {
    const regExp = new RegExp(/^(?=.*[A-Z])[A-Za-z\d,.<>/#@$!%*?&]{1,}$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateOneUppercase: true };
    }
  }
  validateOneLowercase(controls: any) {
    const regExp = new RegExp(/^(?=.*[a-z])[A-Za-z\d,.<>/#@$!%*?&]{1,}$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateOneLowercase: true };
    }
  }

  validateOneNumeric(controls: any) {
    const regExp = new RegExp(/^(?=.*\d)[A-Za-z\d,.<>/#@$!%*?&]{1,}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateOneNumeric: true };
    }
  }

  validateOneSpecialChar(controls: any) {
    const regExp = new RegExp(/^(?=.*[,.<>/#@$!%*?&])[A-Za-z\d,.<>/#@$!%*?&]{1,}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateOneSpecialChar: true };
    }
  }

  validateOnlyNumber(controls: any) {
    const regExp = new RegExp(/^[0-9,.]*$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateOnlyNumber: true };
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
