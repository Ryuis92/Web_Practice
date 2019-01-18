const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/",(req, res) => {
    var text = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>sketch</title>
    <style>
        header {
            position: absolute;
            background: blue;
            top: 0px;
            width: 100%;
            height: 100px;
        }

        footer {
            position: absolute;
            background: yellow;
            bottom: 0px;
            width: 100%;
            height: 100px;
        }

        a:link {
            color: red;
        }

        a:visited {
            color: pink;
        }

        a {
            color: black;
        }

        a:hover {
            font-size: 50px;
            color: green;
        }
    </style>
</head>

<body>
    <script>
        var obj = { 'name' : 1};


    </script>
    <header>
        <h1>This is sketch</h1>

    </header>
    <main>
        <h3>list of resourceful sites </h3>
        <ul>
            <li><a href="https://github.com/Ryuis92">Github</a></li>
        </ul>
    </main>
    <footer>

        <h1>Here is footer</h1>
    </footer>
</body>

</html>`

    res.send(text);
});

app.get("/login",(req, res) => {
    res.send("<h1>Login</h1>");
});

app.listen(3000, () => {
    console.log("Server has started listening 3000 port");
});
