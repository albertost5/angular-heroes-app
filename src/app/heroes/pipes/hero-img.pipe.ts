import {Pipe, PipeTransform} from '@angular/core';
import {Hero} from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImg'
})
export class HeroImgPipe implements PipeTransform {

  transform(hero: Hero): string {
    if (!hero.id && !hero.alt_img) {
      return 'assets/no-image.png';
    } else if (hero.alt_img) {
      return hero.alt_img; // https:///hero.es/flash.png
    } else {
      return `assets/heroes/${hero.id}.jpg`;
    }
  }
}
