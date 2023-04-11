import { addChartToPage, renderOutdoorTemp } from './chart/chart';

//Add Default Charts...
// addChartToPage("http://office.temp.lan/data")
// addChartToPage("http://basement.temp.lan/data")
// addChartToPage("http://livingroom.temp.lan/data")
// addChartToPage("http://garage.temp.lan/data")
// addChartToPage("http://upstairs.temp.lan/data")
// addChartToPage("http://furnace.temp.lan/data")



// addOutdoorTempData

async function addOutdoorTempData(){
    const urls = ["https://api.open-meteo.com/v1/forecast?latitude=39.61&longitude=-105.11&hourly=temperature_2m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&past_days=7&forecast_days=1&timezone=America%2FDenver"]

    const responseArray = await Promise.allSettled(urls.map(async url => {
        const resp = await fetch(url);
        return resp.json();
      }));

    const outdoorTemp = responseArray.filter((e) => e.status === "fulfilled").map((response: any) => response.value)


    const urlsIndoor = [
        "http://webserver.lan/history/furnace/2023-04-05.json", 
        "http://webserver.lan/history/furnace/2023-04-06.json",
        "http://webserver.lan/history/furnace/2023-04-07.json", 
        "http://webserver.lan/history/furnace/2023-04-08.json", 
        "http://webserver.lan/history/furnace/2023-04-09.json", 
        "http://webserver.lan/history/furnace/2023-04-10.json", 
        "http://webserver.lan/history/furnace/2023-04-11.json"
    ]

    const responseArray2 = await Promise.allSettled(urlsIndoor.map(async url => {
        const resp = await fetch(url);
        return resp.json();
      }));

    const indoorTemp = responseArray2.filter((e) => e.status === "fulfilled").map((response: any) => response.value)


    renderOutdoorTemp(outdoorTemp, indoorTemp)

}

(async () => {
    await addOutdoorTempData()
})();

