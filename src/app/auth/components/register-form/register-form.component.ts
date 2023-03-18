import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { MyValidators } from 'src/app/utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styles: []
})
export class RegisterFormComponent implements OnInit {
  form: FormGroup;
  status: 'loading' | 'success' | 'error' | 'init';
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
  ) {
    this.status = 'init'
    this.form =  this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email], [MyValidators.validateEmailAsync(this.usersService)]],
        password: ['', [Validators.required, Validators.minLength(6), MyValidators.validPassword]],
        confirmPassword: ['', [Validators.required]],
        avatar: ['https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/255.jpg', [Validators.required]],
        checkTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: MyValidators.matchPasswords,
      }
    );
  }

  ngOnInit(): void {}

  register(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      this.status = 'loading';
      this.usersService.create(value)
      .subscribe((rta) => {
        this.status = 'success';
        console.log(rta);
      }, () => {
        this.status = 'error';
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  get nameField() {
    return this.form.get('name');
  }

  get lastNameField() {
    return this.form.get('lastName');
  }

  get emailField() {
    return this.form.get('email');
  }

  get passwordField() {
    return this.form.get('password');
  }

  get confirmPasswordField() {
    return this.form.get('confirmPassword');
  }

  get checkTermsField() {
    return this.form.get('checkTerms');
  }
}
