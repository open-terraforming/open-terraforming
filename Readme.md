![Open Terraforming](./presentation/open-terraforming-logo.png)

Open source implementation of terraforming focused board game. You can play it at https://play.open-terraforming.eu or just host it yourself.

Not associated with Firaxis Games.

## Screenshots

![ingame screenshot](./presentation/ingame-1.jpg)
![other screenshot](./presentation/new-game-screen.jpg)

## Features

 - **Web application** - all you need to play is your browser
 - **Multiplayer** - play with your friends by simply sharing a link
 - **Fancy UI** - hand crafted UI with animations, almost like a real game
 - **Bots** - they aren't very smart, but they're there!
 - **Self host** - you can run it just for yourself!
 - **Open Source** - you can change anything you want, create your own expansions, the possibilities are endless!

## Hosting

Easiest way to host is to use prepared docker image.

### Docker Compose
Create `docker-compose.yml`:

```yaml
services:
  open_terraforming:
    image: openterraforming/open-terraforming
    container_name: open_terraforming
    ports:
      - 8000:80
    volumes:
      - data:/data
    restart: unless-stopped

volumes:
  data:
```

Run:

```sh
docker compose up -d
```

### Docker run

1. Create a Docker volume named data, this will be used to store running and paused game states
```sh
docker volume create data
```

2. Run the open_terraforming container:

```sh
docker run -d \
  --name open_terraforming \
  -p 8000:80 \
  -v data:/data \
  --restart unless-stopped \
  openterraforming/open-terraforming
```

### Configuration options

| Environment variable | Default value | Description |
| --- | --- | --- |
| PORT | `80` | Port on which HTTP server will listen |
| OT_SLOTS | `20` | Maximum number of simultaneous games running |
| OT_PLAYERS_MAX | `20` | Maximum number of players per game |
| OT_SPECTATORS_MAX | `20` | Maximum number of spectators |
| OT_BOTS_ENABLED | `true` | Enable bots |
| OT_BOTS_MAX | `5` | Maximum number of bots |
| OT_STORAGE_USE_COMPRESSION | `true` | Compress games when storing them |
| OT_STORAGE_CLEAN_AFTER | `6w` | After how long should game be removed from storage when there's no activity, see https://www.npmjs.com/package/parse-duration for syntax |
| OT_STORAGE_CLEAN_INTERVAL | `1d` | How often to check for games that need to be removed, see https://www.npmjs.com/package/parse-duration for syntax |
| OT_PUBLIC_GAMES_ENABLED | `true` | Enable players to create a public server listed in server list |
| METRICS_ENABLED | `false` | Export prometheus metrics |
| METRICS_ENDPOINT | `/metrics` | Prometheus metrics export endpoint |
| METRICS_USERNAME | `metrics` | Prometheus metrics export username |
| METRICS_PASSWORD | `metrics` | Prometheus metrics export password |

## Contributing
