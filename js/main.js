 //accessing html elements
const canvas = document.getElementById("mycanvas");
const op = document.getElementById("opening");
const emulator = document.getElementById("emulator");
let animation;
let bestCar;

function findLocalItems (query) {
    var i, results = [];
    for (i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        if (i.match(query) || (!query && typeof i === 'string')) {
          value = JSON.parse(localStorage.getItem(i));
          results.push({key:i,val:value});
        }
      }
    }
    return results;
  }

window.onload = function(){
   emulator.style.display="none";
   op.style.display="flex";
   slider = document.querySelectorAll(".slider");
   const  getinputval = (slider)=>{

   }

   for (i=0;i<slider.length;i++){
        slider[i].oninput = function() {
            output = this.nextElementSibling;
            output.innerHTML = this.value;
        }
   }

   //brain in localstorage
   let brains = findLocalItems("bestBrain");
   brains.forEach((e)=>{
        var option = document.createElement("option");
        option.text = e.key ;
        option.value = JSON.stringify(e.val);
        var select = document.getElementById("brains");
        select.appendChild(option);
     });
     
   
   
   
  
}
function start(){
    const sensor_range = parseInt(document.getElementById("sensor_range").innerHTML);
    const population = parseInt(document.getElementById("population").innerHTML);
    const mutate = parseInt(document.getElementById("mutate").innerHTML)/100;
    const brain = document.getElementById("brains").value == "0" ? false : document.getElementById("brains").value ;
    emulator.style.display="flex";
    op.style.display="none";
    
    Start_Emulator(sensor_range,population,mutate,brain);
}

function Reload(){
    //window.location.reload()
    if(animation){
        cancelAnimationFrame(animation);
    }
    start()
}
function Save(brainname = "bestBrain"){
    Remove(brainname);
    localStorage.setItem(brainname,JSON.stringify(bestCar.brain));
    
}
function Remove(brainname){
    if(findLocalItems(brainname).length){
        localStorage.removeItem(brainname);
    }
    
    // Reload();
}

function CreateCarz(num,road,sensor_range){
    const carz=[];
    for(let i=0;i<num;i++){
        carz.push(
        new Car(road.getLaneCenter(1),100,road.laneWidth-60,road.laneWidth+10,"AI",sensorRay=sensor_range)
    );}
    return carz;
}
function CreateTraffic(road){
    const traffic = [
        new Car(road.getLaneCenter(1),-1000,100,200,"Dummy",2,maxspeed=3),
        new Car(road.getLaneCenter(1),-500,100,200,"Dummy",2,maxspeed=3),
        new Car(road.getLaneCenter(2),-800,100,200,"Dummy",2,maxspeed=4),
        new Car(road.getLaneCenter(0),-500,100,200,"Dummy",2,maxspeed=1),
        new Car(road.getLaneCenter(0),-1300,100,200,"Dummy",2,maxspeed=3)
     ];
     return traffic;
    
}

function BestCarNow(cars){
    bestCar = cars.find(
        c=>c.y == Math.min( ...cars.map(c=>c.y))
    );
    return bestCar

}

function Start_Emulator(sensor_range,population,mutate,brain){
    canvas.width = 500;
    const ctx = canvas.getContext("2d");
    //creating road and car instance
    const road=new Road(canvas.width/2,canvas.width*.9,laneCount=3); 

    const N=population;
    
    let cars = CreateCarz(N,road,sensor_range);
    //get best car from storage
    
    if(brain){
        for(let i=0 ;i<cars.length;i++){
            cars[i].brain = JSON.parse(brain);
            if(i!=0){
                NN.Mutuate(cars[i].brain,mutate);
            }
        }

    }
    else{
        bestCar = cars[0];
        let no = findLocalItems("bestBrain").length;
        let name = "bestBrain"+no;
        console.log(name);
        Save(name);

        
    }
    const traffic = CreateTraffic(road);

animate();

function animate(){
    //traffic cars
    traffic.forEach(e=>e.update(road.borders,[]));
    //AI Cars
    cars.forEach(e=>e.update(road.borders,traffic));

    bestCar = BestCarNow(cars);

    //move camera.
    canvas.height = window.innerHeight;
    ctx.translate(0,-bestCar.y+canvas.height*0.7);
    road.draw(ctx);

    traffic.forEach(e=>e.draw(ctx));

    ctx.globalAlpha=0.5;
    cars.forEach(e=>e.draw(ctx));
    
    ctx.globalAlpha=1;
    bestCar.draw(ctx,true);

    anim = requestAnimationFrame(animate);
}
    
}

