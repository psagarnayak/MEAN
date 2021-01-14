import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginAttempted = false;
  loginFailed = false;
  loginErrorMsg = '';
  emailControl = new FormControl(null, [Validators.required, Validators.email]);
  passwordControl = new FormControl(null, Validators.required);
  loginForm = new FormGroup({
    'email': this.emailControl,
    'password': this.passwordControl
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  doLogin() {
    this.loginFailed = false;
    this.loginErrorMsg = '';
    if (!this.loginForm.valid) {
      this.loginAttempted = true;
      return;
    }
    this.authService.performLogin(this.emailControl.value, this.passwordControl.value).subscribe(
      (response) => {
        if (response && response.success) {
          this.router.navigate(['/']);
        } else {
          console.log(response);
          this.loginFailed = true;
          this.loginErrorMsg = response.message;
        }
      }, (error) => {
        console.log(error);
        this.loginFailed = true;
        this.loginErrorMsg = error.error.message;
      });
  }

}
