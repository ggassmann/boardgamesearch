export interface IBGGThing {
  type?: string;
  id?: number;
  thumbnail?: string;
  image?: string;
  name?: string;
  description?: string;
  yearPublished?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playingTime?: number;
  minPlayTime?: number;
  maxPlayTime?: number;
  minAge?: number;
  categories?: string[];
  mechanics?: string[];
  families?: string[];
  expansions?: string[];
  designers?: string[];
  artists?: string[];
  publishers?: string[];
  producers?: string[];
  genres?: string[];
  integrations?: string[];
  accessories?: string[];
  compilations?: string[];
  serieses?: string[];
  franchises?: string[];
  platforms?: string[];
  themes?: string[];
  modes?: string[];
  issues?: string[];
  suggestedLanguageDependence?: string;
  suggestedRating?: number;
  suggestedWeight?: number;
}
