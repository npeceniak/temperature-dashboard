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
        // const newarray = day.history.filter((x, i) => i%4===0)

        const data = day.history.map(element => {
            return {
                x: new Date(element.timestamp).toString(),
                y: parseInt(element.temperature)
            }
        })

        temperature = temperature.concat(data)
    })

    const chartContainer = new ChartContainer();
    chartContainer.buildChartContainer(title)

    const ctx = chartContainer.chartCanvasElement;

    // const syncDate = todayOutdoor.map(element => {
    //     return {
    //         x: new Date(element.x).toString(),
    //         y: element.y
    //     }
    // })

    const config: any = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Temperature',
                    data: temperature,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)'
                },
                // {
                //     label: 'Outdoor Temperature',
                //     data: syncDate,
                //     fill: false,
                //     borderColor: 'rgb(50, 50, 50)'
                // }
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

function renderChart(inputData) {
    const last24Hours = inputData.history;
    const title = inputData.data.name;
    const chartContainer = new ChartContainer();
    chartContainer.buildChartContainer(title)

    const ctx = chartContainer.chartCanvasElement;

    const temperature = last24Hours.map(element => {
        return {
            x: element.timestamp.substring(11),
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

export function renderOutdoorTemp(outdoorData, indoorData){
    let temperatureOutdoor = []
    let temperatureIndoor = []
    let title = "";

    outdoorData.forEach((day) => {
        const hourlyData = day.hourly;

        const data = hourlyData.time.map((element, index) => {
            return {
                x: new Date(element).toISOString().slice(0,-11),
                y: hourlyData.temperature_2m[index]
            }
        })

        console.log(data)

        temperatureOutdoor = temperatureOutdoor.concat(data)
    })

    indoorData.forEach((day) => {

        if (day.data) {
            title = day.data.name
        }

        // If using old format convert to new data format...
        if(Array.isArray(day)){
            day = {history: day};
        }

        const newarray = day.history.filter((x, i) => i%4===0)

        const data = newarray.map(element => {
            return {
                x: new Date(element.timestamp).toISOString().slice(0, -11),
                y: parseInt(element.temperature)
            }
        })

        temperatureIndoor = temperatureIndoor.concat(data)
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
                    data: temperatureOutdoor,
                    fill: false,
                    borderColor: 'rgb(0, 0, 0)'
                },
                {
                    label: 'Temperature',
                    data: temperatureIndoor,
                    fill: false,
                    borderColor: 'rgb(255, 0, 0)'
                },
            ]
        }
    }

    new Chart(ctx, config)
}