// Create web server
// Create http module
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'comments'
});

http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;
    var query = url.parse(req.url, true).query;
    var data = '';

    if (path == '/add') {
        req.on('data', function(chunk) {
            data += chunk;
        });

        req.on('end', function() {
            data = qs.parse(data);
            connection.query('INSERT INTO comments (name, comment) VALUES (?, ?)', [data.name, data.comment], function(err, result) {
                if (err) {
                    console.log(err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Comment added successfully');
                }
            });
        });
    } else if (path == '/get') {
        connection.query('SELECT * FROM comments', function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify(rows));
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Page not found');
    }
}).listen(8000);

console.log('Server running at http://