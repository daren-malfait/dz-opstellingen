import { Discipline, Player } from '../types/badminton';

export function getCombinedRanking(
  discipline: Discipline,
  player1: Player,
  player2: Player,
): number {
  if (
    discipline === Discipline.MensDoubles ||
    discipline === Discipline.WomensDoubles
  ) {
    return player1.rankingDoubles + player2.rankingDoubles;
  } else if (
    discipline === Discipline.MensSingles ||
    discipline === Discipline.WomensSingles
  ) {
    return player1.rankingSingles;
  } else if (discipline === Discipline.MixedDoubles) {
    return player1.rankingMix + player2.rankingMix;
  }

  return 0;
}

export function getHighestRanking(
  discipline: Discipline,
  player1: Player,
  player2: Player,
): number {
  if (
    discipline === Discipline.MensDoubles ||
    discipline === Discipline.WomensDoubles
  ) {
    return Math.min(player1.rankingDoubles, player2.rankingDoubles);
  } else if (
    discipline === Discipline.MensSingles ||
    discipline === Discipline.WomensSingles
  ) {
    return player1.rankingSingles;
  } else if (discipline === Discipline.MixedDoubles) {
    return Math.min(player1.rankingMix, player2.rankingMix);
  }

  return 0;
}
