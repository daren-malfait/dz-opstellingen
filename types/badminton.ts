export interface Player {
  _ref?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  memberNumber?: string;
  rankingSingles: number;
  rankingDoubles: number;
  rankingMix: number;
  indexGender?: number;
  indexMix?: number;
}

export interface Reference {
  _ref?: string;
}

export interface Match {
  discipline?: Discipline;
  player1: {
    player: Player;
  };
  player2: {
    player: Player;
  };
}

export enum Discipline {
  MensDoubles = 'HD',
  WomensDoubles = 'DD',
  MixedDoubles = 'GD',
  MensSingles = 'HE',
  WomensSingles = 'DE',
}
