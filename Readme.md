![Open Terraforming](./presentation/open-terraforming-logo.png)

Open source implementation of terraforming focused board game. You can play it at https://terraforming.cerno.ch or just host it yourself.

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
| OT_ENABLE_BOTS | `true` | Enable bots |
| OT_FAST_BOTS | `false` | Bots should execute all their actions immediately |

## Contributing
