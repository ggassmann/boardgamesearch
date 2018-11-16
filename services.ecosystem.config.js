module.exports = {
  apps : [{
    name        : "boardgamegeekscrape",
    script      : "./public/services/boardgamegeekscrape.bundle.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
      "NODE_ENV": "production"
    }
  }, {
    name        : "search",
    script      : "./public/services/search.bundle.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
      "NODE_ENV": "production"
    }
  }],
}