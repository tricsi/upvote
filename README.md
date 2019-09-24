# Upvote
Vote system using Swiss System rules.

## Project setup
```
npm install
```

### Import dev database
Make sure your GitHub username is present in `data/import.json` if you want be able to vote
```
DATABASE_URL=sqlite:db.sqlite npm run import
```

### Setup nodemon.json dev configuration
- Rename `nodemon.json.dist` to `nodemon.json`
- Set `DATABASE_URL` as `sqlite:db.sqlite`
- Set `GITHUB_ID` and `GITHUB_SECRET`:
  - Create an application on https://github.com/settings/apps
  - Set `Homepage URL` and `User authorization callback URL` as `http://localhost:8080/`
  - Copy `Client ID` and `Client secret` into `nodemon.json`
- Set `VOTE_CLOSED` to `false` if you want be in the voting phase

### Compiles and hot-reloads for development
```
npm run debug
npm run serve
```

open http://localhost:8080/

### Compiles and minifies for production
```
yarn run build
```
