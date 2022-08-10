class Car{
    constructor(x,y,width,height,Ctype,sensorRay=10,maxspeed=5){
        this.x = x
        this.y = y
        this.height = height
        this.width  =width
        this.speed = 0
        this.accl = 0.25
        this.maxspeed = maxspeed;
        this.friction=0.05
        this.angle = 0;
        this.damage = false;
        this.poly = 0;
        this.Ctype = Ctype;
        this.useBrain = Ctype=="AI";
        this.car_img = new Image()
        if (this.Ctype !="Dummy"){
            this.car_img.src="./res/TrainCar.png";
            this.sensor = new Sensors(this,sensorRay);
            this.brain = new NN(
                [this.sensor.rayCount,sensorRay,15,4]
            );
        }
        else{
            this.car_img.src ="./res/TrafficCar.png"; 
        }
        
        this.control = new Control(Ctype);
    }

    update(roadBorders,traffic){
        if (!this.damage){
            this.#move();
            this.poly = this.#carsize();
            this.damage = this.#assessdamage(roadBorders,traffic);
            if(this.sensor){
                this.sensor.update(roadBorders,traffic);
                const offset = this.sensor.readings.map(s=>{ 
                    if (s ==null)
                        return -1;
                    else{
                        if (s.offset>0.5)
                            return 1-s.offset
                        else
                            return 0.5-s.offset
                    }
                });
                const outputs= NN.feedForward(offset,this.brain)
        
                if(this.useBrain){
                    this.control.front=outputs[0];
                    this.control.left=outputs[1];
                    this.control.right=outputs[2];
                    this.control.back=outputs[3];
                }
        
            }   
        }

    }

    #assessdamage(roadBorders,traffic){
        for(let i =0;i<roadBorders.length;i++){
            if (polysIntersect(this.poly,roadBorders[i])){
                return true;
            }
        }
        for(let i =0;i<traffic.length;i++){
            if (polysIntersect(this.poly,traffic[i].poly)){
                return true;
            }
        }
        return false;
    }


// for crash detection purpose

    #carsize(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
        }

    #move(){
        //for speed accleration
        if(this.control.front){
            this.speed += this.accl;
        }
        if(this.control.back){
            this.speed -= this.accl;
        }
        // Manage Top Speed
        if(this.speed>this.maxspeed){
            this.speed=this.maxspeed;
        }
        if(this.speed<-this.maxspeed/2){
            this.speed=-this.maxspeed/2;
        }
        // add friction to car
        if (this.speed>0){
            this.speed-=this.friction;
        }
        if (this.speed<0){
            this.speed+=this.friction;
        }
        //stop if friction is more than speed
        if (Math.abs(this.speed)<this.friction){
            this.speed = 0
        }
        //left and right turns
        if(this.speed!=0){
            const flip = this.speed>0 ?1:-1;
            if(this.control.left){
                this.angle+=.01*flip
            }
            if(this.control.right){
                this.angle-=0.01*flip
            }
        }
         // asign speed 
         this.x-=Math.sin(this.angle)*this.speed;
         this.y-=Math.cos(this.angle)*this.speed;

    }

    draw(ctx,drawSensor=false){
        if (this.damage){
            ctx.globalAlpha = 0.4;
        }
        else{
            ctx.globalAlpha = 1;
        }
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        // ctx.beginPath();
        // ctx.rect(
        //     -this.width/2,
        //     -this.height/2,
        //     this.width,
        //     this.height
        // );
        // ctx.fill();
        ctx.drawImage(this.car_img, -this.width/2, -this.height/2,this.width,this.height); 
       
        ctx.restore();

        if (this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
        
    }
}