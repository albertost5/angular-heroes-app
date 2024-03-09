import {Component} from '@angular/core';
import {Item} from '../../interfaces/item.interface';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/interfaces/user.interface';
import {Router} from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: []
})
export class LayoutPageComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  get currentUser(): User | undefined  {
    return this.authService.currentUser;
  }

  public sidebarItems: Item[] = [
    {label: 'List', icon: 'label', url: './list'},
    {label: 'Add', icon: 'add', url: './new-hero'},
    {label: 'Search', icon: 'search', url: './search'}
  ]

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
