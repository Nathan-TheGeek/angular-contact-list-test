import { Directive, OnInit, OnChanges, ElementRef, Renderer2, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective implements OnInit, OnChanges {
  private errorDisplay: ElementRef;
  private errorMsg = '';
  @HostBinding('style.background-color')
  backgroundColor: string = 'none';

  constructor(private el: ElementRef, private r: Renderer2) { }

  ngOnInit() {
    this.errorDisplay = this.r.createElement('span');
  }

  @HostListener('change') ngOnChanges() {
    this.validate();
  }

  private validate() {
    this.errorMsg = 'An error is on this line.';
    this.showError();
  }

  private showError() {
    const errorText = this.r.createText(this.errorMsg);
    this.r.appendChild(this.el.nativeElement.parentNode, errorText);
    this.backgroundColor = 'red';
    this.r.setStyle(this.errorDisplay, 'display', 'inline-block');
  }

  private hideError() {
    this.r.setStyle(this.errorDisplay, 'display', 'none');
    this.backgroundColor = 'none';
    const childElements = this.errorDisplay.nativeElement.childNodes;
    for (let child of childElements) {
      this.r.removeChild(this.errorDisplay.nativeElement, child);
    }
  }
}