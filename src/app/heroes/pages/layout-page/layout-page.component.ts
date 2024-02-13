import {Component} from '@angular/core';
import {Item} from '../../interfaces/item.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: []
})
export class LayoutPageComponent {
  public sidebarItems: Item[] = [
    {label: 'List', icon: 'label', url: './list'},
    {label: 'Add', icon: 'add', url: './new-hero'},
    {label: 'Search', icon: 'search', url: './search'}
  ]
}
