import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Hero, Publisher} from '../../interfaces/hero.interface';
import {HeroesService} from '../../services/heroes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, switchMap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: []
})
export class NewPageComponent implements OnInit {
  get currentHero(): Hero {
    return this.heroFormGroup.value as Hero;
  }

  public publishers = [
    {
      id: 'DC Comics',
      description: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      description: 'Marvel - Comics'
    }
  ];

  public heroFormGroup = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.DC),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  constructor(
    private readonly heroesService: HeroesService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly _snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.heroesService.getHero(id))
    ).subscribe(hero => {
      if(!hero) {
        return this.router.navigateByUrl('/');
      }

      this.heroFormGroup.reset(hero);
      return;
    });
  }

  onSubmit(): void {
    if (!this.heroFormGroup.valid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe(heroUpdated => {
        this.openSnackBar(`${this.currentHero.superhero} updated!`);
      });
      return;
    }

    if( !this.currentHero.alt_img ) {
      this.currentHero.alt_img = 'assets/no-image.png';
    }

    this.heroesService.addHero(this.currentHero).subscribe(newHero => {
      this.router.navigate(['heroes/edit', newHero.id]);
      this.openSnackBar(`${this.currentHero.superhero} added!`);
    });
  }

  public openSnackBar(message: string): void {
    this._snackBar.open(message,'Done', {
      duration: 2000
    });
  }

  public onDeleteHero(): void {
    if(!this.currentHero.id) throw Error('Id is required!');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero,
    });

    dialogRef.afterClosed().pipe(
      filter(res => res),
      switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id!)),
      filter(isDeleted => isDeleted)
    ).subscribe(() => {
      this.router.navigateByUrl('/heroes');
      // this.router.navigate(['/heroes'])
    });
  }
}
