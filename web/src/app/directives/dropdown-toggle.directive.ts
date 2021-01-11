import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdownToggle]'
})
export class DropdownToggleDirective {

  @HostBinding('class.open') dropdownOpen = false;

  @HostListener('click') toggleOnClick(event: MouseEvent) {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Receives an injection of HostElement reference in case we wish to use it
  // instead of using Host Binding or Host Listener.
  constructor(hostElement: ElementRef) { }
}
