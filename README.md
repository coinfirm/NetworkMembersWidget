# Network Members widget

## Installation
Copy content of `dist` directory to your web application scripts and styles. 

## Implementation

### Front-side
Add following code to `<head>` of your site:
```html
<link rel="stylesheet" href="path/to/amlt-widget.css">
<script src="path/to/amlt-widget.js"></script>
```

```html
<div id="amlt-widget" data-url="/example/server.php" data-user-input="true">
    <img src="data:image/png;base64,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">
</div>
```
**Params**

Parameter | Type | Description
------------ | ------------- | -------------
data-url | String | URL Address on your backend, used to send widget data trough API  
data-logo* | String | URL Address of your logo  
data-user-input* | Boolean | Allow user to identify himself (can be also made on server-side)

\* - optional

### Server-side
Reported addresses are stored under specific Network Member profile.
This is why address reporting MUST BE done by API request.

Endpoint used to report addresses:

```
https://api.coinfirm.com/v3/panels/nm/reported_address
```
Method: `POST`

Payload:

Parameter | Type | Description | Example value
------------ | ------------- | ------------- | -------------
address | String | Address to report | 
address_type | String | Address type | ETH
rate | Number | Address rate 0 - negative, 1 - neutral, 2 - positive | 0 
owner (optional) | String | Address owner name | Coinfirm
description (optional) | String | Some additional info about address | 
urls (optional) | Object[] | Array of links connected to address | `[ [ "url" => "https://coinfirm.com" ], ... ]`
files | Object[] | Array of proof files connected to address | `[ [ "base64" => "...", "type" => "image/png" ], ... ]`
 

### Examples
-  [PHP server-side implementation](https://github.com/coinfirm/NetworkMembersWidget/tree/master/examples/php)

## Development
Install dependecies
```
npm i
```
Build and minimize assets before deployment
```
npm run build
```
