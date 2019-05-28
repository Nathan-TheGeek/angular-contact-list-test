import { Directive, OnInit, OnChanges, ElementRef, Renderer2, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective implements OnInit, OnChanges {
  private setup = false;
  private errorDisplay: ElementRef;
  private errorMsg = '';
  @HostBinding('style.background-color')
  backgroundColor: string = 'none';
  @Input() required = false;

  constructor(private el: ElementRef, private r: Renderer2) { }

  ngOnInit() {
    this.errorDisplay = this.r.createElement('span');
    this.r.appendChild(this.el.nativeElement.parentNode, this.errorDisplay);
    this.setup = true;
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
    console.log(this.errorMsg.length);
    if(this.errorMsg.length > 0) {
      this.showError();
    } else  {
      this.hideError();
    }
  }

  private showError() {
    const errorText = this.r.createText(this.errorMsg);
    this.backgroundColor = 'red';
    this.r.appendChild(this.errorDisplay, errorText);
    this.r.setStyle(this.errorDisplay, 'display', 'inline-block');
  }

  private hideError() {
    console.log(this.errorDisplay);
    const childElements = this.errorDisplay.nativeElement;
    for (let child of childElements) {
      this.r.removeChild(this.errorDisplay.nativeElement, child);
    }
    this.r.setStyle(this.errorDisplay, 'display', 'none');
    this.backgroundColor = 'none';
  }
}