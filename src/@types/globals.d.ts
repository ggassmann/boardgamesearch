declare let CFG: CFG;

interface CFG {
  PRODUCTION_HOST: string,
  DEV_HOST: string,

  DEV_SEARCH_PORT: number;
  SEARCH_ORIGIN_PATH: string;

  PRODUCTION_DEPLOY_SOLR_USER: string,
  PRODUCTION_DEPLOY_SOLR_PEM: string,
}