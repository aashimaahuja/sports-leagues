export interface League {
  id: string
  name: string
  aliases: string[]
  sport: string
  countryCode: string
}

/** Raw shape returned by TheSportsDB API */
export interface ApiLeague {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string
}

