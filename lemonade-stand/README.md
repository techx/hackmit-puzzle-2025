# lemonade_stand

## Architecture Overview

The architecture of the challenge looks like this:

![Architecture diagram](./architecture.svg)

### Components at a high-level

- The frontend is a Vite react site.
  We export it to a **static bundle** of HTML/CSS/JS etc. files which can be served by any webserver.
- The NGINX web server forwards requests to the websocket route to `websocat`'s listening webserver.
  All other requests are statically served from the static asset bundle.
- Websocat forwards all websocket connections to the redpwn jail's listening TCP server.
- The redpwn jail sandboxes the binary and mitigates attacks against the infrastructure.
  It starts a network server that will create a new process running the C binary for every connection.
- The C source code is compiled to a **dynamically linked binary**.

The ending result is that any messages sent over the TCP will be sent to the _standard input_ of the C binary.
Any output that the C binary prints over _stdard output_ will be sent as websocket messages to the client.

## Deployment architecture

![Deployment diagram](./deployment.svg)

The `docker-compose` setup describes two containers connected by a shared internal network.

- The NGINX container exposes an HTTP server to the internet.
  It also runs the `websocat` binary.
- The redpwn jail container runs the C binary as local processes.
  The jail container is not exposed to the internet (arbitrary decision).

The websocat binary uses the internal docker network to resolve the IP address of the jail container.
It connects to the jail container on a known TCP port.

## Development setup

Everything is inside the `frontend/` directory.
It is a standard `vite` powered react setup.
Initially used `pnpm` but any package manager like `npm` or `yarn` should be sufficient, just substitute into the commands below.

```sh
cd frontend
pnpm install
pnpm run dev
```

The frontend must have a server to communicate with in order for most features to work.

The pre-built binaries are linux only, so running the redpwn jail container must be a Linux container.
A different method to get this working would be to build `lemonade_stand.c` binary
(compile instructions are in the comment at the top) for your OS and then use websocat's `exec` mode to spawn the binary.
That is out of the scope of this guide.

First, build the redpwn jail `Dockerfile` using a command like:

```sh
cd deploy
docker build -f Dockerfile.backend . -t lemonade-jail --load
```

And then run the resulting image using a command like:

```sh
docker run --rm --privileged -p 5000:5000 -i lemonade-jail
```

On linux, you can start up a `websocat` server as follows:

```sh
cd deploy
sh ../websocat.sh
```

For other OS:

1. Go to the [websocat GitHub page](https://github.com/vi/websocat/releases)
2. Click on the (name of the) latest release on the right
3. Download the asset that matches your OS and platform
4. Use your command line to run the command conatined in `websocat.sh`,
   substituting the binary path at the beginning for the path to the one you downloaded.

Now, update the source code to use your local server.
Edit `frontend/src/App.tsx` and change

```tsx
// const host = "127.0.0.1:4300";
const host = location.host + "/ws/";
```

to

```tsx
const host = "127.0.0.1:4300";
// const host = location.host + "/ws/";
```

The frontend should now connect to the `websocat` server running on your local port `4300`,
which will connect to the docker container running on local port `5000`.

## Deployment procedure

### Building the distributable file

The point of the challenge is to exploit the binary, not guess what the server is doing blindly.
At the same time, reverse engineering the binary is expected,
and giving out the source code directly would remove some of the difficulty and fun (arguable) of the challenge.
Thus we must provide hackers with _some files_ to solve the challenge, but not _every_ file.

The root of the distributable file will be the `deploy/` directory.
Everything that needs to be in this directory is checked in to `git`, **except** the frontend assets.
To include them, first:

```sh
cd frontend
pnpm build
mv dist/ ../deploy/
```

Then you can package deploy into a distributable tarball:

```sh
cd deploy/
tar czv . -f ../lemonade_stand.tar.gz
```

(Doing it from inside the `deploy` directory ensures that the files are at the root of the tar archive.
It is a matter of taste but this is a "nicer" file structure for extracting versus having a single directory in root.)

Before deploying, spawn a fresh container/VM, try to unzip the tarball, and ensure that the `docker-compose` setup works:

```sh
docker-compose up
```

Then test the frontend, and test `solve.js` by running in the JS console on the frontend.
Also, open the `lemonade_stand` file in a disassembler and make sure everything looks good.
This means:

- ensure symbols are present (not stripped)
- ensure there are no "aggressive" optimizations making the binary hard to reverse

### Deploying on a VPS

This challenge **must** be deployed on an `x86_64 Linux` server.
(The exploitation conditions have not been tested for binaries for other architectures.)
Extract the distributable, replace the fake flag with a real one, and start up `docker-compose`:

```sh
docker-compose up -d
```

The NGINX server should be publicly exposed on port `80`.
Adjust this in the `docker-compose.yml` if needed (e.g. to run behind another reverse proxy).

## Building the challenge binary

The challenge is designed for `glibc` version `2.31` **only**.
Different `glibc` versions will have different mitigations that can **significantly affect the difficulty or even make the puzzle impossible!**
To build the binary, the `Dockerfile.build` can be used:

```sh
docker build -f Dockerfile.build -t glibc231 . --load
```

(make sure you don't have any huge files in the current directory first so as to not explode the build context.)

Then enter the docker container interactively:

```sh
docker run --rm -v "$(pwd)":/home/builder/src -it glibc231
```

Assuming the `lemonade_stand.c` file is in your current working directory when you entered the container,
you can then build the binary using the command at the top of the source code

```sh
gcc ... /* args omitted -- go copy them from the top of lemonade_stand.c */
```

Then you should have a binary `lemonade_stand` in your current directory which can be moved to the `deploy/` directory:

```sh
mv lemonade_stand deploy/
```
