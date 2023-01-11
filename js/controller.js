const slider = document.getElementsByClassName("slider");

for (let i=0;i<slider.length;i++){
    slider[i].onchange = function(){
        slider[i].nextElementSibling.innerHTML =  slider[i].value;
    }
}


function restartWithSettings(){
    let sensors = parseInt(document.getElementById("sensorVal").innerText);
    let mutationlevel = parseInt(document.getElementById("mutVal").innerText);
    let totalcars= parseInt(document.getElementById("totalCarVal").innerText);
    let fitness = document.getElementsByName("fitness")[0].checked ? 1 :0 ;
    setSettingValue(totalcars,sensors,mutationlevel,fitness);
  

}