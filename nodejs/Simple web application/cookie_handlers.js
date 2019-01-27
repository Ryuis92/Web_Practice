

let product_list = {1: "computer",
                    2: "Tank"
                  };

function products (req, res){
  let html = "";
  for (var item in product_list)
    html += `<li><a href = "/cart/${item}">${product_list[item]}</a></li>`
  res.send(`<h1>Products</h1><ul>${html}</ul><a href = "/cart">Cart</a>`)
};

function cartID (req, res){
  let id = req.params.id;
  let cart;

  if(req.signedCookies.cart){
    cart = req.signedCookies.cart;
    if(cart[id])
      cart[id] = parseInt(cart[id]) + 1;
    else
      cart[id] = 1;

  }
  else{
     cart = {};
     cart[id] = 1;
  }

  res.cookie("cart", cart, {signed: true});
  res.redirect("/cart");
};

function cart (req, res){
  let output = "";
  let cart = req.signedCookies.cart;
  if(cart){
    for( var item in cart)
      output += `<li>${product_list[item]} : ${cart[item]}</li>`
    output = `<h1>Cart</h1><ul>${output}</ul>`;
  }
  else{
    output = "Cart is empty!";
  }
  res.send(output);
};


exports.products = products;
exports.cart = cart;
exports.cartID = cartID;
