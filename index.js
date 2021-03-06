const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const apiKey = 'fa16ccd2660170f785d4f056e76c4fea';

var dateFromNum = require('date-from-num');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
	
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) { 
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {

               var weatherText = "Current Weather Conditions for " + weather.name + ":" +
                   '<br>' + " Current Time: <span id='lastUpdated'></span>" +
                   '<br>' + " Temperature: " + weather.main.temp + " degrees &#8457;" +
                   '<br>' + "Pressure: " + weather.main.pressure + " mmHg" +
                   '<br>' + " Humidity: " + weather.main.humidity + " %" +
                   '<br>' + " Wind Speed: " + weather.wind.speed + " mph" +
                   '<br>' + " Wind Direction: " + weather.wind.deg + " &#176;" +
                   '<br>' + " Cloudiness: " + weather.clouds.all + " %" +
                   '<br>' + " Sunrise: <span id='sunrise'></span>" +
                   '<br>' + " Sunset: <span id='sunset'></span>"

               res.render('index', {
                   weather: weatherText,
                   lastUpdated: dateFromNum(weather.dt),
                   sunrise: dateFromNum(weather.sys.sunrise),
                   sunset: dateFromNum(weather.sys.sunset),
                   error: null
               });
           }
    }
  });
})

app.listen(process.env.PORT || '3000');

//app.listen(3000, function () {
  //console.log('Example app listening on port 3000!')
//})