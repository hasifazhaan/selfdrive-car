 //accessing html elements
const canvas = document.getElementById("mycanvas");
const op = document.getElementById("opening");
const emulator = document.getElementById("emulator");
let animation;
let bestCar;
let bname="Brain";
let generation_level = 0;


window.onload = function(){
   emulator.style.display="none";
   op.style.display="flex";
   slider = document.querySelectorAll(".slider");

   for (i=0;i<slider.length;i++){
        slider[i].oninput = function() {
            output = this.nextElementSibling;
            output.innerHTML = this.value;
        }
   }
   CreateBrainOptions();
}
function start(){
    const sensor_range = parseInt(document.getElementById("sensor_range").innerHTML);
    const population = parseInt(document.getElementById("population").innerHTML);
    const mutate = parseInt(document.getElementById("mutate").innerHTML)/100;
    const bbrain = document.getElementById("brains")
    bname = bbrain.options[bbrain.selectedIndex].text
    const brain = bbrain.value == "0" ? false :bbrain.value ;
    emulator.style.display="flex";
    op.style.display="none";
    
    Start_Emulator(sensor_range,population,mutate,brain);
}

function Reload(){
    //window.location.reload()
    if(animation){
        canvas.width+=0;
        cancelAnimationFrame(animation);
    }
    start()
}
function Save(brainname = bname){
    // Remove(brainname);
    if(!bestCar){
        localStorage.setItem(brainname,"0");
        return;
    }
    localStorage.setItem(brainname,JSON.stringify(bestCar.brain));
}
function Remove(brainname=bname){
    if(findLocalItems(brainname).length){
        localStorage.removeItem(brainname);
    }
    window.location.reload()
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
        new Car(road.getLaneCenter(2),-500,100,200,"Dummy",2,maxspeed=3),
        new Car(road.getLaneCenter(2),-800,100,200,"Dummy",2,maxspeed=4),
        new Car(road.getLaneCenter(1),-1500,100,200,"Dummy",2,maxspeed=1),
        new Car(road.getLaneCenter(0),-1900,100,200,"Dummy",2,maxspeed=3)
     ];
     return traffic;
    
}

function BestCarNow(cars){
    bestCar = cars.find(
        c=>c.y == Math.min( ...cars.map(c=>c.y))
    );
    return bestCar

}

//to Work on /...................................
function fitness(cars){
    bestCar = cars.find(
        c=>c.speed == Math.max( ...cars.map(c=>c.speed) )
    );
    return bestCar;
}
function Start_Emulator(sensor_range,population,mutate,brain){
    generation_level++;
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
        Save()
        
    }
    const traffic = CreateTraffic(road);
    let show_brain_name = document.getElementById("show_brain_name")
    show_brain_name.innerHTML = bname +",<br>"+mutate+","+population+",<br>sensor"+sensor_range+",<br>gen:"+generation_level ;


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

