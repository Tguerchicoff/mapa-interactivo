const WEATHER_API_KEY = "00414df992944f56877202743230307";



const colorScale = d3.scaleSequential().domain([40, 0]).interpolator(d3.interpolateRdYlBu);
const paths = document.querySelectorAll('path');
addProvinceClickHandlers(paths);




function updatePaths() {
  const paths = d3.selectAll('path');
  // Mostrar pantalla de carga
  showLoading()

  paths.each(function() {
    const provinceTitle = this.getAttribute('title');
    const apiKey = atob("YzJlYjU4YTUzYmY2NmE4NjU5MjA4M2I0Y2RiOWQ2Nzc=");
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=00414df992944f56877202743230307&q=${provinceTitle}&aqi=no&lang=es`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.current && data.current.temp_c) {
          const temperature = data.current.temp_c;
          // Choose a color based on temperature
          const color = colorScale(temperature);
          d3.select(this).attr('fill', color);
        } else {
          console.error("Cannot find temperature data in response:", data);
        }

        // Ocultar pantalla de carga si todos los paths han sido actualizados
        const updatedPaths = d3.selectAll('path[fill]');
        if (updatedPaths.size() === paths.size()) {
          hideLoading();
        }
      })
      .catch(error => console.error(error));
  });
}



function addProvinceClickHandlers(paths) {
  paths.forEach(path => {
    path.addEventListener('click', onProvinceClick);
  })}


  function onProvinceClick(event) {
    const provinceTitle = event.target.getAttribute('title');
    const apiKey = atob("YzJlYjU4YTUzYmY2NmE4NjU5MjA4M2I0Y2RiOWQ2Nzc=");
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=00414df992944f56877202743230307&q=${provinceTitle}&days=4&aqi=no&alerts=no&lang=es`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const currentWeather = data.current;
        const forecast = data.forecast.forecastday.slice(1, 4); // Obtener los próximos 3 días
  
        if (currentWeather && currentWeather.temp_c) {
          const temperature = currentWeather.temp_c.toFixed(1);
          const description = currentWeather.condition.text;
          const iconCode = currentWeather.condition.icon;
          const iconUrl = `https:${iconCode}`;
  
          showModal(provinceTitle, temperature, description, iconUrl, forecast);
        } else {
          console.error("Cannot find current weather data in response:", data);
        }
      })
      .catch(error => console.error(error));
  }


  function showModal(province, currentTemperature, description, iconUrl) {
    // Obtener el modal y los elementos del modal
    const modalTitle = document.getElementById("province-name");
    const temperatureElement = document.getElementById("temperature");
    const descriptionElement = document.getElementById("description");
    const iconElement = document.getElementById("weather-icon");
  
    // Configurar el título del modal
    modalTitle.textContent = province;
  
    // Configurar la temperatura actual
    temperatureElement.textContent = `${currentTemperature} °C`;
  
    // Configurar la descripción del clima
    descriptionElement.textContent = description;
  
    // Configurar el icono del clima
    iconElement.src = iconUrl;
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("modal-clima"));
    modal.show();
  }
  

function showLoading() {
  const loadingContainer = document.getElementById('loading-container');
  loadingContainer.style.display = 'flex';
}

function hideLoading() {
  const loadingContainer = document.getElementById('loading-container');
  loadingContainer.style.display = 'none';
}


