/** Raw shape returned by TheSportsDB API */
export interface ApiLeague {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
}

/** Season shape returned by TheSportsDB seasons archive API */
export interface ApiSeason {
  strSeason: string;
  strBadge: string | null;
}
