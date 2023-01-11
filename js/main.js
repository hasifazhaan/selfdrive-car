 //accessing html elements
const canvas = document.getElementById("mycanvas");
const score_dis = document.getElementById("Score");


let animation;
let bestCar=[];
let bname="BestBrain";
let generation_level = 0;
let timer = 3000;
let score = 0;


let totalcars = 100;
let sensor = 5;
let mutationLevel = 0.1;
let fitnessfun = 1;



window.onload = function(){
    canvas.width = (window.innerWidth <500)? window.innerWidth-50 :500;
    let brain = findLocalItems(bname);
    Start_Emulator(sensor,totalcars,mutationLevel,brain,fitnessfun);
}

//Basic Controls//
function Reload(){

    //window.location.reload();
    window.cancelAnimationFrame(animation);
    let brain =  findLocalItems(bname);
    timer = 3000;
    Start_Emulator(sensor,totalcars,mutationLevel,brain,fitnessfun);


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
    let empty_pos = [];
    let [Lane,Y] = GetRandomPosition(n)
    for(let i=0;i<n;i++){
        traffic.push(new Car(road.getLaneCenter(Lane[i]),Y[i],road.laneWidth-60,road.laneWidth+10,"Dummy",0,3));
        let  arr = [0,1,2];
        arr = arr.filter(function(item) {
            return item !== Lane[i];
        });
        empty_pos.push([arr,Y[i]]);

    }
    let freetake=takeover(road,empty_pos);

    return [traffic,freetake];
}

function takeover(road,pos){
    let em = [];
    for(let i=0;i<pos.length;i++){
        for (let j=0;j<pos[i].length;j++){
            em.push(new Car(road.getLaneCenter(pos[i][0][j]),pos[i][1],80,80,"takeover",0,3));
        }

    }
    return em;

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
    let numbersArray = createArrayOfNumber(500,carsNo*500,400);
    let Lane_No=[];
    let Y_pos=[];
    for(let i=0;i<carsNo;i++){
        [numbersArray,carPos]= getRandomNumber(numbersArray);
        Lane_No.push(parseInt(Math.random()*3));
        Y_pos.push(-carPos);
    }  
    return([Lane_No,Y_pos]); 
}


function removeDamagedCars(cars){
    let i=0;
    while(i<cars.length){
        if(cars[i].damage==true){
            cars.splice(i,1);
        }
        else{
            ++i;
        }
    }
    return cars;

}
//................//


//Fitness Functions.....///
function TopY(cars){
    let bestCar = cars.find(
        c=>c.y == Math.min( ...cars.map(c=>c.y))
    );

    return bestCar

}

//to Work on /...................................

function fitness(cars,no){
    let car;
    switch (no){
        case 0:
           car= TopY(cars);
            break;
        case 1:
           car = Score(cars);
            break;
    }
    bestCar[1]={score:0}
    if(bestCar[0]){
        sc=Math.max(bestCar[1].score,bestCar[0].score,car.score)
        bestCar[1] = cars.find(c=>c.score == sc);
    }

//     for (let i=0;i<bestCar[1].brain.levels[0].input)
//    console.log(bestCar[1].brain.levels[0].o)
    
    return car;
}
function Score(cars){
    cars.forEach((e)=>{
        if(!e.damage){
            let inc_score = (-e.y/1000)<0 ?0:-e.y/100000;
            e.score += inc_score;
        }
    })
    let bestCar = cars.find(c=>c.score == Math.max( ...cars.map(c=>c.score)));
    

    return bestCar;

}


//...............//




function Start_Emulator(sensor_range,population,mutate,brain,fitlevel){
    generation_level++;
   
    const ctx = canvas.getContext("2d");
    //creating road and car instance
    const road=new Road(canvas.width/2,canvas.width*.9,laneCount=3); 

    const N=population;fitnessfun
    
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
    
    const [traffic,freetake] = CreateTraffic(road);
    // const bonus  = takeover(road);
animate();
return

function animate(){
    cars = removeDamagedCars(cars);
    let totalcars = cars.length;
    if (timer==0|| totalcars==0){
        Save()
        Reload();
        return
    }
    timer-=1;
    //traffic cars
    traffic.forEach(e=>e.update(road.borders,[]));
    //AI Cars
    cars.forEach(e=>e.update(road.borders,traffic));
    freetake.forEach(e=>e.update(road.borders,cars));

    bestCar[0] = fitness(cars,fitlevel);
    score_dis.innerHTML = "Gene:"+generation_level+"<br>Score:"+Math.floor(bestCar[0].score) + "<br>Timer:"+ timer+ "<br>Total Cars:"+totalcars;
    
    //move camera.
    canvas.height = window.innerHeight;
    ctx.translate(0,-bestCar[0].y+canvas.height*0.7);
    road.draw(ctx);

    traffic.forEach(e=>e.draw(ctx));
    freetake.forEach(e=>e.draw(ctx));

    ctx.globalAlpha=0.5;
    cars.forEach(e=>{e.draw(ctx)});
    
    
    ctx.globalAlpha=1;
    bestCar[0].draw(ctx,true);

    animation = requestAnimationFrame(animate);
    return false;
}
    
}

