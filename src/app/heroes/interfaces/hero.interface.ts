export interface Hero {
  id?: string;
  superhero: string;
  publisher: Publisher;
  alter_ego: string;
  first_appearance: string;
  characters: string;
  alt_img?: string;
}

export interface CreateHeroDto extends Omit<Hero, 'id'> {
}

export enum Publisher {
  DC = 'DC Comics',
  Marvel = 'Marvel Comics'
}
