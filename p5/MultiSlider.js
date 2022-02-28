class MultiSlider extends SubView {
  
  constructor(x,y,w,h,min,max,ref,showNumbers){
    super(x,y,w,h)
    this.showNumbers = showNumbers;
    this.reference = ref;
    this.min = min;
    this.max = max;
    this.values = [0];
    this.action = null;
    this.colors = null;
    this.bleed = 0;
    this.title = null;
    this.showIndices = null;
  }

  setColors(colors){
    this.colors = colors;
  }

  getBarWidth(){
    return this.w / (this.values.length * 2);
  }

  getBarGap(barwidth){
    return (this.w - (this.values.length * barwidth)) / (this.values.length+1);
  }
  
  display(){
    push();
    translate(this.x,this.y)
    fill(152);
    noStroke();
    rectMode(CORNER);
    rect(0,0,this.w,this.h);
    
    const bar_width = this.getBarWidth();
    const bar_gap = this.getBarGap(bar_width);
    const bar_skip = bar_width + bar_gap;
    this.values.forEach((value,i,arr) => {
      noStroke();
      if(this.colors != null){
        fill(this.colors[i])
      } else {
        fill(0);
      }

      const barx = bar_gap + (bar_skip*i);
      const bary = map(this.reference,this.min,this.max,this.h,0);
      let bartop = map(value,this.min,this.max,this.h,0,false);
      
      if(bartop < 0){
        beginShape();
        vertex(barx,0)
        vertex(barx+bar_width,0);
        vertex(barx+(bar_width/2),0-(bar_width * 0.3))
        endShape();
      }

      if(bartop > this.h){
        beginShape();
        vertex(barx,this.h)
        vertex(barx+bar_width,this.h);
        vertex(barx+(bar_width/2),this.h+(bar_width * 0.4))
        endShape();
      }
      
      rectMode(CORNERS);
      rect(barx,bary,barx + bar_width,constrain(bartop,0,this.h));

      fill(0);
      textAlign(CENTER);
      
      if(this.showNumbers){
        text(round(value,2),barx, bary - 15, bar_width);
      }   
      
      if(this.showIndices != null){
        text(i,barx, this.showIndices, bar_width);
      }
    })

    // print("title",this.title)
    if(this.title != null){
      fill(0);
      textAlign(LEFT)
      textSize(18)
      text(this.title,margin,margin * 2.5);
    }
    pop();
  }

  setAction(func){
    this.action = func;
  }
  
  value(vals){
    this.values = vals;
  }

  valueAction(vals){
    this.values = vals;
    this.action();
  }

  setValueFromMouse(x,y){
    const slider_y = map(y,0,this.h,this.max,this.min);
    const index = this.indexFromMouse(x);
    if(index != null){
      this.values[index] = slider_y;
      this.action();
    }
  }

  indexFromMouse(x){
    const barwidth = this.getBarWidth();
    const bargap = this.getBarGap(barwidth);
    for(let i = 0; i < this.values.length; i++){
      const barmin = bargap + ((barwidth+bargap) * i);
      const barmax = barmin + barwidth;
      if(x > barmin && x < barmax){
        return i;
      }
    }
    return null;
  }

  mousePressed(x,y){
    this.mouseDragged(x,y)
  }

  mouseDragged(x,y){
    if(this.containsMouse(x,y)){
      this.setValueFromMouse(...this.offsetMouse(x,y));
    }
  }
}
