import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Hero} from '../../interfaces/hero.interface';
import {HeroesService} from '../../services/heroes.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent {

  public heroes: Hero[] = [];
  public searchControl = new FormControl('');
  public selectedHero?: Hero;

  constructor(
    private readonly heroesService: HeroesService
  ) {
  }

  public searchHero(): void {
    const searchInputVal: string = this.searchControl.value || '';
    if (!searchInputVal) return;

    this.heroesService.getSuggestions(searchInputVal).subscribe(
      heroes => this.heroes = heroes
    );
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent) {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }
    // Set the value of the input and the selectedHero
    const hero: Hero = event.option.value;
    this.searchControl.setValue(hero.superhero);
    this.selectedHero = hero;
  }
}
