export interface IThing {
  type?: string;
  id?: number | string;
  _id?: number | null;
  thumbnail?: string;
  image?: string;
  name?: string;
  description?: string;
  datePublished?: string;
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

  amazonPrice?: number;
  amazonLink?: string;

  [index: string]: any;
}
