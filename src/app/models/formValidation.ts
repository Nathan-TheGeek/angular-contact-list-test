export interface FieldValidation {
  isValid?: boolean;
  errorMsg?: string;
  customValidation?: (name: string, value: any) => FieldValidationResult;
  validate?: () => FieldValidation;
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
        const validation = form[field].validate();
        if (!validation.isValid) {
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
