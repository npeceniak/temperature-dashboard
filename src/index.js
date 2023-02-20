import Chart from 'chart.js/auto';

function addChartToPage(endpoint, title = "TITLE" ) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => renderChart(data, title));
}

function addElement(title) {
    const mainContainer = document.getElementById("mainContainer")
    const container = document.createElement("div");
    const canvasElement = document.createElement("canvas");
    const titleElement = document.createElement("h3");
    const closeButton = document.createElement("button");

    closeButton.innerHTML = "Close";

    console.log(closeButton)

    closeButton.onclick = function() {container.remove();} 

    titleElement.innerHTML = title;
    container.appendChild(titleElement);

    container.innerHTML += '<div><label>Temperature: </label><span id="temperatureValue"></span><span> - </span><label>Humidity: </label><span id="humidityValue"></span><br/><label>High/Low Today: </label><span id="highTempValue"></span><span> / </span><span id="lowTempValue"></span></div>'
    container.classList.add("chartContainer");
    container.appendChild(closeButton)
    
    container.appendChild(canvasElement);
    mainContainer.appendChild(container);
    return canvasElement; 
}

function renderChart(inputData, title) {
    const ctx = addElement(title)

    const temperature = inputData.map(element => {
        return {
            x: element.timestamp.substring(11),
            y: parseInt(element.temperature)
        }
    })

    const config = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Temperature',
                    data: temperature,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)'
                }
            ]
        }
    }

    new Chart(ctx, config)
}

function renderMultiDayChart(inputData, location) {

    let temperature = []

    inputData.forEach((day) => {

        // Filter down to just hourly data
        const newarray = day.filter((x, i) => i%4===0)

        const data = newarray.map(element => {
            return {
                x: element.timestamp,
                y: parseInt(element.temperature)
            }
        })

        temperature = temperature.concat(data)
    })

    const ctx = addElement(location)

    const config = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Temperature',
                    data: temperature,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)'
                }
            ]
        }
    }

    new Chart(ctx, config)
}

async function addDateRangeChart(dateArray, location){
    const urls = dateArray.map((date) => `http://webserver.lan/history/${location}/${date}.json`)

    const responseArray = await Promise.allSettled(urls.map(async url => {
        const resp = await fetch(url);
        return resp.json();
      }));

    const jsonArray = responseArray.filter((e) => e.status === "fulfilled").map((response) => response.value)

    console.log(jsonArray)

    renderMultiDayChart(jsonArray, location)

}

function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate);
    const dates = [];
  
    while (date <= endDate) {
      dates.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
  
    return dates;
}

// Set date picker to todays date
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const today = new Date().toISOString().split("T")[0];
startInput.value = today;
endInput.value = today;


// Add Chart Submit Button
const submit = document.getElementById("selectorSubmit")
submit.addEventListener('click', event => {
    const location = document.getElementById("locations").value
    const startDate = Date.parse(document.getElementById("startDate").value)
    const endDate = Date.parse(document.getElementById("endDate").value)
    const dateRange = getDatesInRange(startDate, endDate)

    addDateRangeChart(dateRange, location)
});


addChartToPage("http://office.temp.lan/history", "Office")
addChartToPage("http://basement.temp.lan/history", "Basement")
addChartToPage("http://livingroom.temp.lan/history", "Living Room")
addChartToPage("http://garage.temp.lan/history", "Garage")
addChartToPage("http://upstairs.temp.lan/history", "Upstairs")
