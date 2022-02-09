class MultiSlider {
  
  constructor(x,y,w,h,min,max,ref,showNumbers){
    this.showNumbers = showNumbers;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.reference = ref;
    this.min = min;
    this.max = max;
    this.values = [0];
    this.action = null;
  }

  getBarWidth(){
    return this.w / (this.values.length * 2);
  }

  getBarGap(bar_width){
    return (this.w - (this.values.length * bar_width)) / (this.values.length+1);
  }
  
  display(){
    
    fill(152);
    noStroke();
    rectMode(CORNER);
    rect(this.x,this.y,this.w,this.h);
    
    let bar_width = this.getBarWidth();
    let bar_gap = this.getBarGap(bar_width);
    let bar_skip = bar_width + bar_gap;
    for(let i = 0; i < this.values.length; i++){
      let barx = bar_gap + (bar_skip*i);
      let bary = map(this.reference,this.min,this.max,this.h,0);
      let bartop = map(this.values[i],this.min,this.max,this.h,0);
      // TODO: constrain bartop to within window.
      fill(0);
      rectMode(CORNERS);
      rect(this.x + barx,this.y + bary, this.x + barx + bar_width, this.y + bartop);
      if(this.showNumbers){
        fill(255);
        textAlign(CENTER);
        text(round(this.values[i],2),this.x + barx, (this.y + bary) - 15, bar_width);
      }
    }
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
    let slider_y = map(y,0,this.h,this.max,this.min);
    let index = this.indexFromMouse(x);
    if(index != null){
      this.values[index] = slider_y;
      this.action();
    }
  }

  indexFromMouse(x){
    let barwidth = this.getBarWidth();
    let bargap = this.getBarGap(barwidth);
    for(let i = 0; i < this.values.length; i++){
      let barmin = bargap + ((barwidth+bargap) * i);
      let barmax = barmin + barwidth;
      if(x > barmin && x < barmax){
        return i;
      }
    }
    return null;
  }

  mousePressed(x,y){
    if(x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h)){
      this.setValueFromMouse(x - this.x,y - this.y);
    }
  }

  mouseDragged(x,y){
    if(x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h)){
      this.setValueFromMouse(x - this.x,y - this.y);
    }
  }
}