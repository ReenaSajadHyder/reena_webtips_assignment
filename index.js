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
}; 

let far;
function changeToFahrenheit(val){
    let fahrenheit = val * 1.8 + 32;
    console.log("This is displayed in console:" + fahrenheit);
    return fahrenheit;
};

function change() {

    const monthArr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    var city = Object.keys(weather_data);
    let currentCity = document.querySelector("#city1").value;
    console.log(currentCity);

    const sixHoursTemp = [
        parseInt(weather_data[currentCity].temperature.slice(0,-2))
    ];
    for(let i=1; i<5; i++){
        sixHoursTemp[i] = parseInt(weather_data[currentCity].nextFiveHrs[i-1]);
    };
    sixHoursTemp[5] = parseInt(weather_data[currentCity].temperature);

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

    //Date and Time
    dateTimeArr = weather_data[currentCity].dateAndTime.split(",");

    /*Time From data
    let time = dateTimeArr[1];
    document.getElementById("time").innerHTML = time;
    */

    //Real Time
    var tZone = weather_data[currentCity].timeZone;
    var time = new Date().toLocaleString("en-US",{
        timeZone: tZone ,
        timeStyle: "medium",
        hourCycle: "h12"
    });
    document.getElementById("time").innerHTML = time;

    //Date
    let dateSplit = dateTimeArr[0];
    let dateArr = dateSplit.split("/");
    let dateInWords = String(dateArr[1].padStart(2,'0')) + "-" + monthArr[dateArr[0] - 1] + "-" + dateArr[2];
    document.getElementById("date").innerHTML = dateInWords;

    //Hourly Weather
    //Time
    let amPm = time.slice(-2);
    time = time.slice(0,2);
    time = parseInt(time) + 1;
    for(var i = 1; i < 6; i++){
        if(time > 12)
        {
            time = time - 12;
            if (amPm == "AM"){
                amPm = "PM";
            }
            else{
                amPm = "AM";
            }
        };

        document.getElementById(`hour${i}`).innerHTML = time + amPm;
        time++;
    };

    //Weather symbol
    for(let i=0; i<6; i++){
        if(sixHoursTemp[i] < 0){
            document.getElementById(`icon-${i+1}`).src = "./images/Weather Icons/snowflakeIcon.svg";
        }
        else if(sixHoursTemp[i] < 18){
            document.getElementById(`icon-${i+1}`).src = "./images/Weather Icons/rainyIcon.svg";
        }
        else if(sixHoursTemp[i] >= 18 && sixHoursTemp[i] <= 22){
            document.getElementById(`icon-${i+1}`).src = "./images/Weather Icons/windyIcon.svg";
        }
        else if(sixHoursTemp[i] >= 23 && sixHoursTemp[i] <= 29){
            document.getElementById(`icon-${i+1}`).src = "./images/Weather Icons/cloudyIcon.svg";
        }
        else if(sixHoursTemp[i] > 29){
            document.getElementById(`icon-${i+1}`).src = "./images/Weather Icons/sunnyIcon.svg";
        }
    }; 


    //Temperature
    document.getElementById("temp-num1").innerHTML = weather_data[currentCity].temperature.slice(0,-2);
    for( let i=2; i<6; i++) {
        document.getElementById(`temp-num${i}`).innerHTML = weather_data[currentCity].nextFiveHrs[i-2].slice(0,-2);
    }
    document.getElementById("temp-num6").innerHTML = weather_data[currentCity].temperature.slice(0,-2);

    
}