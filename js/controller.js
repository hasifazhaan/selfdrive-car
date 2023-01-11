const slider = document.getElementsByClassName("slider");

for (let i=0;i<slider.length;i++){
    slider[i].onchange = function(){
        slider[i].nextElementSibling.innerHTML =  slider[i].value;
    }
}


function restartWithSettings(){
    let sensors = document.getElementById("sensorVal").value;
    let mutationlevel = document.getElementById("mutVal").value;
    let totalcars= document.getElementById("totalCarVal").value;
    let fitness = document.getElementsByName("fitness");
    console.log(sensors,mutationlevel,totalcars,fitness);
}