import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    'name': new FormControl(null, Validators.required),
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'password': new FormControl(null, [Validators.required]),
    'passwordVerify': new FormControl(null, [Validators.required, this.passwordsMatch.bind(this)])
  });

  constructor() { }

  ngOnInit(): void {
  }

  passwordsMatch(passwordControl: FormControl): { [key: string]: boolean } | null {
    if (passwordControl && passwordControl.value != this.signupForm?.get('password')?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  performSignup() {
    if (this.signupForm.invalid) return;

    console.log("Signing Up Now!");
  }
}
