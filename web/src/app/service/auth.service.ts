import { Injectable } from '@angular/core';
import { LoginResponse, SignupResponse, UserProfile } from '../common/generic.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGIN_URL = environment['login-url'];
  private SIGNUP_URL = environment['signup-url'];
  private loggedInProfile?: UserProfile;
  private loggedInState$ = new BehaviorSubject<boolean>(false);
  private logoutAfterTimer?: NodeJS.Timeout;

  constructor(private http: HttpClient) {
    this.extractSavedProfile();
  }

  public getUserProfile(): UserProfile | undefined {
    return this.loggedInProfile;
  }

  public performSignup(email: string, name: string, password: string) {

    return this.http.post<SignupResponse>(this.SIGNUP_URL, { email, name, password });
  }

  public performLogin(email: string, password: string) {
    return this.http.post<LoginResponse>(
      this.LOGIN_URL, { email, password }).pipe(tap((response) => {
        if (response && response.success) {
          this.loggedInProfile = {
            name: response.profile.name,
            email: response.profile.email,
            authToken: response.token,
            expiresAt: new Date().getTime() + (+response.tokenExpiresInSec * 1000)
          };
          this.loggedInState$.next(true);
          this.saveProfileToLocalStorage();
          this.setLogoutExpirationTimeout();
        }

      }, (error) => {
        console.log('Error logging in: ', error);
      }));
  }

  public logout() {
    this.loggedInProfile = undefined;
    localStorage.clear();
    if (this.logoutAfterTimer) {
      clearTimeout(this.logoutAfterTimer);
    }
    this.loggedInState$.next(false);
  }

  get loggedInStateObservable(): Observable<boolean> {
    return this.loggedInState$.asObservable();
  }

  public checkIfLoggedIn(): boolean {

    let loggedIn = false;
    if (this.loggedInProfile
      && this.loggedInProfile.authToken
      && this.loggedInProfile.expiresAt > new Date().getTime()) {
      loggedIn = true;
    }
    return loggedIn;
  }

  private extractSavedProfile() {
    let name = localStorage.getItem('userProfile.name');
    let email = localStorage.getItem('userProfile.email');
    let authToken = localStorage.getItem('userProfile.authToken');
    let expiresAt = localStorage.getItem('userProfile.expiresAt');

    if (name && email && authToken && expiresAt && +expiresAt > new Date().getTime()) {
      this.loggedInProfile = { name, email, authToken, 'expiresAt': +expiresAt }
      this.saveProfileToLocalStorage();
      this.setLogoutExpirationTimeout();
      this.loggedInState$.next(true);
    }
  }

  private setLogoutExpirationTimeout() {
    if (this.logoutAfterTimer) {
      clearTimeout(this.logoutAfterTimer);
    }
    if (this.loggedInProfile && this.checkIfLoggedIn()) {
      let tokenExpiryInMs = this.loggedInProfile?.expiresAt - new Date().getTime();
      this.logoutAfterTimer = setTimeout(() => {
        console.log('Timer Expired, logging out!');
        this.logout();
      }, tokenExpiryInMs);
    }
  }

  private saveProfileToLocalStorage() {
    if (this.loggedInProfile && this.checkIfLoggedIn()) {
      localStorage.setItem('userProfile.name', this.loggedInProfile.name);
      localStorage.setItem('userProfile.email', this.loggedInProfile.email);
      localStorage.setItem('userProfile.authToken', this.loggedInProfile.authToken);
      localStorage.setItem('userProfile.expiresAt', this.loggedInProfile.expiresAt.toString());
    }
  }

}
