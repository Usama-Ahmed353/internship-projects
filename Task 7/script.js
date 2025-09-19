const API_KEY = "YOUR_API_KEY_HERE";
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const cardsEl = document.getElementById("cards");
const statusEl = document.getElementById("status");
const template = document.getElementById("cardTemplate");

function showStatus(text){
  statusEl.textContent = text;
  statusEl.classList.remove("hidden");
}
function hideStatus(){
  statusEl.classList.add("hidden");
}
async function fetchByCity(name){
  showStatus("Loading " + name + " …");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&units=metric&appid=${API_KEY}`;
  const r = await fetch(url);
  if(!r.ok) throw new Error("City not found");
  const data = await r.json();
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  const one = await fetchOneCall(lat,lon);
  hideStatus();
  return {meta:data,one};
}
async function fetchOneCall(lat,lon){
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`;
  const r = await fetch(url);
  if(!r.ok) throw new Error("Forecast fetch failed");
  return r.json();
}
function makeCard(data){
  const clone = template.content.cloneNode(true);
  const art = clone.querySelector(".card");
  const nameEl = clone.querySelector(".city-name");
  const tempEl = clone.querySelector(".temp-main");
  const iconEl = clone.querySelector(".icon");
  const descEl = clone.querySelector(".desc");
  const humEl = clone.querySelector(".humidity");
  const windEl = clone.querySelector(".wind");
  const forecastEl = clone.querySelector(".forecast");
  const removeBtn = clone.querySelector(".remove");
  const city = data.meta.name + (data.meta.sys && data.meta.sys.country ? ", " + data.meta.sys.country : "");
  nameEl.textContent = city;
  tempEl.textContent = Math.round(data.one.current.temp) + "°C";
  const iconCode = data.one.current.weather[0].icon;
  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  descEl.textContent = data.one.current.weather[0].description;
  humEl.textContent = data.one.current.humidity;
  windEl.textContent = data.one.current.wind_speed;
  for(let i=1;i<=3;i++){
    const d = data.one.daily[i];
    const dt = new Date(d.dt * 1000);
    const day = dt.toLocaleDateString(undefined,{weekday:"short"});
    const ico = d.weather[0].icon;
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<div style="font-weight:700">${day}</div><img alt="" src="https://openweathermap.org/img/wn/${ico}.png"/><div>${Math.round(d.temp.day)}°</div>`;
    forecastEl.appendChild(div);
  }
  removeBtn.addEventListener("click",()=>{
    art.remove();
    saveCards();
  });
  return art;
}
function persistData(){
  const arr = [];
  cardsEl.querySelectorAll(".card").forEach(c=>{
    const city = c.querySelector(".city-name").textContent;
    arr.push(city);
  });
  localStorage.setItem("weather:cards",JSON.stringify(arr));
}
async function addCityByName(name){
  try{
    const data = await fetchByCity(name);
    const card = makeCard(data);
    cardsEl.prepend(card);
    persistData();
  }catch(e){
    hideStatus();
    alert(e.message || "Error");
  }
}
searchForm.addEventListener("submit",e=>{
  e.preventDefault();
  const v = cityInput.value.trim();
  if(!v) return;
  addCityByName(v);
  cityInput.value = "";
});
document.getElementById("locBtn").addEventListener("click",()=>{
  if(!navigator.geolocation){
    alert("Geolocation not supported");
    return;
  }
  showStatus("Getting your location…");
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const one = await fetchOneCall(lat,lon);
      const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      const meta = await r.json();
      hideStatus();
      const data = {meta,one};
      const card = makeCard(data);
      cardsEl.prepend(card);
      persistData();
    }catch(err){
      hideStatus();
      alert("Unable to fetch weather for your location");
    }
  },err=>{
    hideStatus();
    alert("Location permission denied");
  });
});
function saveCards(){
  persistData();
}
function loadSaved(){
  const raw = localStorage.getItem("weather:cards");
  if(!raw) return;
  try{
    const arr = JSON.parse(raw);
    arr.forEach(async (entry)=>{
      try{
        const name = entry.split(",")[0];
        const data = await fetchByCity(name);
        const card = makeCard(data);
        cardsEl.appendChild(card);
      }catch(e){}
    });
  }catch(e){}
}
loadSaved();
