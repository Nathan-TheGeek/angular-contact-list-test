import { Directive, OnInit, OnChanges, AfterViewInit, ElementRef, Renderer2, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective implements OnInit, OnChanges, AfterViewInit {
  private setup = false;
  private errorDisplay: ElementRef;
  private inputRef; 
  private errorMsg = '';
  @HostBinding('style.background-color')
  backgroundColor: string = 'none';
  @Input() required = false;
  @Input() label: string;
  @Input() id: string;

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

  @HostListener('change') @HostListener('blur') ngOnChanges() {
    if(this.setup) {
      this.validate();
    }
  }

  private validate() {
    this.errorMsg = '';
    const value = this.el.nativeElement.value;
    const fieldName = this.el.nativeElement.getAttribute('name');
    if (this.required && !value) {
      this.errorMsg = 'The field [' + fieldName + '] is required.';
    }
    if(this.errorMsg.length > 0) {
      this.showError();
    } else  {
      this.hideError();
    }
  }

  private showError() {
    this.removeAllErrorText();
    const errorText = this.r.createText(this.errorMsg);
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
    const childElements = (<any>this.errorDisplay).childNodes;
    for (let child of childElements) {
      this.r.removeChild(this.errorDisplay, child);
    }
  }
}