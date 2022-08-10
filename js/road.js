class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;
        this.left=x-width/2;
        this.right=x+width/2;
        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;
        const topleft = {x:this.left,y:this.top}
        const topright = {x:this.right,y:this.top}
        const bottomleft = {x:this.left,y:this.bottom}
        const bottomright = {x:this.right,y:this.bottom}
        this.lanewidth = 0

        this.borders = [
            [topleft,bottomleft],
            [topright,bottomright]
        ]
    }

    getLaneCenter(laneIndex){
        this.laneWidth=this.width/this.laneCount;
        return this.left+this.laneWidth/2+ Math.min(laneIndex,this.laneCount-1)*this.laneWidth

    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=0;i<=this.laneCount;i++){
            const x=lerp(
               this.left,
               this.right,
               i/this.laneCount
           );
           if(i>0&&i<this.laneCount){
                ctx.setLineDash([20,20]);
            }
            else{
            ctx.setLineDash([]);
            }
           ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();

        }
    }
}