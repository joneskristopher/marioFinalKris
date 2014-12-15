game.PlayerEntity = me.Entity.extend({
   init:function (x, y, settings){
       this._super(me.Entity, 'init', [x, y, {
           image: "mario",
           spritewidth: "128",
           spriteheigth: "128",
           width: 128,
           height: 128,
           getShape: function(){
               return (new me.Rect(0, 0, 30, 128)).toPolygon();
           }
       }]);
   // code to make the chracter walk the speed your character walks and makes the camera follow the character
       this.renderable.addAnimation("idle", [3]);
       this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 160);
       this.renderable.setCurrentAnimation("idle");
       this.body.setVelocity(5, 20);
       me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   },
   // code that controls the keys that make the chracter move and making it look smooth
   update:function(delta) {
        if(me.input.isKeyPressed("right")){
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(false);
        }else if(me.input.isKeyPressed("left")){
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(true);
        }else{
            this.body.vel.x = 0;
        }
        if(me.input.isKeyPressed("up")){
            if(!this.body.jumping && !this.body.falling){
                this.body.jumping = true;
                this.body.vel.y -= this.body.accel.y * me.timer.tick;
            }
        }
        
        if(this.body.vel.x !== 0) {
            if(!this.renderable.isCurrentAnimation("smallWalk")){
            this.renderable.setCurrentAnimation("smallWalk");
            this.renderable.setAnimationFrame();
            }
        }else{
            this.renderable.setCurrentAnimation("idle");
        }
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this._super(me.Entity, "update", [delta]);
        return true;
   },
           
   collideHandler: function(responce) {
       
   }   
});

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xspawn = settings.xspawn;
        this.yspawn = settings.yspawn;
    },
    onCollision: function(){
        this.body.netCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xspawn, this.yspawn);
    }
});