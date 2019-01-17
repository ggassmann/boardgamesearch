const live = process.env.NODE_ENV === 'production';

export const host = live ? CFG.PRODUCTION_HOST : CFG.DEV_HOST;
export const searchPort = live ? 443 : CFG.SEARCH_PORT;
export const searchOriginPath = CFG.SEARCH_ORIGIN_PATH;
export const userPort = live ? 443 : CFG.USER_PORT;
export const userOriginPath = CFG.USER_ORIGIN_PATH;
export const userAuthGoogleRedirectURI = live ? CFG.GOOGLE_AUTH.redirect_uris[0] : CFG.GOOGLE_AUTH.redirect_uris[1];

export const chromeBinary = live ? CFG.PRODUCTION_BROWSER_PATH : CFG.DEV_BROWSER_PATH;
