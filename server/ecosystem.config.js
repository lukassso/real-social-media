const env =  {
  DB_NAME: "reall",
  SMTP_HOST: 'smtp.mailgun.org',
  SMTP_PORT: 2525,
  SMTP_USER: 'postmaster@mg.emikse.com',
  SMTP_PASSWORD: '93bf03f102490ab514f1e29ddbc5afc0-e51d0a44-32249f32',
  SMSAPI_ACCESS_TOKEN: 'Ra3kfuT76xg17pctt4QyyTpgjaRVxSTdEuopyEEH',
  FACEBOOK_APP_ID: "309504659968408",
  FACEBOOK_APP_SECRET: "a7b0083a3217100fca96200d364a90ab",
  GOOGLE_CLIENT_ID: "631648623348-q4v925bgid94b5mghjae24vim8tcv3eq.apps.googleusercontent.com",
  BASE_HREF: 'http://localhost:8001',
  GRECAPTCHA_SECRET_KEY: "6LfTWaIUAAAAAACxPJ-1f5px9Rbn0RwhqwDjuc7W",
  GEOIP_COUNTRY_PATH: "../../data/GeoLite2-Country.mmdb",
  CITIES_PATH: "../../data/cities.json",
  LOG_SERVER_PORT: 8009,
  SSR_SERVER_PORT: 8001,
  API_PORT: 8002
}

const env_beta = {
  ...env,
  BASE_HREF: 'https://beta.reall.me',
  DB_HOST: "rethinkdb",
  DB_NAME: "reall_beta",
  API_PORT: 8002,
  GRECAPTCHA_SECRET_KEY: "6LfTWaIUAAAAAACxPJ-1f5px9Rbn0RwhqwDjuc7W",
  LOG_SERVER_PORT: 8009,
  SSR_SERVER_PORT: 8008
}

const env_production = {
  ...env,
  BASE_HREF: 'https://reall.me',
  NODE_ENV: 'production',
  DB_NAME: "reall",
  API_PORT: 8102,
  GRECAPTCHA_SECRET_KEY: "6LfTWaIUAAAAAACxPJ-1f5px9Rbn0RwhqwDjuc7W",
  LOG_SERVER_PORT: 8109,
  SSR_SERVER_PORT: 8108
}

const envs = { env_beta, env_production, env}

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    {
      name      : 'session-service',
      script    : 'index.js',
      cwd       : 'session-service',
      ...envs
    },

    {
      name      : 'users-service',
      script    : 'index.js',
      cwd       : 'users-service',
      ...envs
    },

    {
      name      : 'email-service',
      script    : 'index.js',
      cwd       : 'email-service',
      ...envs
    },

    /*{
      name      : 'sms-service',
      script    : 'index.js',
      cwd       : 'sms-service',
      ...envs
    },*/

    {
      name      : 'log-server',
      script    : 'index.js',
      cwd       : 'log-server',
      ...envs
    },

    {
      name      : 'email-password-service',
      script    : 'index.js',
      cwd       : 'email-password-service',
      ...envs
    },

    {
      name      : 'phone-password-service',
      script    : 'index.js',
      cwd       : 'phone-password-service',
      ...envs
    },

    {
      name      : 'facebook-login-service',
      script    : 'index.js',
      cwd       : 'facebook-login-service',
      ...envs
    },

    {
      name      : 'google-login-service',
      script    : 'index.js',
      cwd       : 'google-login-service',
      ...envs
    },

    {
      name      : 'interests-service',
      script    : 'index.js',
      cwd       : 'interests-service',
      ...envs
    },

    {
      name      : 'projects-service',
      script    : 'index.js',
      cwd       : 'projects-service',
      ...envs
    },

    {
      name      : 'events-service',
      script    : 'index.js',
      cwd       : 'events-service',
      ...envs
    },

    {
      name      : 'api-server',
      script    : 'index.js',
      cwd       : 'api-server',
      ...envs
    },

    {
      name      : 'ssr-server',
      script    : 'server.js',
      cwd       : '../front',
      ...envs
    }

  ],

  deploy: {
    beta: {
      user: "root",
      host: "reall.default.svc.cluster.local",
      ssh_options: "StrictHostKeyChecking=no",
      ref: "origin/develop",
      repo : 'git@bitbucket.org:seniorplus/reall.git',
      path : '/root',
      'post-deploy' : './compile.sh && cd server && pm2 reload ecosystem.config.js --env beta',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
