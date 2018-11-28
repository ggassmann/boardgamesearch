const live = process.env.NODE_ENV === 'production';

export const host = live ? CFG.PRODUCTION_HOST : CFG.DEV_HOST;
export const searchPort = live ? 443 : CFG.DEV_SEARCH_PORT;
export const searchOriginPath = CFG.SEARCH_ORIGIN_PATH;
