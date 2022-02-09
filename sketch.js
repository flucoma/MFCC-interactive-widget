let mel_ms;
let mfcc_ms;
let margin = 10;

function setup() {
  createCanvas(1000, 600);
  let ms_width = (width - (margin*3)) / 2;
  let ms_height = (height - (margin * 3)) * 0.7;
  mel_ms = new MultiSlider(margin,margin,ms_width,ms_height,0,100,0);
  mfcc_ms = new MultiSlider((margin*2) + ms_width,margin,ms_width,ms_height,-80,80,0);
  
  mel_ms.value([10,40,90,10,80,40,100])
  mfcc_ms.value([-60,40,20,15,-49,-70,0,10])
}

function draw() {
  background(255);
  mel_ms.display();
  mfcc_ms.display();
}

function mousePressed(){
  // print(mouseX,mouseY);
  mel_ms.mousePressed(mouseX,mouseY);
  mfcc_ms.mousePressed(mouseX,mouseY);
}

function mouseDragged(){
  // print('mouse dragged:',mouseX,mouseY);
  mel_ms.mouseDragged(mouseX,mouseY);
  mfcc_ms.mouseDragged(mouseX,mouseY);
}

function dct(array,nCoeffs){
  
}