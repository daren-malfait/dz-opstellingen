import client from 'part:@sanity/base/client';

import { Discipline, Match, Player, Reference } from '../types/badminton';

function getPlayerIds(matches: Match[]): string[] {
  let players: string[] = [];

  function addToPlayers(player: Reference) {
    if (player && player._ref) {
      if (!players.includes(player._ref)) {
        players = [...players, player._ref];
      }
    }
  }

  matches.forEach(({ player1, player2 }) => {
    if (player1 && player1.player) {
      addToPlayers(player1.player);
    }

    if (player2 && player2.player) {
      addToPlayers(player2.player);
    }
  });

  return players;
}

export async function getPlayerInfos(matches: Match[]): Promise<Player[]> {
  const playerIds = getPlayerIds(matches);

  const players = await client.fetch(
    `*[_type == $type && _id in $playerIds][]`,
    {
      playerIds,
      type: 'players',
    },
  );

  return players;
}

function isSorted(arr: number[]): boolean {
  return arr.slice(1).every((item, i) => arr[i] <= item);
}

export function checkMixedValid(
  matches: Match[],
  players: Player[],
): true | string {
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

  let indexesMensSingles: number[] = [];

  mensSinglesLineup.forEach(({ player1 }) => {
    const p1 = getPlayerById(players, player1.player._ref);
    if (p1) {
      indexesMensSingles = [...indexesMensSingles, p1.rankingSingles];
    }
  });

  const womensSinglesLineup = matches.filter(
    ({ discipline }: any) => discipline === Discipline.WomensSingles,
  );

  let indexesWomensSingles: number[] = [];

  womensSinglesLineup.forEach(({ player1 }) => {
    const p1 = getPlayerById(players, player1.player._ref);
    if (p1) {
      indexesWomensSingles = [...indexesWomensSingles, p1.rankingSingles];
    }
  });

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

  let indexesMix: number[] = [];
  let highestRankingsMix: number[] = [];

  mixedLineup.forEach(({ player1, player2 }) => {
    const p1 = getPlayerById(players, player1.player._ref);
    const p2 = getPlayerById(players, player2.player._ref);

    if (!p1 || !p2) {
      return 'Need 2 players for mixed';
    }

    const index = p1.rankingMix + p2.rankingMix;

    indexesMix = [...indexesMix, index];
    highestRankingsMix = [
      ...highestRankingsMix,
      Math.max(p1.rankingMix, p2.rankingMix),
    ];
  });

  if (!isSorted(indexesMix)) {
    return 'Controleer de volgorde van de mixed.';
  }

  return true;
}

function getPlayerById(
  players: Player[],
  playerId?: string,
): Player | undefined {
  return players.find(({ _id }) => playerId === _id);
}

export function checkGenderBasedValid(
  matches: Match[],
  players: Player[],
): true | string {
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

  let indexesDoubles: number[] = [];
  let highestRankingsDoubles: number[] = [];

  doublesLineup.forEach(({ player1, player2 }) => {
    const p1 = getPlayerById(players, player1.player._ref);
    const p2 = getPlayerById(players, player2.player._ref);

    if (!p1 || !p2) {
      return 'Need 2 players for doubles';
    }

    const index = p1.rankingDoubles + p2.rankingDoubles;

    indexesDoubles = [...indexesDoubles, index];
    highestRankingsDoubles = [
      ...highestRankingsDoubles,
      Math.max(p1.rankingDoubles, p2.rankingDoubles),
    ];
  });

  let indexesSingles: number[] = [];

  singlesLineup.forEach(({ player1 }) => {
    const p1 = getPlayerById(players, player1.player._ref);
    if (p1) {
      indexesSingles = [...indexesSingles, p1.rankingSingles];
    }
  });

  if (!isSorted(indexesDoubles)) {
    return 'Controleer de volgorde van de dubbels op ranking.';
  }

  if (!isSorted(indexesSingles)) {
    return 'Controleer de volgorde van de enkels.';
  }

  if (doublesLineup.length !== 4) {
    return 'Een onmoeting moet 4 dubbelwedstrijden bevatten';
  }

  if (singlesLineup.length !== 4) {
    return 'Een onmoeting moet 4 enkelwedstrijden bevatten';
  }

  return true;
}
