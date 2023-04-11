import Chart from 'chart.js/auto';

import { ChartContainer } from './dom';

export function renderMultiDayChart(jsonResponse) {

    let temperature = []
    let title = "";

    jsonResponse.forEach((day) => {

        if (day.data) {
            title = day.data.name
        }

        // If using old format convert to new data format...
        if(Array.isArray(day)){
            day = {history: day};
        }

        // Filter down to just hourly data
        const newarray = day.history.filter((x, i) => i%4===0)

        const data = newarray.map(element => {
            return {
                x: getRoundedDate(5, new Date(element.timestamp)).toLocaleString(),
                y: parseInt(element.temperature)
            }
        })

        temperature = temperature.concat(data)
    })

    const chartContainer = new ChartContainer();
    chartContainer.buildChartContainer(title)

    const ctx = chartContainer.chartCanvasElement;

    const config: any = {
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

export function addChartToPage(endpoint) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => renderChart(data));
}

export function addOutdoorChartToPage(endpoint) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => renderOutdoorTemp(data));
}

function renderChart(inputData) {
    const last24Hours = inputData.history;
    const title = inputData.data.name;
    const chartContainer = new ChartContainer();
    chartContainer.buildChartContainer(title)

    const ctx = chartContainer.chartCanvasElement;

    const temperature = last24Hours.map(element => {
        return {
            x: getRoundedDate(5, new Date(element.timestamp)).toLocaleString(),
            y: parseInt(element.temperature)
        }
    })

    const config: any = {
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

export function renderOutdoorTemp(outdoorData){
    // let temperatureOutdoor = []
    let title = "Outdoor Temperature";
    const now = new Date(Date.now())

    console.log(outdoorData);

    const hourlyData = outdoorData.hourly;

    const filterForcastData = outdoorData.hourly.time.filter((element) => {
        const time = new Date(element);
        return time < now
    });

    const temperatureOutdoor = filterForcastData.map((element, index) => {
        console.log("Filtered:", element, index)
        const graphData = {
            x: new Date(element).toLocaleString(),
            y: hourlyData.temperature_2m[index]
        }
        return graphData;
    })

    const chartContainer = new ChartContainer();
    chartContainer.buildChartContainer(title)

    const ctx = chartContainer.chartCanvasElement;

    const config: any = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Outdoor Temperature',
                    data: temperatureOutdoor.slice(-24), //Only show last 24 hours of data.
                    fill: false,
                    borderColor: 'rgb(0, 0, 0)'
                }
            ]
        }
    }

    new Chart(ctx, config)
}

function getRoundedDate(minutes, date) {
    console.log("Input Date", date)

    let ms = 1000 * 60 * minutes; // convert minutes to ms
    let roundedDate = new Date(Math.floor(date.getTime() / ms) * ms);
  
    console.log("Rounded Date", roundedDate)
    return roundedDate
}

