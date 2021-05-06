var express = require('express');
var app = express();

/*app.use(express.static("./"));*/
app.use(express.static(__dirname));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});



// respond with "hello world" when a GET request is made to the homepage
app.get('/getItemsJson', function (req, res) {
  var searchAPI = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=YuncongX-mytest01-PRD-816de56dc-5fbeda8c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=50&'
  var counter = 0;
  var condCounter = 0;
	var keyword = req.query.keyword;
  keyword = keyword.replace(/ /g,"+",keyword);
  //keyword = keyword.replace(/&/g,"%23",keyword);
  searchAPI += 'keywords=';
  searchAPI += keyword;
  var category = req.query.category;
  if(category == "Art"){
    searchAPI +='&categoryId=550';
  }
  else if(category == "Baby"){
    searchAPI +='&categoryId=2984';
  }
  else if(category == "Books"){
    searchAPI +='&categoryId=267';
  }
  else if(category == "Clothing,Shoes&Accessories"){
    searchAPI +='&categoryId=11450';
  }
  else if(category == "Computers/Tablets&Networking"){
    searchAPI +='&categoryId=58058';
  }
  else if(category == "Health&Beauty"){
    searchAPI +='&categoryId=26395';
  }
  else if(category == "Music"){
    searchAPI +='&categoryId=11233';
  }
  else if(category == "VideoGames&Consoles"){
    searchAPI +='&categoryId=1249';
  }

  if(req.query.condition1 != null || req.query.condition1 != undefined){
    searchAPI += '&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].name=Condition&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].value(';
    searchAPI += String(condCounter);
    searchAPI += ')=New';
    condCounter++;
    if(req.query.condition2 != null || req.query.condition2 != undefined){
      searchAPI += '&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].name=Condition&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].value(';
      searchAPI += String(condCounter);
      searchAPI += ')=Used';
      condCounter++;
    }
    if(req.query.condition3 != null || req.query.condition3 != undefined){
      searchAPI += '&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].name=Condition&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].value(';
      searchAPI += String(condCounter);
      searchAPI += ')=Unspecified';
      condCounter++;
    }
    counter++;
  }

  else if(req.query.condition2 != null || req.query.condition2 != undefined){
    searchAPI += '&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].name=Condition&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].value(';
    searchAPI += String(condCounter);
    searchAPI += ')=Used';
    condCounter++;
    if(req.query.condition1 != null || req.query.condition1 != undefined){
      searchAPI += '&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].name=Condition&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].value(';
      searchAPI += String(condCounter);
      searchAPI += ')=New';
      condCounter++;
    }
    if(req.query.condition3 != null || req.query.condition3 != undefined){
      searchAPI += '&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].name=Condition&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].value(';
      searchAPI += String(condCounter);
      searchAPI += ')=Unspecified';
      condCounter++;
    }
    counter++;
  }

  else if(req.query.condition3 != null || req.query.condition3 != undefined){
    searchAPI += '&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].name=Condition&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].value(';
    searchAPI += String(condCounter);
    searchAPI += ')=Unspecified';
    condCounter++;
    if(req.query.condition2 != null || req.query.condition2 != undefined){
      searchAPI += '&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].name=Condition&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].value(';
      searchAPI += String(condCounter);
      searchAPI += ')=Used';
      condCounter++;
    }
    if(req.query.condition1 != null || req.query.condition1 != undefined){
      searchAPI += '&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].name=Condition&itemFilter[';
      searchAPI += String(counter);
      searchAPI += '].value(';
      searchAPI += String(condCounter);
      searchAPI += ')=New';
      condCounter++;
    }
    counter++;
  }

  if(req.query.shipping1 != null || req.query.shipping1 != undefined){
    searchAPI += '&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].name=LocalPickupOnly&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].value=true';
    counter++;
  }

  if(req.query.shipping2 != null || req.query.shipping2 != undefined){
    searchAPI += '&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].name=FreeShippingOnly&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].value=true';
    counter++;
  }

  searchAPI += '&itemFilter[';
  searchAPI += counter;
  searchAPI += '].name=HideDuplicateItems&itemFilter[';
  searchAPI += counter;
  searchAPI += '].value=true';
  counter++;

  if(req.query.distance != null || req.query.distance != undefined){
    var distance = req.query.distance;
    searchAPI += '&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].name=MaxDistance&itemFilter[';
    searchAPI += String(counter);
    searchAPI += '].value=';
    searchAPI += String(distance);
    counter++;
  }
  if(req.query.zip != null || req.query.zip != undefined){
    var zip = req.query.zip;
    searchAPI += '&buyerPostalCode=';
    searchAPI += String(zip);
  }
  searchAPI += '&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
  searchAPI = encodeURI(searchAPI)
  var request = require('request');
  request.get({
      url: searchAPI,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, response, data) => {
      if(err){
        console.log('Error:', err);
      }
      else if(res.statusCode !== 200) {
        console.log('Status:', response.statusCode);
      }
      else{
          res.setHeader('content-type', 'application/json');
      res.json(data);
      }
  });
	res.setHeader('Content-Type', 'application/json');
});

