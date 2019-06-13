# Reall

## Requirements

- RethinkDB database
- recli
- Node.js v10
- PM2

## Instalation

    git submodule init
    git submodule update --init --recursive
    npm install
    recli "r.dbCreate('reall')"
    cd server
    pm2 start ecosystem.config.js
    open http://localhost:8001
   
## Set admin rights

Register user account with email and password and then use this command in rethinkdb panel:    
   
    r.db("reall").table("emailPassword_EmailPassword").get("email@example.com").do(
      loginMethod => r.db('reall').table('users_User').get(loginMethod('user')).update({ roles : ["admin"]})
    )
    
## Admin panel
   
    cd admin
    npm run serve
    open http://localhost:8008    
    
    