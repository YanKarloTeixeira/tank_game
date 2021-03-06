module objects {
    export class NewBullet extends objects.GameObject {
        // Private Instance Variables
        private updateRate : number = 20;
        private angle : number =0;
        private xCartesianActual : number = 0;// register the actual x vector o the line in cartesian plan
        private yCartesianActual : number = 0;// register the actual x vector o the line in cartesian plan

        private canvasLeft : number;
        private canvasTop : number;
        private canvasWidth : number;
        private canvasHeight :number;
        public shooter : string;
        

        // Public Properties
        public isFired: boolean = false;


        // Constructor
        constructor(assetManager: createjs.LoadQueue, shooter : string) 
        {
                super(assetManager,"bullet");
            //Difining the object on the screen
            this.x = 1;
            this.y = 1;
            this.isColliding = false;
            this.visible = false;
            this.shooter = shooter;
        }

        // Public Methods
        public fire (x:number, y:number, angle : number) 
        {
            //Defining the object position on screen
            this.x =  x ;
            this.y = y ;
            this.setAngle(angle);
            this.xCartesianActual = x;
            this.yCartesianActual = y;
            this.isColliding = false;
            this.visible = true;
            this.isFired = true;
        }
        public setAngle(angle : number){
            this.angle = this.absoluteAngle(angle);
        }
        public updateCache(){
            
        } 

        public Move() {
            
        }

        public bulletMovement(tank : objects.NewTank):void{
            if(this.isFired){
                this.x = this.nextCartesianX() //- this.getBounds().width * 0.5;
                this.y = this.nextCartesianY() //- this.getBounds().height * 0.5;           
                this.CheckBounds();
                // Checks all the objects registered for collision check 
                // objects.Game.objectsMap.forEach(obj=>{
                //     console.log("Looping Obj : "+ obj.name )
                // });
                let objectDetected : objects.GameObject;
                for(objectDetected  of objects.Game.objectsMap){
                    console.log("Looping Obj : "+ objectDetected.name +"  // Obj. cheking : "+ this.name + " //  Owner : "+ tank.name)
                    // if(objectDetected.name != "bullet") managers.Collision.Check(objectDetected, this, tank);
                    if(objectDetected.name != tank.name && objectDetected.name.toUpperCase() != "POWERUP" && objectDetected.visible==true){
                        managers.Collision.Check(objectDetected, this, tank);
                        if(this.isColliding && objectDetected.name !=this.shooter){
                            this.destroyBullet();
                            if(objectDetected.name.toLocaleUpperCase()=="BARRIER") objectDetected.Update();
                        }
                    }
                }

                
            }
        }

        // converts to Radians (the math functions cos() and sin() need an radian angle)
        private radians( _angle:number): number{
            let m : number = this.angle/180* Math.PI; 
            return this.angle/180* Math.PI; 
        }

        // Converts angles with high values (above 360) 
        // to the range between 0 and 360
        private absoluteAngle( _angle:number) : number{
            return  _angle % 360; // Checks the final angle  
        }

        // Checks which quadrant in a circle the referred angle belongs to
        // counter-clockwise
        // private quadrant(_angle:number): number{
        //     let absolute : number = this.angle;
        //     if(this.angle >270) return 4;
        //     if(this.angle >180) return 3;
        //     if(this.angle >90) return 2;
            
        //     return 1;
        // }

        // Based on the new x-axis value y-axis is recalculated
        private nextCartesianY():number
        {
            this.nextCartesianX();
            this.yCartesianActual -= this.updateRate * Math.sin(this.radians(this.angle));
            return this.yCartesianActual; 
        }

        private nextCartesianX() : number{
            this.xCartesianActual += this.updateRate * Math.cos(this.radians(this.angle)) ; 
            return this.xCartesianActual;
        }

        public NoColision() : boolean {
            return !(this.xCartesianActual + this.getBounds().width> this.canvasWidth+ this.canvasLeft ||
                this.xCartesianActual+ this.getBounds().width < this.canvasLeft || 
                this.yCartesianActual+ this.getBounds().height> this.canvasTop+this.canvasHeight || 
                this.yCartesianActual+ this.getBounds().height< this.canvasTop)
                
        
        }

        public CheckBounds(){
            // right boundary
            if(this.x >= 1500 -  this.halfWidth) {
                this.destroyBullet();
                this.x = 1500 - this.halfWidth;
            }
            // left boundary
            if(this.x <= this.halfWidth) {
                this.destroyBullet();
                this.x = this.halfWidth;
            }

            // bottom boundary
            if(this.y >= 800 -  this.halfHeight) {
                this.destroyBullet();
                this.y = 800 - this.halfHeight;
            }

            // top boundary
            if(this.y <= this.halfHeight) {
                this.destroyBullet();
                this.y = this.halfHeight;
            }
        }

        public destroyBullet(){
            this.isFired = false;
            this.isColliding = false;
            this.visible = false
            this.x=-100
            this.y=-100
        }


    }
}
