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
                x: element.timestamp,
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