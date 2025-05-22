  let input = document.querySelector("#box");
    let btn = document.querySelector("button");
    let temp = document.querySelector(".temp");
    let locationName = document.querySelector(".location");
    let humidity = document.querySelector(".humidity");
    let wind = document.querySelector(".wind");
    let weatherCard = document.querySelector(".weather-card");
    let forecastContainer = document.querySelector(".forecast-container");
    let forecastDaysDiv = document.querySelector("#forecast-days");

    let apiKey = "d55d96c608f6ad8d3bf295df4290807e"; // Your API key

    btn.addEventListener("click", async () => {
      const city = input.value.trim();
      if (!city) {
        alert("Please enter a city name.");
        return;
      }

      // Clear previous forecast
      forecastDaysDiv.innerHTML = "";
      forecastContainer.style.display = "none";

      // Current weather URL
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      // 5-day forecast URL
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      try {
        // Fetch current weather
        const currentRes = await fetch(currentUrl);
        const currentData = await currentRes.json();

        if (currentData.cod !== 200) {
          alert("City not found.");
          return;
        }

        // Show current weather
        temp.textContent = `${currentData.main.temp}°C`;
        locationName.textContent = currentData.name;
        humidity.textContent = `Humidity: ${currentData.main.humidity}%`;
        wind.textContent = `Wind: ${currentData.wind.speed} km/h`;
        document.querySelector(".weather-icon").src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
        weatherCard.style.display = "block";

        // Fetch forecast
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        if (forecastData.cod !== "200") {
          alert("Forecast data not available.");
          return;
        }

        // Process forecast: group temps by date
        let forecastByDay = {};

        forecastData.list.forEach(item => {
          let date = item.dt_txt.split(" ")[0];
          if (!forecastByDay[date]) {
            forecastByDay[date] = [];
          }
          forecastByDay[date].push(item.main.temp);
        });

        // Get today's date in YYYY-MM-DD to filter out partial days if you want
        let today = new Date().toISOString().split("T")[0];

        // Get next 5 days including today (or from tomorrow)
        let dates = Object.keys(forecastByDay).filter(d => d >= today).slice(0, 5);

        // Display forecast
        dates.forEach(date => {
          let temps = forecastByDay[date];
          let avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);

          // Format date to readable (e.g. "Wed, May 21")
          let options = { weekday: 'short', month: 'short', day: 'numeric' };
          let formattedDate = new Date(date).toLocaleDateString(undefined, options);

          let div = document.createElement("div");
          div.classList.add("forecast-day");
          div.innerHTML = `<span>${formattedDate}</span><span>${avgTemp}°C</span>`;
          forecastDaysDiv.appendChild(div);
        });

        forecastContainer.style.display = "block";

      } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Something went wrong.");
      }
    });