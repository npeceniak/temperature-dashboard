import { addChartToPage, addOutdoorChartToPage } from './chart/chart';

addOutdoorChartToPage("https://api.open-meteo.com/v1/forecast?latitude=39.61&longitude=-105.11&hourly=temperature_2m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&past_days=1&forecast_days=1&timezone=America%2FDenver")

//Add Default Charts...
addChartToPage("http://office.temp.lan/data")
addChartToPage("http://basement.temp.lan/data")
addChartToPage("http://livingroom.temp.lan/data")
addChartToPage("http://garage.temp.lan/data")
addChartToPage("http://upstairs.temp.lan/data")
addChartToPage("http://furnace.temp.lan/data")
