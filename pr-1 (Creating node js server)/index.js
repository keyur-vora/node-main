const http = require('http');

const port = 9000;

const fs = require('fs');

const app = http.createServer((req, res) => {
    let fileName = "";
    
    switch (req.url) {
        case '/':
            fileName = "./home.html";
            break;
        case '/about':
            fileName = "./about.html";
            break;
        case '/contact':
            fileName = "./contact.html";
            break;
        case '/product':
            fileName = "./product.html";
            break;
        default:
            fileName = "./404.html";
    }

    fs.readFile(fileName, (err, pagename) => {
        if (err) {
            console.log(err);
            return false;
        }
        res.end(pagename)
    })
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`server is start on port :- ${port}`);

})