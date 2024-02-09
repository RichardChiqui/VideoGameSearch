const express = require('express');
const routes = require('./routes');
const app = express();
const controller = require("./controller");
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.get("/api", (req,res) =>{
    res.json({"users":["userone","usertwo"]})
})


app.use('/', routes);
app.listen(5000,() => {console.log("backend started on port 5000")})