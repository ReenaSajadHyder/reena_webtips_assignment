//convert celsius to fahrenheit
export function changeToFahrenheit(val) {
  let fahrenheit = val * 1.8 + 32;
  return fahrenheit;
}

//reusable fetch function
export async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  const result = await data;
  return result;
}

//fetch function for hourly time
export async function fetchCityDetails(currentCity, data, setNextFiveHrsTemp) 
  {
    let url = `/cityData?city=${currentCity}`;
    const result = await fetchData(url);
    const response2 = await fetch(
      "/nextFiveHours",
      {
        method: "POST",
        body: JSON.stringify({
          ...result,
          hours: "5",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const data2 = await response2.json();
    const result2 = await data2;
    for (let i = 0; i < 5; i++) {
      setNextFiveHrsTemp(
        data[`${currentCity}`].temperature,
        result2
      );
    }
  }