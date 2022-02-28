class SubView {

    constructor(x,y,w,h){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  
    containsMouse(x,y){
      return x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h)
    }

    offsetMouse(x,y){
        return [x - this.x, y - this.y]
    }

    mousePressed(x,y){
        // to be overriden
    }

    mouseDragged(x,y){
        // to be overridden
        // print('mouse dragged in SubView',x,y)
    }

    get right(){
        return this.x + this.w
    }

    get left() {
        return this.x
    }

    get top() {
        return this.y
    }

    get bottom() {
        return this.y + this.h
    }
}
