let button = $('form')
let userInput = $('#city')
let modal = $('.btnmodal')

let tempM = $('.maintemp')
let windM = $('.mainwind')
let humM = $('.mainhumidity')
let uvM = $('.UVbox')
let title = $('.date')

let key = "&appid=c2d1d7fd47ff065b027bb129eaf2461e"

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

        tempM.text("Temp: " + data.main.temp + " degrees Celcius")
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
    }
}


