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

export interface UpdateHeroDto extends Partial<Hero> {
}

export type Publisher = "DC Comics" | "Marvel Comics";
