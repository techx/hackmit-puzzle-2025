# hackmit-puzzle-2025


## Development

### Getting Started

First enter the command center:
```sh
cd command-center
```
To start the docker, run

```sh
docker compose up
```

Now in a new terminal in the command-center folder, run
```sh
docker compose exec web bash
```
and then 
```sh
python wsgi.py
```
Make sure you are in the command-center.

To start the client, in a different terminal, run
```sh
cd command-center
cd client
npm install
npm run dev
```
. No need for docker for client.

To stop, run 
```sh
docker compose down
```
or control+C and wait for completion.