/*

TibiaChar RPC Server 2.1.2

Provides Tibia character profile data via a JSON API on localhost.

Hint: Tell users to put the hash value of their character name into
the comment section on their tibia character profile, and you have
a way to confirm if they actually own the character!

love, Erin Steph 2017
(See me on Refugia!)

*/

/*------ installing ------//
Express: $ npm install express --save
Request: $ npm install request
Sha.js: $ npm install sha.js
//------------------------*/

// Config:
  const port = 9980; // set the port for the RPC server to listen on. Default for TibiaChar is 9980.
  const seed = 'fjylhojjhnmmjkftjyjtyjyuiuyjthdg'; // CHANGE THIS. Ten to infinity random chars, more chars = more secure, but slower. Around 30 is good.
  const allowed = "*"; // Whether the API is public or not. Not a secure method of keeping others out. "*" for public, "localhost" for private.


//This is the code.


console.log('-----------------------------------------');
console.log('|  _____ _ _   _     _____ _            |');            
console.log('| |_   _|_| |_|_|___|     | |_ ___ ___  |'); 
console.log('|   | | | | . | | .\'|   --|   | .\'|  _| |'); 
console.log('|   |_| |_|___|_|__,|_____|_|_|__,|_|   |'); 
console.log('|--------------------------------v2.1.2-|');
console.log('|       - TibiaChar RPC Server -        |');
console.log('|        A local API server for         |');
console.log('|         tibia character data.         |'); 
console.log('| * Query on http://localhost:' + port + '/     |'); 
console.log('| * Type char name to view in console   |'); 
console.log('| * Type quit to exit                   |'); 
console.log('-----------------------------------------');


function tibiachar(){
  this.request = require('request');
}

tibiachar.prototype = {
    
  get : function(name, collo){
      
    function strip_tags(html){
      if(arguments.length < 3){
        html = html.replace(/<\/?(?!\!)[^>]*>/gi, '');
      }else{
        var allowed = arguments[1];
        var specified = eval("["+arguments[2]+"]");
        if(allowed){
          var regex='</?(?!(' + specified.join('|') + '))\b[^>]*>';
          html = html.replace(new RegExp(regex, 'gi'), '');
        }else{
          var regex='</?(' + specified.join('|') + ')\b[^>]*>';
          html = html.replace(new RegExp(regex, 'gi'), '');
        }
      }
      var clean_string = html;
      return clean_string; 
    }
      this.request('https://secure.tibia.com/community/?subtopic=characters&name=' + name.replace(/[^A-Za-z]+/g, '+'), function(error, response, body){
        var data = {}; 
        data.name = name.replace(/[^A-Za-z]+/g, ' ');
          data['name-linked'] = '<a target="_blank" href="https://secure.tibia.com/community/?subtopic=characters&name=' + name.replace(/[^A-Za-z]+/g, '+') + '">' + data.name + '</a>';
        if(body.indexOf('<td>Sex:</td><td>') > 1){
          data['sex'] = body.split('<td>Sex:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['sex'] = null;
        }        
        if(body.indexOf('<td>Vocation:</td><td>') > 1){
          data['vocation'] = body.split('<td>Vocation:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['vocation'] = null;
        }   
        if(body.indexOf('Level:</td><td>') > 1){
          data['level'] = body.split('Level:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['level'] = null;
        }       
        if(body.indexOf('<nobr>Achievement Points:</nobr></td><td>') > 1){
          data['points'] = body.split('<nobr>Achievement Points:</nobr></td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['points'] = null;
        }       
        if(body.indexOf('<td>World:</td><td>') > 1){
          data['world'] = body.split('><td>World:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['world'] = null;
        }        
        if(body.indexOf('<td>Residence:</td><td>') > 1){
          data['home'] = body.split('<td>Residence:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['home'] = null;
        }
        if(body.indexOf('<td>Guild&#160;Membership:</td><td>') > 1){
          data['guild-text'] = strip_tags(body.split('<td>Guild&#160;Membership:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '')).replace(/\&\#160\;/g, ' ');
          data['guild-linked'] = body.split('<td>Guild&#160;Membership:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '').replace(/\&\#160\;/g, ' ');
          data['guild-name'] = strip_tags(body.split('<td>Guild&#160;Membership:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '')).replace(/\&\#160\;/g, ' ').split(' of the ')[1];
          data['guild-rank'] = strip_tags(body.split('<td>Guild&#160;Membership:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '')).replace(/\&\#160\;/g, ' ').split(' of the ')[0];
        }else{
          data['guild-text'] = null;
          data['guild-linked'] = null;
          data['guild-name'] = null;
          data['guild-rank'] = null;
        }       
        if(body.indexOf('<td>Last Login:</td><td>') > 1){
          data['last-online'] = body.split('<td>Last Login:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '').replace(/\&\#160\;/g, ' ');
        }else{
          data['last-online'] = null;
        }   
        if(body.indexOf('<td valign=top>Comment:</td><td>') > 1){
          data['comment'] = body.split('<td valign=top>Comment:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['comment'] = null;
        } 
        if(body.indexOf('<td>Account&#160;Status:</td><td>') > 1){
          data['status'] = body.split('<td>Account&#160;Status:</td><td>')[1].split('</td>')[0].replace(/[ ]+$/g, '');
        }else{
          data['status'] = null;
        }
        collo(data);  
    });    
  }        
};     

var tib = new tibiachar();
var rpc = require('express')();
var createHash = require('sha.js')

function sha(inp){
  var sha256 = createHash('sha1')
  var h = sha256.update(inp, 'utf8').digest('hex')
  return h;
}

rpc.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", allowed);
  next();
});

rpc.get('/:data', function(req, res){
  tib.get(req.params.data, function(i){
    i['hash'] = sha(i['name']);
      console.log('> loaded data for ' + i['name']);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(i));
  });
});

rpc.get('', function(req, res){
    if(req.query.n){
      tib.get(req.query.n, function(i){
        i['hash'] = sha(i['name']);
        console.log('> loaded data for ' + i['name']);
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(i));
       });  
    }else{
      res.send('<html><body><form action="/" method="GET"><input name="n" type="text" placeholder="Name"><button id="get" type="submit">Get</button></form></body></html>');
    }
});

rpc.listen(port, function(){
  console.log('> TibiaChar RPC Server listening on port ' + port + '.');
});

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    if(d.toString().trim() != 'quit'){
      tib.get(d.toString().trim(), function(i){
        i['hash'] = sha(i['name']);
        console.log('> loaded data for ' + i['name'] + ':');
        for(key in i){
          if(key.indexOf('linked') < 1){ 
            console.log("  " + key + ": " + i[key]);
          }
        }
      });
    }else{
      console.log('>  quitting...');
      process.exit();  
    }
  });