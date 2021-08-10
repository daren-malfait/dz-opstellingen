import { Discipline, Match } from '../types/badminton';

export function checkMixedValid(matches: Match[]): true | string {
  const mixedLineup = matches.filter(
    ({ discipline }: any) => discipline === Discipline.MixedDoubles,
  );

  const menDoublesLineup = matches.filter(
    ({ discipline }: any) => discipline === Discipline.MensDoubles,
  );

  const womensDoublesLineup = matches.filter(
    ({ discipline }: any) => discipline === Discipline.WomensDoubles,
  );

  const mensSinglesLineup = matches.filter(
    ({ discipline }: any) => discipline === Discipline.MensSingles,
  );
  const womensSinglesLineup = matches.filter(
    ({ discipline }: any) => discipline === Discipline.WomensSingles,
  );

  if (mixedLineup.length !== 2) {
    return 'Een gemengde onmoeting moet 2 mixed doubles bevatten';
  }

  if (menDoublesLineup.length !== 1) {
    return 'Een gemengde onmoeting moet 1 herendubbel bevatten';
  }

  if (womensDoublesLineup.length !== 1) {
    return 'Een gemengde onmoeting moet 1 vrouwendubbel bevatten';
  }

  if (mensSinglesLineup.length !== 2) {
    return 'Een gemengde onmoeting moet 2 herenenkels bevatten';
  }

  if (womensSinglesLineup.length !== 2) {
    return 'Een gemengde onmoeting moet 2 vrouwenenkels bevatten';
  }

  return true;
}

export function checkGenderBasedValid(matches: Match[]): true | string {
  const mixedLineup = matches.filter(
    ({ discipline }: any) => discipline === Discipline.MixedDoubles,
  );

  const doublesLineup = matches.filter(
    ({ discipline }: any) =>
      discipline === Discipline.MensDoubles ||
      discipline === Discipline.WomensDoubles,
  );

  const singlesLineup = matches.filter(
    ({ discipline }: any) =>
      discipline === Discipline.MensSingles ||
      discipline === Discipline.WomensSingles,
  );

  if (mixedLineup.length > 0) {
    return 'Een onmoeting mag geen mixed doubles bevatten';
  }

  if (doublesLineup.length !== 4) {
    return 'Een onmoeting moet 4 dubbelwedstrijden bevatten';
  }

  if (singlesLineup.length !== 4) {
    return 'Een onmoeting moet 4 enkelwedstrijden bevatten';
  }

  return true;
}
