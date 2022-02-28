class Waveform extends SubView {

    constructor(x,y,w,h){
        super(x,y,w,h)
        this.data = null;
        this.image = null;
        this.audio = null;
    }

    display(){
      push()
      translate(this.x,this.y)
      // Waveform Image
      if(this.image != null){
          image(this.image,0,0,this.w,this.h)
      }
      
      // Playing Cursor
      if(this.audio.isPlaying()){
        const normed_pos = this.audio.currentTime() / this.audio.duration()
        this.setMels(normed_pos)
        this.cursorPos = normed_pos
      }
      
      this.drawCursor()
      
      // Bounding Box
      stroke(152);
      strokeWeight(2);
      noFill();
      rectMode(CORNER);
      rect(0,0,this.w,this.h);
      pop();
    }

    mousePressed(x,y){
        this.mouseDragged(x,y)
    }

    mouseDragged(x,y){
        if(this.containsMouse(x,y) && (this.data != null)){
          const normed_pos = this.offsetMouse(x,y)[0] / this.w
          this.cursorPos = normed_pos
          this.setMels(normed_pos)
          this.audio.stop();
          play_button.html("Play")
          // this.drawCursor(normed_pos)
        }
    }
    
    drawCursor(){
      let posx = this.cursorPos * this.w
      strokeWeight(1)
      stroke(255,0,0,150)
      line(posx,0,posx,this.h)
    }
    
    setMels(normed_pos){
      const data_index = floor(normed_pos * this.data.getRowCount());
      let mels = []
      for(let i = 0; i < this.data.getColumnCount(); i++){
          mels[i] = this.data.rows[data_index].get(i);
      }
      mel_ms.valueAction(mels)
    }
}
