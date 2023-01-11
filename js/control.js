class Control{
    constructor(Ctype){
        this.front = false;
        this.left = false;
        this.right = false;
        this.back = false;
        
        switch(Ctype){
            case "Control":
                this.#addKeyboardListener();
                break;
            case "Dummy":
            case "takeover":
                this.front = true;
                break;


        }
        
    }


    #addKeyboardListener(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case"a":
                case ("ArrowLeft") :
                    this.left = true
                    break;
                case"d":
                case "ArrowRight":
                    this.right = true
                    break;
                case "w":    
                case "ArrowUp":
                    this.front = true
                    break;
                    case"s":
                case "ArrowDown":
                    this.back = true
                    break;
            }
        }

        document.onkeyup=(event)=>{
            switch(event.key){
                case"a":
                case "ArrowLeft":
                    this.left = false
                    break;
                case"d":
                case "ArrowRight":
                    this.right = false
                    break;
                case "w":    
                case "ArrowUp":
                    this.front = false
                    break;
                case "s":    
                case "ArrowDown":
                    this.back = false
                    break;
            }
        }
    }
}