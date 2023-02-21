import Chart from 'chart.js/auto';

import { ChartContainer } from './dom';

export function renderMultiDayChart(inputData, location) {

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

    const chartContainer = new ChartContainer();
    chartContainer.buildChartContainer(location)

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

export function addChartToPage(endpoint, title = "TITLE" ) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => renderChart(data, title));
}

function renderChart(inputData, title) {
    const chartContainer = new ChartContainer();
    chartContainer.buildChartContainer(title)

    const ctx = chartContainer.chartCanvasElement;

    const temperature = inputData.map(element => {
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