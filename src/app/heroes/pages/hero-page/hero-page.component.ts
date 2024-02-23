import {Component, OnInit} from '@angular/core';
import {HeroesService} from '../../services/heroes.service';
import {Observable, switchMap} from 'rxjs';
import {Hero} from '../../interfaces/hero.interface';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: []
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private readonly heroesService: HeroesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.getHero(id))
    ).subscribe(hero => {
      if (!hero) {
        this.goBack();
      }
      this.hero = hero;
    });
  }

  public getHero(id: string): Observable<Hero | undefined> {
    return this.heroesService.getHero(id);
  }

  public goBack(): void {
    this.router.navigate(['heroes/list']);
  }
}
