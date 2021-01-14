import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from './../service/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let loggedInProfile = this.authService.getUserProfile();

    if (this.authService.checkIfLoggedIn() && loggedInProfile) {
      req = req.clone(
        { headers: req.headers.append('Authentication', 'Bearer ' + this.authService.getUserProfile()?.authToken) }
      );
    }
    return next.handle(req);
  }
}
