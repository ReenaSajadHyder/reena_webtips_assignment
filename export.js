//convert celsius to fahrenheit

export default function changeToFahrenheit(val){
    let fahrenheit = val * 1.8 + 32;
    console.log("This is displayed in console:" + fahrenheit);
    return fahrenheit;
};