class NN{
    constructor(neuronCounts){
        this.levels =[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }
    static feedForward(iput,ntwk){
        let output =Level.feedForward( iput,ntwk.levels[0]);
    
        for(let i=1;i<ntwk.levels.length;i++){
            output = Level.feedForward(
                output,ntwk.levels[i] );  
        }

        if(!(output[0]^output[3])){
            let a=ntwk.levels[ntwk.levels.length-1].biases[0]
            let b=ntwk.levels[ntwk.levels.length-1].biases[3]
            if(a>b){
                output[0]= !output[0]?1:0;
            } 
            else{
                output[3]=!output[3]?1:0;
            }
           
        }
        return output;
        
    }

    static Mutuate(ntwk,amount=1){
        ntwk.levels.forEach(level => {
            for(let i =0;i<level.biases.length;i++){
            level.biases[i]=lerp(level.biases[i],
                Math.random()*2-1,
                amount)
            }
            for(let i=0 ;i<level.weight.length;i++){
                for(let j=0;j<level.weight[i].length;j++){
                    level.weight[i][j] = lerp(
                        level.weight[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }

    
}
class Level{
    constructor(inputCount,outputCount){
        this.input = new Array(inputCount);
        this.output  = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weight = [];
        for(let i=0;i<inputCount;i++){
            this.weight[i] = new Array(outputCount);
        }

        Level.#randombrain(this);
    }
    static #randombrain(level){
        for(let i=0;i<level.input.length;i++){
            for(let j=0;j<level.output.length;j++){
                level.weight[i][j] = Math.random()*2-1; 
            }
        }
        for(let i=0;i<level.biases.length;i++){
            level.biases[i] = Math.random()*2-1; 
        }
       
    }

    static feedForward(Input,level){
        for(let i=0;i<level.input.length;i++){
            level.input[i] = Input[i];
        }

        for(let i=0;i<level.output.length;i++){

            let sum=level.biases[i];
           
            for(let j=0;j<level.input.length;j++){
                sum += level.input[j]*level.weight[j][i];
            }
            
            level.output[i] = this.ActivationFunction(sum,1);
            
        }
        
        return level.output;
    }
    static ActivationFunction(weightedInput,number=1){
        switch(number){
            case 1:
                //binary Step
                return(weightedInput>0)?1:0;
            case 2:
                //sigmoid
                return (1/(1+Math.exp(-weightedInput)));
            case 3:
                //HyperBoic Tangent
                let w_exp = Math.exp(2*weightedInput);
                return(this.ActivationFunction( (w_exp-1)/(w_exp+1) ));
            case 4:
                //reLU
                return( Math.max(0,weightedInput) ) ;
            case 5:
                //reLU
                return(Math.log(1+Math.exp(weightedInput)) ) ;
            case 6:
                return 0;

        }
        
    }
    
}
