import { Directive, OnInit, OnChanges, SimpleChanges, AfterViewInit, ElementRef, Renderer2, HostBinding, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FieldValidation } from '../models/formValidation';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective implements OnInit, OnChanges, AfterViewInit {
  private setup = false;
  private errorDisplay: ElementRef;
  private inputRef; 
  private name: string;
  private value: string;
  @HostBinding('style.background-color')
  backgroundColor: string = 'none';
  @Input() required = false;
  @Input() label: string;
  @Input() id: string;
  @Input() validation: FieldValidation;
  @Output() validationChange = new EventEmitter<FieldValidation>();

  constructor(private el: ElementRef, private r: Renderer2) { }

  ngOnInit() {
    this.setup = true;
  }

  ngAfterViewInit() {
    // Get parent of the original input element
    let parent = this.el.nativeElement.parentNode;
    // save a ref to input to change background color
    this.inputRef = this.el.nativeElement;
    // Create a div wrapper for the input
    let divElement = this.r.createElement('div');
    this.r.addClass(divElement, 'validated-field');
    // add wrapper div to dom
    this.r.insertBefore(parent, divElement, this.inputRef);
    this.r.removeChild(parent, this.inputRef);
    this.r.removeAttribute(this.inputRef, 'appValidate');
    // add label to div
    let label = this.r.createElement('label');
    this.r.setAttribute(label, 'for', this.id);
    let labelText = this.r.createText(this.label);
    this.r.appendChild(label, labelText); 
    this.r.appendChild(divElement, label);
    // re-add the input
    this.r.appendChild(divElement, this.inputRef);
    // add the error display.
    this.errorDisplay = this.r.createElement('span');
    this.r.setStyle(this.errorDisplay, 'color', 'red');
    this.r.appendChild(divElement, this.errorDisplay);
}

  @HostListener('change') @HostListener('blur')
  changeValue() {
    this.validate();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ensureValidationSetup();
    // don't validate if not setup or if fired by setting up the validation object. 
    if(this.setup && !(changes.validation.previousValue === undefined && changes.validation.currentValue !== undefined)) {
      this.validate();
    }
  }

  private validate() {
    this.validation.errorMsg = '';
    this.hideError();
    const value = this.el.nativeElement.value;
    const fieldName = this.el.nativeElement.getAttribute('name');
    console.log('validate field[' + fieldName + '] value[' + value + ']');
    if (this.required && !value) {
      this.validation.errorMsg = 'The field [' + fieldName + '] is required.';
    }
    // if no errors execute custom validation.
    if (this.validation.errorMsg.length == 0 && this.validation.customValidation) {
      const results = this.validation.customValidation(fieldName, value);
      if (!results.isValid) {
        this.validation.errorMsg = results.errorMsg;
      }
    }
    if (this.validation.errorMsg.length > 0) {
      this.showError();
      this.validation.isValid = false;
      this.validationChange.emit(this.validation);
    } else  {
      this.validation.isValid = true;
      this.validationChange.emit(this.validation);
    }
  }

  private showError() {
    this.removeAllErrorText();
    const errorText = this.r.createText(this.validation.errorMsg);
    this.r.setStyle(this.inputRef, 'background-color', 'red');
    this.r.appendChild(this.errorDisplay, errorText);
    this.r.setStyle(this.errorDisplay, 'display', 'inline-block');
  }

  private hideError() {
    this.removeAllErrorText();
    // revert style
    this.r.setStyle(this.errorDisplay, 'display', 'none');
    this.r.removeStyle(this.inputRef, 'background-color');
  }

  private removeAllErrorText() {
    // get and remove any error messages.
    const temp: any = this.errorDisplay;
    const childElements = temp.childNodes;
    for (let child of childElements) {
      this.r.removeChild(this.errorDisplay, child);
    }
  }

  private ensureValidationSetup() {
    if (!this.validation) {
      this.validation = {};
    }
    if (this.validation.isValid == null){
      this.validation.isValid = true;
    } 
    if (this.validation.errorMsg == null) {
      this.validation.errorMsg = '';
    }
    if (!this.validation.validate) {
      this.validation.validate = () => { this.validate(); };
    }
    this.validationChange.emit(this.validation);
  }
}