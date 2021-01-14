import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupAttempted = false;
  signupFailed = false;
  signupErrorMsg = '';

  nameControl = new FormControl(null, Validators.required);
  emailControl = new FormControl(null, [Validators.required, Validators.email]);
  passwordControl = new FormControl(null, [Validators.required]);
  signupForm = new FormGroup({
    'name': this.nameControl,
    'email': this.emailControl,
    'password': this.passwordControl,
    'passwordVerify': new FormControl(null, [Validators.required, this.passwordsMatch.bind(this)])
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  passwordsMatch(passwordControl: FormControl): { [key: string]: boolean } | null {
    if (passwordControl && passwordControl.value != this.signupForm?.get('password')?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  performSignup() {
    this.signupFailed = false;
    this.signupErrorMsg = '';
    if (this.signupForm.invalid) {
      this.signupAttempted = true;
      return;
    }
    this.authService.performSignup(
      this.emailControl.value,
      this.nameControl.value,
      this.passwordControl.value,
    ).subscribe((response) => {

      if (response && response.success) {
        alert('Signup Successful! Please log into your account.');
        this.router.navigate(['/login']);
      } else {
        this.signupFailed = true;
        this.signupErrorMsg = response.message;
      }

    }, (error) => {
      this.signupFailed = true;
      this.signupErrorMsg = error.error.message;
    });
  }
}