app.get('/zipAuto',function (req, res) {
  var autoURL = 'http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=';
  var toBComplete = req.query.zipcode;
  autoURL = autoURL + String(toBComplete) + '&username=ycxgeo&country=US&maxRows=5';
  var request = require('request');
  request.get({
      url: autoURL,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, response, data) => {
      if(err){
        console.log('Error:', err);
      }
      else if(res.statusCode !== 200) {
        console.log('Status:', response.statusCode);
      }
      else{
          res.setHeader('content-type', 'application/json');
          res.json(data);
      }
  });
  res.setHeader('Content-Type', 'application/json');

});

app.get('/detail',function (req, res) {
  var detailURL = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=YuncongX-mytest01-PRD-816de56dc-5fbeda8c&siteid=0&version=967&ItemID=';
  detailURL += req.query.id;
  detailURL += '&IncludeSelector=Description,Details,ItemSpecifics'; //incorrect on server side because of the space between Item and Specifics
  var request = require('request');
  request.get({
      url: detailURL,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, response, data) => {
      if(err){
        console.log('Error:', err);
      }
      else if(res.statusCode !== 200) {
        console.log('Status:', response.statusCode);
      }
      else{
          res.setHeader('content-type', 'application/json');
          res.json(data);
      }
  });
  res.setHeader('Content-Type', 'application/json');

});

app.get('/photoSearch',function (req, res) {
  var googURL = 'https://www.googleapis.com/customsearch/v1?q='
  googURL += encodeURI(req.query.prod);
  googURL += '&cx=000554983876462944410:q65k_dq0ocs&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyCtn0RfqkaNym396dFO_yD0k9kBIUalixA';

  
  var request = require('request');
  request.get({
      url: googURL,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, response, data) => {
      if(err){
        console.log('Error:', err);
      }
      else if(res.statusCode !== 200) {
        console.log('Status:', response.statusCode);
      }
      else{
          res.setHeader('content-type', 'application/json');
          res.json(data);
      }
  });
  res.setHeader('Content-Type', 'application/json');

});

app.get('/simSearch',function (req, res) {
  var simURL = 'http://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=YuncongX-mytest01-PRD-816de56dc-5fbeda8c&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId='
  simURL += req.query.searchId;
  simURL += '&maxResults=20';
  
  var request = require('request');
  request.get({
      url: simURL,
      
      headers: {'User-Agent': 'request'}
    }, (err, response, data) => {
      if(err){
        console.log('Error:', err);
      }
      else if(res.statusCode !== 200) {
        console.log('Status:', response.statusCode);
      }
      else{
          res.setHeader('content-type', 'application/json');
          res.json(data);
      }
  });
  res.setHeader('Content-Type', 'application/json');

});

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   /*console.log("app listening at port %s", port);*/
})