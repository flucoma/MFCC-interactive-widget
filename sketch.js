let mel_ms;
let mfcc_ms;
let margin = 10;
let pi = 3.14159265359;

function setup() {
  createCanvas(1600, 600);
  let ms_width = (width - (margin*3)) / 2;
  let ms_height = (height - (margin * 3)) * 0.7;
  mel_ms = new MultiSlider(margin,margin,ms_width,ms_height,0,100,0,false);
  mfcc_ms = new MultiSlider((margin*2) + ms_width,margin,ms_width,ms_height,-80,80,0,true);

  let mels = [];
  for(let i = 0; i < 40; i++){
    mels[i] = 0;
  }

  let mfccs = [];
  for(let i = 0; i < 13; i++){
    mfccs[i] = 0;
  }

  mel_ms.value(mels)
  mfcc_ms.value(mfccs);

  mel_ms.setAction(() => {
    // print('function called')
    mfcc_ms.value(dct(mel_ms.values,mfcc_ms.values.length));
  })

  mfcc_ms.setAction(() => {
    let longenough = [];
    for(let i = 0; i < mel_ms.values.length; i++){
      if(i < mfcc_ms.values.length){
        longenough[i] = mfcc_ms.values[i]
      } else {
        longenough[i] = 0;
      } 
    }
    mel_ms.value(idct(longenough,longenough.length))
  })
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
  let out = [];

  for(let k = 0; k < nCoeffs; k++){
    let v = [];
    for(let n = 0; n < array.length; n++){
      let xn = array[n];
      let x = (((2*n)+1)*pi*k) / (2*array.length);
      let c = cos(x) * xn;
      v[n] = c;
    }
    let sum = v.reduce((total,val,idx,arr) => total + val);
    let scale;
    if(k == 0) {
      scale = Math.sqrt(1/(4 * array.length));
    } else {
      scale = Math.sqrt(1/(2 * array.length));
    }
    out[k] = sum * 2 * scale;
  }  

  return out;
}

function idct(values,n_coeffs){
  let out = [];

  for(let k = 0; k < n_coeffs; k++){
    let scale = Math.sqrt(2/values.length);
    let v = [];
    for(let n = 1; n < values.length; n++){
      let xn = values[n];
      let x = (((2 * k) + 1) * pi * n) / (2 * values.length);
      let c = cos(x) * xn;
      v[n] = c
    };
    let sum = v.reduce((total,val,idx,arr) => total + val);
    let off = values[0] / Math.sqrt(values.length);
    out[k] = off + (sum * scale)
  }

  return out;
}