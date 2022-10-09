import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('')
  emailErrorMessage: string = ''
  password = new FormControl('')
  passwordErrorMessage: string = ''
  error: string = ''

  loginForm = new FormGroup({
    email: this.email,
    password: this.password
  })

  ngOnInit(): void {
    document.title = 'Login - Schnell Schnell'
    this.email.setValidators([Validators.required, Validators.email])
    this.password.setValidators([Validators.required, Validators.minLength(8)])
  }

  clearForm = () => {
    this.email.setValue('')
    this.password.setValue('')
    this.error = ''
  }

  handleSubmit = () => {
    this.emailErrorMessage = ''
    this.passwordErrorMessage = ''
    if (this.email.errors) {
      const errors = this.email.errors
      if (errors["email"]) {
        this.emailErrorMessage = `Invalid email address`
      }
    }
    if (this.password.errors) {
      const errors = this.password.errors
      if (errors["minlength"]) {
        this.passwordErrorMessage = `Password must be at least ${errors["minlength"].requiredLength} characters`
      }
    }
    if (!this.email.errors && !this.password.errors) {
      const now = new Date()
      const hour_string = now.getUTCHours() < 10 ? `0${now.getUTCHours()}` : now.getUTCHours()
      const min_string = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
      const body = {
        Email: this.email.value,
        Password: this.password.value,
        Code: `${hour_string}${min_string}`
      }
      fetch(`http://localhost:8080/auth/login`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.text())
      .then(response => {
        // Okay so Go is sending a newline in the resposne
        //  It's likely fairly simple to fix so can do this later
        //  or whatnot
        if (response === "Invalid username/password combination\n")
          this.passwordErrorMessage = response
        else if (!response)
          window.location.href = 'https://www.onecause.com/'
        else
          this.passwordErrorMessage = "Something went wrong. Try again later!"
      })
    }
  }
}
