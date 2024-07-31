const userlocation = document.getElementById("userLocation");
converter = document.getElementById("converter");

weatherIcon = document.querySelector(".weatherIcon");
temperature = document.querySelector(".temperature");
feelLike = document.querySelector(".feelLike");
description = document.querySelector(".description");
date = document.querySelector(".date");
city = document.querySelector(".city");

HValue = document.getElementById("HValue");
WValue = document.getElementById("WValue");
SRValue = document.getElementById("SRValue");
SSValue = document.getElementById("SSValue");
CVValue = document.getElementById("CVValue");
UVValue = document.getElementById("UVValue");
PVValue = document.getElementById("PVValue");

Forecast = document.querySelector(".Forecast");

// https://openweathermap.org/

WEATHER_API_ENDPOINT=``;

WEATHER_DATA_ENDPOINT=``;


function findUserLocation(){
    Forecast.innerHTML="";
    fetch(WEATHER_API_ENDPOINT + userlocation.value)
    .then((response)=>response.json())
    .then((data)=>{
        if(data.cod !='' & data.cod !=200){
            // alert(data.message);
            return;
        }
        // https://openweathermap.org/weather-conditions

        city.innerHTML = data.name + " :: " + data.sys.country;
        weatherIcon.style.background = `url('https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png')`

        console.log(data.coord.lon, data.coord.lat);
        fetch(WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((response)=>response.json())
        .then((data)=>{
            temperature.innerHTML = temparatureConverter(Math.round(data.current.temp));
            feelLike.innerHTML = "Feels Like " + temparatureConverter(Math.round(data.current.feels_like));
            description.innerHTML =`<i class="fa-brands fa-cloudversify"></i> &nbsp;`+data.current.weather[0].description;
            const options = {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };
            date.innerHTML = getLongFormatDateTime(data.current.dt, data.timezone_offset, options);

            HValue.innerHTML = Math.round(data.current.humidity)+ "<span>%</span>";
            WValue.innerHTML = (data.current.wind_speed).toFixed(2)+ " <span>m/s</span>";
            
            const options1 = {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };
           
            SRValue.innerHTML = getLongFormatDateTime(data.current.sunrise, data.timezone_offset, options1);
            SSValue.innerHTML = getLongFormatDateTime(data.current.sunset, data.timezone_offset, options1);

            CValue.innerHTML = data.current.clouds+ " <span>%</span>";
            UValue.innerHTML = data.current.uvi;
            PValue.innerHTML = data.current.pressure+ " <span>hPa</span>";
            
            // weekly-weather Data
            data.daily.forEach((weather) =>{
                let div = document.createElement("div");
                
                const options = {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                };
                let daily = getLongFormatDateTime(weather.dt, 0, options).split(" at ");
                div.innerHTML = daily[0];    

                div.innerHTML+= `<img class="weatherDailyIcon" src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />`
                div.innerHTML+= `<p class="forecast-desc">${weather.weather[0].description}</p>`
                div.innerHTML+= `<span>Min: <span>${temparatureConverter(Math.round(weather.temp.min))} &nbsp; Max: </span>${temparatureConverter(Math.round(weather.temp.max))}</span>`
                Forecast.append(div);
            });
            console.log(data);
        });
    });
}

    function formatUnixTime(dtValue, offSet, options = {}) {
        const date = new Date((dtValue + offSet) * 1000);
        return date.toLocaleTimeString([], {timeZone: "UTC", ...options});
    }

    function getLongFormatDateTime(dtValue, offSet, options) {
        return formatUnixTime(dtValue, offSet, options);
    }

    function temparatureConverter(temp){
        // let tempValue = Math.round(temp);
        let tempValue = temp;
        let message="";
        if(converter.value == "°C"){
            message=tempValue+ "<span>"+"\xB0C</span>";
        }else{
            let ctof = Math.round(((tempValue*9)/5)+32)
            message = ctof+ "<span>"+"\xB0F</span>";
        }
        return message;
    }
