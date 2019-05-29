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
    this.inputRef = this.el.nativeElement;
    // Create a div
    let divElement = this.r.createElement('div');
    // Add class "input-wrapper"
    this.r.addClass(divElement, 'validated-field');
    // Add the div, just before the input
    this.r.insertBefore(parent, divElement, this.inputRef);
    // Remove the input
    this.r.removeChild(parent, this.inputRef);
    // Remove the directive attribute (not really necessary, but just to be clean)
    this.r.removeAttribute(this.inputRef, 'appValidate');
    // add the label for the input.
    let label = this.r.createElement('label');
    this.r.setAttribute(label, 'for', this.id);
    let labelText = this.r.createText(this.label);
    this.r.appendChild(label, labelText); 
    this.r.appendChild(divElement, label);
    // Re-add the input inside the div
    this.r.appendChild(divElement, this.inputRef);
    // add the error display.
    this.errorDisplay = this.r.createElement('span');
    this.r.setStyle(this.errorDisplay, 'color', 'red');
    this.r.appendChild(divElement, this.errorDisplay);
}

  @HostListener('change') ngOnChanges() {
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
    const errorText = this.r.createText(this.errorMsg);
    this.r.setStyle(this.inputRef, 'background-color', 'red');
    this.r.appendChild(this.errorDisplay, errorText);
    this.r.setStyle(this.errorDisplay, 'display', 'inline-block');
  }

  private hideError() {
    // get and remove any error messages.
    const childElements = (<any>this.errorDisplay).childNodes;
    for (let child of childElements) {
      this.r.removeChild(this.errorDisplay, child);
    }
    // revert style
    this.r.setStyle(this.errorDisplay, 'display', 'none');
    this.r.removeStyle(this.inputRef, 'background-color');
  }
}