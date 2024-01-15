import {
  addChartToPage,
  addOutdoorChartToPage,
  addApiChartToPage,
} from "./chart/chart";

addOutdoorChartToPage(
  "https://api.open-meteo.com/v1/forecast?latitude=39.61&longitude=-105.11&hourly=temperature_2m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&past_days=1&forecast_days=1&timezone=America%2FDenver"
);

addApiChartToPage("http://webserver.lan:9999/temperature/office");
addApiChartToPage("http://webserver.lan:9999/temperature/basement");
addApiChartToPage("http://webserver.lan:9999/temperature/livingroom");
addApiChartToPage("http://webserver.lan:9999/temperature/garage");
addApiChartToPage("http://webserver.lan:9999/temperature/upstairs");
addApiChartToPage("http://webserver.lan:9999/temperature/furnace");
