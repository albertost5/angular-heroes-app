import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: []
})
export class LoginPageComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  public login(): void {
    this.authService.login('randomUser', 'randomPassword').subscribe(
      user => this.router.navigateByUrl('/heroes/list')
    );
  }
}
