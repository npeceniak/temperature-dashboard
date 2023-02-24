import { renderMultiDayChart }from './chart'

export class ChartContainer {
    mainContainer: HTMLDivElement;
    chartCanvasElement: HTMLCanvasElement;
    constructor() {
        this.mainContainer = document.getElementById("mainContainer") as HTMLDivElement;
        this.chartCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    }

    requestData() {

    }

    buildChartContainer(title ="DEFAULT TITLE") {
        const container = document.createElement("div");
        const titleElement = document.createElement("label");
        const closeButton = document.createElement("button");
        const maximizeButton = document.createElement("button");
    
        closeButton.innerHTML = "Close";
        closeButton.classList.add("closeButton");

        maximizeButton.innerHTML = "+";
        maximizeButton.classList.add("maxButton");
    
        closeButton.onclick = () => {container.remove();} 
        maximizeButton.onclick = () => {
            container.classList.toggle("twoAcross");
            container.classList.toggle("oneAcross");
            maximizeButton.innerHTML = "-"
            // Move this node to top of page.
            this.mainContainer.insertBefore(container, this.mainContainer.children[0])
        } 
    
        titleElement.innerHTML = title;
        titleElement.classList.add("title");
        container.appendChild(titleElement);
    
        container.classList.add("chartContainer");
        container.classList.add("twoAcross");
        container.appendChild(closeButton)

        container.appendChild(maximizeButton);
        
        container.appendChild(this.chartCanvasElement);
    
        if (this.mainContainer){
            this.mainContainer.appendChild(container);
        }
    }
}

async function addDateRangeChart(dateArray, location){
    const urls = dateArray.map((date) => `http://webserver.lan/history/${location}/${date}.json`)

    const responseArray = await Promise.allSettled(urls.map(async url => {
        const resp = await fetch(url);
        return resp.json();
      }));

    const jsonArray = responseArray.filter((e) => e.status === "fulfilled").map((response: any) => response.value)

    console.log(jsonArray)

    renderMultiDayChart(jsonArray)

}

function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate);
    const dates: string[] = [];
  
    while (date <= endDate) {
      dates.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
  
    return dates;
}

// Set date picker to todays date
const startInput: HTMLInputElement = document.getElementById("startDate") as HTMLInputElement;
const endInput: HTMLInputElement = document.getElementById("endDate") as HTMLInputElement;
const today = new Date().toISOString().split("T")[0];
if(startInput && endInput){
    startInput.value = today;
    endInput.value = today;
}



// Add Chart Submit Button
const submit = document.getElementById("selectorSubmit") as HTMLElement
submit.addEventListener('click', event => {
    const location = document.getElementById("locations") as HTMLInputElement
    
    const startDate = Date.parse((document.getElementById("startDate") as HTMLInputElement).value);
    const endDate = Date.parse((document.getElementById("endDate") as HTMLInputElement).value);
    const dateRange = getDatesInRange(startDate, endDate)

    addDateRangeChart(dateRange, location.value)
});

