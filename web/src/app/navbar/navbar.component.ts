import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ViewChild('navbarElementRef') navbarElement?: ElementRef;

  navBarCollapse = true;
  constructor(private rendrer: Renderer2) { }


  ngOnInit(): void {
  }

  toggleNavBar() {

    this.navBarCollapse = !this.navBarCollapse;
  }
  /* if (this.navBarElement?.nativeElement.class.collapsed) {
    this.rendrer.removeClass(this.navBarElement, 'collapsed');
  } else {
    this.rendrer.addClass(this.navBarElement, 'collapsed');
  } */


}
