class Waveform extends SubView {

    constructor(x,y,w,h){
        super(x,y,w,h)
        this.data = null;
        this.image = null;
    }

    display(){
        if(this.image != null){
            image(this.image,this.x,this.y,this.w,this.h)
        }
        stroke(152);
        strokeWeight(2);
        noFill();
        rectMode(CORNER);
        rect(this.x,this.y,this.w,this.h);
    }

    mousePressed(x,y){
        this.mouseDragged(x,y)
    }

    mouseDragged(x,y){
        if(this.containsMouse(x,y) && (this.data != null)){
            const scaledx = floor(this.offsetMouse(x,y)[0] / this.w * this.data.getRowCount());
            let mels = []
            for(let i = 0; i < this.data.getColumnCount(); i++){
                mels[i] = this.data.rows[scaledx].get(i);
            }
            mel_ms.valueAction(mels)
        }
    }

}