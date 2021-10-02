let button = $('form')
let userInput = $('#city')
let modal = $('.btnmodal')

let storedStuff = $('.saved-history')
let tempM = $('.maintemp')
let windM = $('.mainwind')
let humM = $('.mainhumidity')
let uvM = $('.UVbox')
let title = $('.date')
let jumbotron = $('.jumbotron')

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
storedStuff.on("click", redirect)

function getFetch(savedInput) {
    fetch ("https://api.openweathermap.org/data/2.5/weather?q=" + savedInput + key + "&units=metric")
    .then(function(result) {
        if (result.status != 200) {
          modal.trigger("click")
          return
        } else {
            let storedList = JSON.parse(localStorage.getItem("searches"))
            let searches = {
                ...storedList
            }

            searches[savedInput] = savedInput
            console.log(searches)
            storedStuff.empty()

            for (i = 0; i < Object.keys(searches).length; i++) {
                storedStuff.append(`<div class=savedSearches><button type="button" class="storedButton">${searches[Object.keys(searches)[i]]}</button><div>`)
            }

            localStorage.setItem("searches", JSON.stringify(searches))
            return result.json()
        }
    })
    .then(function(data) {
        console.log(data)
        jumbotron.addClass("border")
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

        multiForecast.replaceWith(`<h3 class="row 5-Day mx-2 mt-3">5-Day Forecast:<h3>`)

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
                        forecastContainer.empty()
                        for(i = 1; i < 6; i++) {
                        forecastContainer.append(
                        ` <div class="card col-2 m-3 bg-secondary text-white">
                            <div class="card-body">
                                <h5 class="card-title">${moment.unix(generateCard.daily[i].dt).format("MM/DD/YYYY")}</h5><br>
                                <img src="http://openweathermap.org/img/wn/${generateCard.daily[i].weather[0].icon}@2x.png">
                                <p class="card-text">
                                    Daily High: <span class="temp">${generateCard.daily[i].temp.max}°C</span><br>
                                    Wind: <span class="wind">${generateCard.daily[i].wind_speed} Km/h</span><br>
                                    Humidity: <span class="humidity">${generateCard.daily[i].humidity}%</span>
                                </p>
                            </div>
                            </div>`)
                        }
                    })
    }
}

function redirect(event) {
    console.log(event.target)
    getFetch(event.target.innerText)
}