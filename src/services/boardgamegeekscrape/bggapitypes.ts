export interface IBGGScrapeError {
  message: any;
}

interface IBGGItemAttributes {
  type: string;
  id: string;
}

interface IBGGItemInfoWithValueInAttributesAttributes {
  value: any;
}

interface IBGGItemInfoWithValueInAttributes {
  $: IBGGItemInfoWithValueInAttributesAttributes;
}

interface IBGGItemPollAttributes {
  totalvotes: string;
  name: string;
}

interface IBGGItemPollResultsResultAttributes {
  value: string;
  numvotes: number;
}

interface IBGGItemPollResultsResult {
  $: IBGGItemPollResultsResultAttributes;
}

interface IBGGItemPollResultsAttributes {
  numplayers?: string;
}

interface IBGGItemPollResults {
  $: IBGGItemPollResultsAttributes;
  result: IBGGItemPollResultsResult[];
}

interface IBGGItemPoll {
  $: IBGGItemPollAttributes;
  results: IBGGItemPollResults[];
}

interface IBGGStatisticsRatingsResultAttribute {
  value: string;
}

interface IBGGStatisticsRatingsResult {
  $: IBGGStatisticsRatingsResultAttribute;
}

interface IBGGStatisticsRatings {
  bayesaverage?: IBGGStatisticsRatingsResult[];
  averageweight?: IBGGStatisticsRatingsResult[];
}

interface IBGGStatistics {
  ratings: IBGGStatisticsRatings[];
}

interface IBGGItemLinkAttributes {
  type: string;
  value: any;
}

interface IBGGItemLink {
  $: IBGGItemLinkAttributes;
}

interface IBGGItemNameAttributes {
  type: string;
  value: string;
}

interface IBGGItemName {
  $: IBGGItemNameAttributes;
}

interface IBGGItem {
  $: IBGGItemAttributes;
  link: IBGGItemLink[];
  thumbnail: string[];
  image: string[];
  description: string[];
  name: IBGGItemName[];
  yearpublished: IBGGItemInfoWithValueInAttributes[];
  minplayers: IBGGItemInfoWithValueInAttributes[];
  maxplayers: IBGGItemInfoWithValueInAttributes[];
  playingtime: IBGGItemInfoWithValueInAttributes[];
  minplaytime: IBGGItemInfoWithValueInAttributes[];
  maxplaytime: IBGGItemInfoWithValueInAttributes[];
  minage: IBGGItemInfoWithValueInAttributes[];
  poll?: IBGGItemPoll[];
  statistics?: IBGGStatistics[];
}

interface IBGGItems {
  item: IBGGItem[];
}

export interface IBGGScrapeResults {
  error: IBGGScrapeError;
  items: IBGGItems;
}
