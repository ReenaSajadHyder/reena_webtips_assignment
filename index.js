let weather_data;
fetch("data.json")
.then(data => data.json())
.then(result => {
    weather_data = result;
    console.log(weather_data);
    setCity();
});



function setCity() {
    var city = Object.keys(weather_data);
    var inputdata = document.getElementById("city").value;
    var option = ``;
    for(let i=0; i < city.length; i++) {
        option += `<option>${city[i]}</option>`;
    }
    document.querySelector("#city").innerHTML = option;
} 

let far;
function changeToFahrenheit(val){
    let fahrenheit = val * 1.8 + 32;
    console.log("This is displayed in console:" + fahrenheit);
    return fahrenheit;
}

function change() {
    var city = Object.keys(weather_data);
    let currentCity = document.querySelector("#city1").value;
    console.log(currentCity);

     //city icon
    var logo = document.getElementById("city-icon");
    logo.src = `./images/Icons for cities/${currentCity}.svg`;

    //temperature C
    document.getElementById("tempnum-c").innerHTML = weather_data[currentCity].temperature;

    //temperature F
    let cel = weather_data[currentCity].temperature.slice(0,-2);
    far = changeToFahrenheit(cel);
    far = far.toPrecision(2);
    far += ` F`;
    document.getElementById("tempnum-f").innerHTML = far;

    //Humidity
    document.getElementById("hum-num").innerHTML = weather_data[currentCity].humidity;

    //Precipitation
    document.getElementById("precip-number").innerHTML = weather_data[currentCity].precipitation;




}