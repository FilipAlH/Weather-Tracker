let button = $('form')
let userInput = $('#city')
let modal = $('.btnmodal')

let tempM = $('.maintemp')
let windM = $('.mainwind')
let humM = $('.mainhumidity')
let uvM = $('.UVbox')
let title = $('.date')

let multiForecast = $('.5-Day')
let forecastContainer = $('.forecast')

let key = "&appid=c2d1d7fd47ff065b027bb129eaf2461e"
let keyforimage = "9f981bdef705462cbfe140542212809"

function saveSearch() {
    savedInput = userInput.val()
    console.log(savedInput)
    getFetch(savedInput)
}

button.on("submit", saveSearch)

function getFetch(savedInput) {
    fetch ("https://api.openweathermap.org/data/2.5/weather?q=" + savedInput + key + "&units=metric")
    .then(function(result) {
        if (result.status != 200) {
          modal.trigger("click")
          userInput.val("")
          return
        } else {
            return result.json()
        }
    })
    .then(function(data) {
        console.log(data)
        title.text(data.name + moment().format("(MM/DD/YYYY)"))
        tempM.text("Temp: " + data.main.temp + "°C")
        windM.text("Wind: " + data.wind.speed + " Km/h")
        humM.text("Humidity: " + data.main.humidity + "%")
        let coordinates = {
            lat: data.coord.lat,
            lon: data.coord.lon,
        }
        console.log(coordinates)
        fetchForUV(coordinates)
    })

    function fetchForUV(coordinates) {
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates.lat + "&lon=" + coordinates.lon + key)
            .then (function (uvresult) {
                if (uvresult.status != 200) {
                    modal.trigger("click")
                    userInput.val("")
                    return
                } else {
                    return uvresult.json()
                }
            })
            .then(function(uvdata) {
                console.log(uvdata.current.uvi)
                uvM.text("UVI: " + uvdata.current.uvi)
                if (uvdata.current.uvi < 2) {
                    uvM.css("background-color", "#6cd65e")
                } else if(uvdata.current.uvi < 4) {
                    uvM.css("background-color", "#cf9557")
                } else if(uvdata.current.uvi < 6) {
                    uvM.css("background-color", "#d94141")
                } else {
                    uvM.css("background-color", "#e661e8")
                }
            })

        fetch("http://api.weatherapi.com/v1/current.json?key=9f981bdef705462cbfe140542212809&q=" + savedInput + "&aqi=no")
            .then(function (image) {
                if (image.status != 200) {
                    modal.trigger("click")
                    userInput.val("")
                    return
                } else {
                    return image.json()
                }
            })
            .then (function (getimage) {
                console.log(getimage.current.condition.icon)
                title.append(`<img src="https://${getimage.current.condition.icon}">`)
            })

        multiForecast.replaceWith(`<h3>5-Day Forecast:<h3>`)

                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates.lat + "&lon=" + coordinates.lon + "&exclude={current,minutely,hourly,alerts}&units=metric" + key)
                    .then(function(day) {
                        if (day.status != 200) {
                            modal.trigger("click")
                            userInput.val("")
                            return
                        } else {
                            return day.json()
                        }
                    })
                    .then (function (generateCard) {
                        console.log(generateCard)
                        for(i = 1; i < 6; i++) {
                        forecastContainer.append(
                        ` <div class="card col-2">
                            <div class="card-body">
                                <h5 class="card-title">${moment.unix(generateCard.daily[i].dt).format("MM/DD/YYYY")}</h5>
                                <p class="card-text">
                                    Temp: <span class="temp"></span><br>
                                    Wind: <span class="wind"></span><br>
                                    Humidity: <span class="humidity"></span>
                                </p>
                            </div>
                            </div>`)
                        }
                    })
    }
}

