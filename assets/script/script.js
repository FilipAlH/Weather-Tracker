let button = $('form')
let userInput = $('#city')
let modal = $('.btnmodal')


function saveSearch() {
    savedInput = userInput.val()
    console.log(savedInput)
    getFetch(savedInput)
}

button.on("submit", saveSearch)

function getFetch(savedInput) {
    fetch ("https://api.weatherapi.com/v1/current.json?key=9f981bdef705462cbfe140542212809 &q=" + savedInput + "&aqi=no")
    .then(function(result) {
        if (result.status != 200) {
          modal.trigger("click")
          console.log("shits fucked")
          return userInput.val() = ""
        } else {
            return result.json()
        }
    })
}

