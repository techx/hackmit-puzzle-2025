# lemonade_stand

## Architecture Overview

The architecture of the challenge looks like this:

<svg xmlns="http://www.w3.org/2000/svg" style="background: #ffffff; background-color: light-dark(#ffffff, var(--ge-dark-color, #121212)); color-scheme: light dark;" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="341px" height="381px" viewBox="-0.5 -0.5 341 381"><defs></defs><rect fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212));" width="100%" height="100%" x="0" y="0"></rect><g><g data-cell-id="0"><g data-cell-id="1"><g data-cell-id="fPfulMlJUl1dtLb1NGyk-3"><g><path d="M 120 30 L 140 30 L 130 30 L 143.63 30" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 148.88 30 L 141.88 33.5 L 143.63 30 L 141.88 26.5 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-1"><g><rect x="0" y="0" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">User</div></div></div></foreignObject><text x="60" y="34" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">User</text></switch></g></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-14"><g><path d="M 210 60 L 210 80 L 210 93.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 210 98.88 L 206.5 91.88 L 210 93.63 L 213.5 91.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-2"><g><rect x="150" y="0" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 151px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><div>Web Server</div><div>(nginx)</div></div></div></div></foreignObject><text x="210" y="34" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">Web Server...</text></switch></g></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-6"><g><rect x="70" y="140" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 170px; margin-left: 71px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><div>Frontend</div><div>(vite static build)</div></div></div></div></foreignObject><text x="130" y="174" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">Frontend...</text></switch></g></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-18"><g><path d="M 280 200 L 280 220 L 280 210 L 280 223.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 280 228.88 L 276.5 221.88 L 280 223.63 L 283.5 221.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-13"><g><rect x="220" y="140" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 170px; margin-left: 221px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><div>websocat</div><div>(static binary)</div></div></div></div></foreignObject><text x="280" y="174" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">websocat...</text></switch></g></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-15"><g><path d="M 210 100 L 130 100 L 130 133.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 130 138.88 L 126.5 131.88 L 130 133.63 L 133.5 131.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-16"><g><path d="M 210 100 L 280 100 L 280 133.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 280 138.88 L 276.5 131.88 L 280 133.63 L 283.5 131.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-20"><g><path d="M 280 290 L 280 310 L 280 300 L 280 313.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 280 318.88 L 276.5 311.88 L 280 313.63 L 283.5 311.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-17"><g><rect x="220" y="230" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 260px; margin-left: 221px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><div>redpwn jail</div><div>(TCP listener)</div></div></div></div></foreignObject><text x="280" y="264" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">redpwn jail...</text></switch></g></g></g><g data-cell-id="fPfulMlJUl1dtLb1NGyk-19"><g><rect x="220" y="320" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 350px; margin-left: 221px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><div>lemonade_stand</div><div>(C binary)</div></div></div></div></foreignObject><text x="280" y="354" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">lemonade_stand...</text></switch></g></g></g></g></g></g></svg>

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

<svg xmlns="http://www.w3.org/2000/svg" style="background: #ffffff; background-color: light-dark(#ffffff, var(--ge-dark-color, #121212)); color-scheme: light dark;" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="321px" height="321px" viewBox="-0.5 -0.5 321 321"><defs></defs><rect fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212));" width="100%" height="100%" x="0" y="0"></rect><g><g data-cell-id="0"><g data-cell-id="1"><g data-cell-id="rERx1aLGeXzcXioiHwQ4-7"><g><path d="M 120 120 L 193.63 120" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 198.88 120 L 191.88 123.5 L 193.63 120 L 191.88 116.5 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-8"><g><path d="M 60 150 L 60 170 L 60 150 L 60 163.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 60 168.88 L 56.5 161.88 L 60 163.63 L 63.5 161.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-1"><g><rect x="0" y="90" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 120px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">NGINX Container</div></div></div></foreignObject><text x="60" y="124" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">NGINX Container</text></switch></g></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-10"><g><path d="M 60 230 L 60 250 L 60 240 L 60 253.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 60 258.88 L 56.5 251.88 L 60 253.63 L 63.5 251.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-2"><g><rect x="0" y="170" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 200px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">Docker network</div></div></div></foreignObject><text x="60" y="204" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">Docker network</text></switch></g></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-4"><g><rect x="0" y="0" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">Internet</div></div></div></foreignObject><text x="60" y="34" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">Internet</text></switch></g></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-5"><g><path d="M 60 60 L 60 83.63" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 60 88.88 L 56.5 81.88 L 60 83.63 L 63.5 81.88 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-6"><g><rect x="200" y="90" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 120px; margin-left: 201px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">Static bundle (stored inside image)</div></div></div></foreignObject><text x="260" y="124" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">Static bundle (store...</text></switch></g></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-12"><g><path d="M 120 290 L 193.63 290" fill="none" stroke="#000000" style="stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke-miterlimit="10" pointer-events="stroke"></path><path d="M 198.88 290 L 191.88 293.5 L 193.63 290 L 191.88 286.5 Z" fill="#000000" style="fill: light-dark(rgb(0, 0, 0), rgb(255, 255, 255)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" stroke-miterlimit="10" pointer-events="all"></path></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-9"><g><rect x="0" y="260" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 290px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">redpwn jail container (privileged)</div></div></div></foreignObject><text x="60" y="294" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">redpwn jail containe...</text></switch></g></g></g><g data-cell-id="rERx1aLGeXzcXioiHwQ4-11"><g><rect x="200" y="260" width="120" height="60" fill="#ffffff" style="fill: light-dark(#ffffff, var(--ge-dark-color, #121212)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));" stroke="#000000" pointer-events="all"></rect></g><g><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 290px; margin-left: 201px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; color: #000000; "><div style="display: inline-block; font-size: 12px; font-family: &quot;Helvetica&quot;; color: light-dark(#000000, #ffffff); line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><div>lemonade_stand</div><div>(local processes)</div></div></div></div></foreignObject><text x="260" y="294" fill="light-dark(#000000, #ffffff)" font-family="&quot;Helvetica&quot;" font-size="12px" text-anchor="middle">lemonade_stand...</text></switch></g></g></g></g></g></g></svg>

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
