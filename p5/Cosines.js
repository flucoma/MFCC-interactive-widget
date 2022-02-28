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

    display(){
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
            beginShape();
            cosPoints.forEach((value,index) => {
                const y = (this.y + (this.h * 0.5)) + (value * amp * -1 * 2);// * -1 inverts because it's a graphics y axis
                const x = this.x + bargap + halfbarwidth + (index * barskip);
                if(this.containsMouse(x,y)) vertex(x,y);
            })
            endShape();
        }
    }
}