 //accessing html elements
const canvas = document.getElementById("mycanvas");
let animation;
let bestCar=[];
let bname="BestBrain";
let generation_level = 0;
let timer = 3000;


window.onload = function(){
    let brain = findLocalItems(bname);
    Start_Emulator(5,2,0.2,brain);
   
}

function Reload(){
    window.location.reload()
}
function Save(brainname = bname){
    // Remove(brainname);
    localStorage.setItem(brainname,JSON.stringify(bestCar[0].brain));
}
function Remove(brainname=bname){
    localStorage.removeItem(brainname);
    window.location.reload();
}

function CreateCarz(num,road,sensor_range){
    const carz=[];
    for(let i=0;i<num;i++){
        carz.push(
        new Car(road.getLaneCenter(1),100,road.laneWidth-60,road.laneWidth+10,"AI",sensorRay=sensor_range)
    );}
    return carz;
}
function GetRandomPosition(){
    let Lane_no= parseInt(Math.random()*3)
    let Y = parseInt(Math.random()*(-2000)-200)
    
    return([Lane_no,Y])
}

function CreateTraffic(road){
    let traffic=[];
    let n=5;
    for(let i=0;i<n;i++){
        let [Lane,Y] = GetRandomPosition()
        traffic.push(new Car(road.getLaneCenter(Lane),Y,100,200,"Dummy",2,maxspeed=3));
    }
    // traffic = [
    //     new Car(road.getLaneCenter(Lane),Y,100,200,"Dummy",2,maxspeed=3),
    //     // new Car(road.getLaneCenter(1),-500,100,200,"Dummy",2,maxspeed=3),
    //     // new Car(road.getLaneCenter(2),-800,100,200,"Dummy",2,maxspeed=4),
    //     // //new Car(road.getLaneCenter(0),-500,100,200,"Dummy",2,maxspeed=1),
    //     // new Car(road.getLaneCenter(0),-1300,100,200,"Dummy",2,maxspeed=3)
    //  ];
     return traffic;
    
}

function BestCarNow(cars){
    let bestCar = cars.find(
        c=>c.y == Math.min( ...cars.map(c=>c.y))
    );
    let b2 = cars[parseInt(Math.random()*(cars.length))]
    console.log(b2,bestCar)

    return bestCar

}

//to Work on /...................................
function fitness(cars){
    bestCar = cars.find(
        c=>c.speed == Math.max( ...cars.map(c=>c.speed) )
        && (
            c=>c.y == Math.min( ...cars.map(c=>c.y))
        )
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
    bestCar[0] = cars[0];
   
    if(brain){
        for(let i=0 ;i<cars.length;i++){
            cars[i].brain = JSON.parse(brain);
            if(i!=0){
                NN.Mutuate(cars[i].brain,mutate);
            }
        }

    }
    
    const traffic = CreateTraffic(road);


animate();

function animate(){
    if (timer==0){
        Save()
        Reload();
        return
    }
    timer-=1;
    // console.log(timer);
    //traffic cars
    traffic.forEach(e=>e.update(road.borders,[]));
    //AI Cars
    cars.forEach(e=>e.update(road.borders,traffic));

    bestCar[0] = BestCarNow(cars);

    //move camera.
    canvas.height = window.innerHeight;
    ctx.translate(0,-bestCar[0].y+canvas.height*0.7);
    road.draw(ctx);

    traffic.forEach(e=>e.draw(ctx));

    ctx.globalAlpha=0.5;
    cars.forEach(e=>e.draw(ctx));
    
    ctx.globalAlpha=1;
    bestCar[0].draw(ctx,true);

    anim = requestAnimationFrame(animate);
}
    
}

