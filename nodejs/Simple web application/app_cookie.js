const server = require("./cookie_server")
const handle = require("./cookie_handlers")

let handlers = {};
handlers["/products"] = handle.products;
handlers["/cart"] = handle.cart;
handlers["/cart/:id"] = handle.cartID;

server.start(handlers);
