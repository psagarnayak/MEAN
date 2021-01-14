import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './../service/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @ViewChild('navbarElementRef') navbarElement?: ElementRef;

  navBarCollapse = true;
  constructor(private rendrer: Renderer2, private authService: AuthService) { }

  loggedinStateSubscription: Subscription | null = null
  isLoggedIn = false;
  ngOnInit(): void {
    this.loggedinStateSubscription = this.authService.loggedInStateObservable.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    if (this.loggedinStateSubscription) {
      this.loggedinStateSubscription.unsubscribe();
    }
  }

  toggleNavBar() {
    this.navBarCollapse = !this.navBarCollapse;
  }

  triggerSignout() {
    this.authService.logout();
  }

}
