let apiKey = '9f75af2cc9785ecfc80929ccd3080e4e'
let cityName = 'Dallas'
    // let queryURL = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
let curName = "";
let curTemp = "";
let curHumid = "";
let curWind = "";
let curUV = "";
let curIcon = "";


searchWeather()
fiveDay()

function searchWeather() {
    let today = moment().format("MM/D/YY");
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`
    $.ajax({
        url: queryURL
    }).then(response => {


        $.ajax(`http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${apiKey}`).then(uvResp => {



            let uvData = `<p>UV Index: ${uvResp.value} </p>`
            $("#mainData").append(uvData)
        })
        curName = response.name;
        curTemp = response.main.temp;
        curWind = response.wind.speed;
        curHumid = response.main.humidity;
        curIcon = response.weather.icon;
        console.log(response)
        let mainData = `<h2>${curName} (${today})<img src="http://openweathermap.org/img/w/${curIcon}.png"></img></h2>
                            <p>Temperature: ${curTemp} °F</p>
                            <p>Humidity: ${curHumid}%</p>
                            <p>Wind Speed: ${curWind} MPH</p>
                           `
        $("#mainData").append(mainData)

    });
};


function fiveDay() {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=0&units=imperial&appid=${apiKey}`
    $.ajax({
        url: queryURL
    }).then(forecast => {
        console.log(forecast)
        for (let i = 0; i < 40; i += 8) {
            console.log(forecast.list[i].dt_txt)
            foreDate = (forecast.list[i].dt_txt).slice(0, -8)
            foreTemp = forecast.list[i].main.temp
            foreIcon = forecast.list[i].weather[0].icon
            foreHumid = forecast.list[i].main.humidity
            let cardData = `<div class="card border-light" style="width: 10rem;">
                              <div class="card-body bg-primary text-white">
                               <h5 class="card-title">${foreDate}</h5>
                               <p class="card-text"><img src="http://openweathermap.org/img/w/${foreIcon}.png"></img></p>
                               <p class="card-text">Temp: ${foreTemp} °F</p>
                               <p class="card-text">Humidity: ${foreHumid}%</p>
                              </div>
                            </div>`

            $("#forecast").append(cardData)
        }



    });

}