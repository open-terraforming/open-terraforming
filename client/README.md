# mdd-frontend

## Commands

### Dev server

```
npm start
```

### Production build

```
npm run build
```

### Local prod build

Used to test production build locally, builds the application in production mode and start static server that servers the built application

```
npm run start-prod
```

## Dev notes

### Tools

It's recommended to use Visual Studio Code with following extensions:

 - ESLint
 - vscode-styled-components
 - stylelint

Repository already contains some basic editor settings.

### Configuration

Following files can be used for setting basic configuration values:

```
.env
.env.local
.env.development
.env.development.local
.env.production
.env.production.local
```

Where .dev/prod is used only for dev/prod builds and .local are ignored by git, so use those if you need some local changes.

_NOTE:_ You have to restart webpack to apply changes in these files
