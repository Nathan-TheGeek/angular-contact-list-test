export interface FieldValidation {
  isValid?: boolean;
  errorMsg?: string;
  customValidation?: (name: string, value: any) => FieldValidationResult;
  validate?: () => void;
}

export interface FieldValidationResult {
  isValid: boolean;
  errorMsg: string;
}

export namespace Validation{ 
  export function verifyValidForm(form: {[key:string]:FieldValidation}) {
    let valid = true;
    for (let field in form) {
      if (form.hasOwnProperty(field)) {
        form[field].validate();
        if (!form[field].isValid) {
          valid = false;
        }
      }
    }
    return valid;
  }
  export function validateAllFields(form: {[key:string]:FieldValidation}) {
    for (let field in form) {
      if (form.hasOwnProperty(field)) {
        form[field].validate();
      }
    }
  }
}
