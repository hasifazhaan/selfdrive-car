 //accessing html elements
const canvas = document.getElementById("mycanvas");
let animation;
let bestCar=[];
let bname="BestBrain";
let generation_level = 0;
let timer = 800;
let score = 0;


window.onload = function(){
    let brain = findLocalItems(bname);
    Start_Emulator(5,2,0.1,brain);
   
}

//Basic Controls//
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

//...................//




//Creation Functions ////
function CreateCarz(num,road,sensor_range){
    const carz=[];
    for(let i=0;i<num;i++){
        carz.push(
        new Car(road.getLaneCenter(1),100,road.laneWidth-60,road.laneWidth+10,"AI",sensorRay=sensor_range)
    );}
    return carz;
}
function CreateTraffic(road){
    let traffic=[];
    let n=15;
    let [Lane,Y] = GetRandomPosition(n)
    for(let i=0;i<n;i++){
        traffic.push(new Car(road.getLaneCenter(Lane[i]),Y[i],100,200,"Dummy",0,3));
    }
     return traffic;
    
}
//............//

//Secondary Functions ....//
function getRandomNumber(arr) {
    let arr_len = arr.length-1;
    let rand = Math.floor(Math.random()*arr_len);
    let randNum = arr[rand];
    arr.splice(rand,1);
    return [arr,randNum]
  }
  function createArrayOfNumber(start, end,step=300) {
    let myArray = [];
    for (let i = start; i <= end; i+=step) {
      myArray.push(i);
    }
    return myArray;
  }

function GetRandomPosition(carsNo){
    let numbersArray = createArrayOfNumber(500,4000,400);
    let Lane_No=[];
    let Y_pos=[];
    for(let i=0;i<carsNo;i++){
        [numbersArray,carPos]= getRandomNumber(numbersArray);
        Lane_No.push(parseInt(Math.random()*3));
        Y_pos.push(-carPos);
    }  
    return([Lane_No,Y_pos]); 
}

//................//


//Fitness Functions.....///
function BestCarNow(cars){
    let bestCar = cars.find(
        c=>c.y == Math.min( ...cars.map(c=>c.y))
    );
    let b2 = cars[parseInt(Math.random()*(cars.length))];

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

function calculateScore(cars){
    cars.forEach((e)=>(!e.damage && )?e.score+=2:e.score);
    // let besty = cars.find(c=>c.y == Math.min( ...cars.map(c=>c.y) ));
    // let y = Math.floor(Math.abs(besty.y/1000));
    // besty.score += y  ;
    // console.log(besty.score);
    // let bspeed = cars.find(c=>c.speed == Math.max( ...cars.map(c=>c.speed) ));
    // bspeed.score+=1

    let bestCar = cars.find(c=>c.score == Math.max( ...cars.map(c=>c.score) ));
    console.log(bestCar.score)
    return bestCar;

}


//...............//




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

    bestCar[0] = calculateScore(cars);

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

