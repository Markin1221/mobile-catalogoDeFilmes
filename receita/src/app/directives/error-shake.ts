import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appShakeOnError]',
  standalone: true, 
})
export class ErrorShakeDirective implements OnChanges {
  @Input('appShakeOnError') triggerShake: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.triggerShake) {
      this.renderer.addClass(this.el.nativeElement, 'shake');

      setTimeout(() => {
        this.renderer.removeClass(this.el.nativeElement, 'shake');
      }, 500);
    }
  }
}
