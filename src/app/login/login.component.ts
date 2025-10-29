import { UserService } from './../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeUserEnum } from '../core/enums/type.user.enum';
import { Router } from '@angular/router';
import { AppRoutes } from '../shared/app-routes.enum';
import { AuthService } from '../core/services/auth.service';
import { User, UserRequest } from '../core/interfaces/user.interface';
import { finalize, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form!: FormGroup;
  public typeUserEnum = TypeUserEnum;
  public isLoading: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      student: ['', [Validators.required]],
      class: [''],
      age: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.min(5),
          Validators.max(120),
        ],
      ],
      awareCheck: [false, [Validators.requiredTrue]],
    });
    this.validateClassField();
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const req: UserRequest = this.createUserRequest(this.form.value);
    this.userService.getUser(req)
      .pipe(
        switchMap(user => user ? of(user) : this.userService.createUser(req)),
        finalize(() => this.isLoading = false),
      )
      .subscribe((user: User) => {
        this.authService.login(user);
        this.form.reset();
        this.router.navigate([`/${AppRoutes.HOME}`]);
      });
  }

  // Helpers de erro simples
  public hasError(path: string, error: string) {
    const c = this.form.get(path);
    return !!c && c.touched && c.hasError(error);
  }

  private validateClassField(): void {
    this.form.get('student')?.valueChanges.subscribe((value: TypeUserEnum) => {
      const classCtrl = this.form.get('class');
      if (value === TypeUserEnum.STUDENT) {
        classCtrl?.setValidators([Validators.required, Validators.minLength(2)]);
      } else {
        classCtrl?.clearValidators();
        classCtrl?.setValue('');
      }
      classCtrl?.updateValueAndValidity();
    });
  }

  private createUserRequest(value: any): UserRequest {
    return {
      age: value.age.trim(),
      name: value.name.trim(),
      role: value.student === TypeUserEnum.STUDENT ? 'STUDENT' : 'VISITOR',
      class: value.student === TypeUserEnum.STUDENT ? value.class.trim() : undefined,
    }
  }
}
