//setting api key and other variables that will be used
let apiKey = '9f75af2cc9785ecfc80929ccd3080e4e'
let cityName = 'Dallas'
let curName = "";
let curTemp = "";
let curHumid = "";
let curWind = "";
let curUV = "";
let curIcon = "";
let cities = [];


//these functions run on load.
cityWeather();
init();
fiveDay();



//hits the openweather api with Dallas as the default and runs after a search is done
function cityWeather() {

    let today = moment().format("MM/D/YY");
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`
    $.ajax({
        url: queryURL
    }).then(response => {

        //this call gets the uv index
        $.ajax(`http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${apiKey}`).then(uvResp => {
            let uvData = `<p>UV Index: ${uvResp.value} </p>`
            $("#mainData").append(uvData)
        })
        curName = response.name;
        curTemp = response.main.temp;
        curWind = response.wind.speed;
        curHumid = response.main.humidity;
        //setting weather icon for the img src link below
        curIcon = response.weather[0].icon;
        let mainData = `<h2>${curName} (${today})<img src="http://openweathermap.org/img/w/${curIcon}.png"></img></h2>
                            <p>Temperature: ${curTemp} °F</p>
                            <p>Humidity: ${curHumid}%</p>
                            <p>Wind Speed: ${curWind} MPH</p>
                           `
            //appending the main city data                   
        $("#mainData").append(mainData)

    });

};

//getting the five day forecast
function fiveDay() {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=0&units=imperial&appid=${apiKey}`
    $.ajax({
        url: queryURL
    }).then(forecast => {
        console.log(forecast)
            //skipping every 8 to only get the 5 days back and setting HTML for each day
        for (let i = 0; i < 40; i += 8) {
            foreDate = (forecast.list[i].dt_txt).slice(0, -8)
            foreTemp = forecast.list[i].main.temp
            foreIcon = forecast.list[i].weather[0].icon
            foreHumid = forecast.list[i].main.humidity
            let cardData = `<div class="card mx-1 border-light bg-primary rounded" style="width: 10rem;">
                              <div class="card-body  text-white">
                               <h5 class="card-title">${foreDate}</h5>
                               <p class="card-text"><img src="http://openweathermap.org/img/w/${foreIcon}.png"></img></p>
                               <p class="card-text">Temp: ${foreTemp} °F</p>
                               <p class="card-text">Humidity: ${foreHumid}%</p>
                              </div>
                            </div>`
                //appending each card built in the 5 day 
            $("#forecast").append(cardData)
        }
    });

}

//when search button is clicked, the main data and forecast are emptied out to prevent multiples 
$("#search").on("click", function(event) {
    event.preventDefault();
    cityName = $("#city").val();
    cities.push(cityName)

    buildList();
    $("#forecast").empty();
    $("#mainData").empty();
    cityWeather(cityName);
    fiveDay(cityName);
    //setting local storage to save users search history.
    localStorage.setItem("cities", JSON.stringify(cities));

});
//building the list of searches users made
function buildList() {
    //clear li elements so theres no repeats
    $("#history").empty();
    for (let i = 0; i < cities.length; i++) {
        const city = cities[i]
        let cityList = `<li id="list" class="list-group-item list-group-item-action">${city}</li>`
            //prepend so the most recent is at the top
        $("#history").prepend(cityList)
    }
};


function init() {
    //local storage set up 
    let citiesSaved = JSON.parse(localStorage.getItem("cities"));
    //if nothing has be saved yet, use origial cities array otherwise use citiesSaved array
    if (citiesSaved !== null) {
        cities = citiesSaved;
    }
    // Render search history
    buildList();
}
//so user can pull a city they have already searched for without typing.
$("li").on('click', function(event) {
    event.preventDefault();
    let histSearch = $(this).closest("#list").text()
    console.log(histSearch)
    cityName = histSearch
    $("#forecast").empty();
    $("#mainData").empty();
    cityWeather(cityName);
    fiveDay(cityName);
})