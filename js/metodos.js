
const colorScale = d3.scaleSequential().domain([40, 0]).interpolator(d3.interpolateRdYlBu);
const paths = document.querySelectorAll('path');
addProvinceClickHandlers(paths);




function updatePaths() {
  const paths = d3.selectAll('path');

  // Mostrar pantalla de carga
  const loading = document.getElementById('loading');
  showLoading()

  paths.each(function() {
    const provinceTitle = this.getAttribute('title');
    const apiKey = "c2eb58a53bf66a86592083b4cdb9d677";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${provinceTitle},USA&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.main && data.main.temp) {
          const temperature = ((data.main.temp - 32) * (5/9)).toFixed(1);
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
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${provinceTitle},USA&appid=${apiKey}&units=imperial&lang=es`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.main && data.main.temp) {
        const temperature = ((data.main.temp - 32) * (5/9)).toFixed(1);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
        const message = `The current temperature in ${provinceTitle} is ${temperature}°C with ${description}.`;
        showModal(`${provinceTitle}`,`${temperature}`,`${description}`,`${iconUrl}`)
      } else {
        console.error("Cannot find temperature data in response:", data);
      }
    })
    .catch(error => console.error(error));
}

function showModal(provinceTitle, temperature, description, iconCode) {
  const modal = new bootstrap.Modal(document.getElementById("modal-clima"));
  const provinceName = document.getElementById("province-name");
  const temp = document.getElementById("temperature");
  const desc = document.getElementById("description");
  const icon = document.getElementById("weather-icon");
  
  provinceName.innerHTML = provinceTitle;
  temp.innerHTML = `${temperature} °C`;
  desc.innerHTML = description;
  icon.src = iconCode;

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
