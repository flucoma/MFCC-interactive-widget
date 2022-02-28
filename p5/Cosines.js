class Cosines extends SubView {

    constructor(x,y,w,h){
        super(x,y,w,h)
    }

    mouseDragged(x,y){
        // why can't these be inherited as empty from the super class !?!?!?!?!?!
    }

    mousePressed(x,y){
        // why can't these be inherited as empty from the super class !?!?!?!?!?!
    }
    
    pointInBounds(x,y){
      return x > 0 && x < this.w && y > 0 && y < this.h
    }

    display(){
      if(show_cosines){
        push()
        translate(this.x,this.y)
        const barwidth = mel_ms.getBarWidth();
        const bargap = mel_ms.getBarGap(barwidth);
        const halfbarwidth = barwidth * 0.5;
        const barskip = barwidth + bargap;
        for(let j = 0; j < mfcc_ms.values.length; j++){
            const amp = mfcc_ms.values[j];
            const cosPoints = cosinePoints(j,mel_ms.values.length,false);
            noFill()
            stroke(colors[j]);
            strokeWeight(2);
            let px = 0
            let py = 0
            cosPoints.forEach((value,index) => {
                const y = (this.h * 0.5) + (value * amp * -1 * 2);// * -1 inverts because it's a graphics y axis
                const x = bargap + halfbarwidth + (index * barskip);
                
                if(index > 0 && this.pointInBounds(x,y) && this.pointInBounds(px,py)) line(x,y,px,py)
                
                px = x;
                py = y;
            })
        }
        pop()
    }
  }
}
