declare let CFG: CFG;

interface IDSN {
  host: string;
  port: number;
  username: string;
  password: string;
}

interface IGoogleAuth {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}

interface CFG {
  PRODUCTION_HOST: string,
  DEV_HOST: string,

  SEARCH_PORT: number;
  SEARCH_ORIGIN_PATH: string;

  USER_PORT: number;
  USER_ORIGIN_PATH: string;

  PRODUCTION_DEPLOY_SOLR_USER: string,
  PRODUCTION_DEPLOY_SOLR_PEM: string,

  DEV_BROWSER_PATH: string,
  PRODUCTION_BROWSER_PATH: string,

  SESSION_SECRET: string,

  PRODUCTION_DATABASE: IDSN;
  DEV_DATABASE: IDSN;

  GOOGLE_AUTH: IGoogleAuth;
}