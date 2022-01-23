# Stay Up

A simple ultra-lightweight service / host monitoring solution. This is the client application for StayUp. It relies on the server created in GO [here](https://github.com/SystemFiles/stay-up)

## Docker

Official image is to be used as follows:

```bash
docker pull sykeben/stayup-client:<version_tag>
```

## Available Options

Specified through environment varialbes you can and should set appripriate options for your environment.

- `API_WEBSOCK_URL` - The location to the websocket for your service data (note: must follow service model definition from [StayUp API](https://github.com/SystemFiles/stay-up))

- `API_BASE_URL` - Specifies the server base URL for the [StayUp Server](https://github.com/SystemFiles/stay-up) where we can create, edit and read service data

## Usage

Full usage instructions are included in the [parent project](https://github.com/SystemFiles/stay-up). Please continue reading usage there.
