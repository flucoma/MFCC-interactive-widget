let mel_ms;
let mfcc_ms;
const margin = 10;
const pi = 3.14159265359;
const epsilon = 1e-6;
let colors = [];
let meldata;
let waveform;
let waveform_image;
let subviews = [];
let cosines;

function preload(){
  meldata = loadTable("resources/Harker-DS-TenOboeMultiphonics-M_melbands.csv");
  waveform_image = loadImage("resources/Harker-DS-TenOboeMultiphonics-M.jpg")
}

function setup() {
  createCanvas(1400, 600);
  frameRate(30);

  // https://sashamaps.net/docs/resources/20-colors/
  const color_tuples = [[230, 25, 75], [60, 180, 75], [255, 225, 25], [0, 130, 200], [245, 130, 48], [70, 240, 240], [240, 50, 230], [250, 190, 212], [0, 128, 128], [220, 190, 255], [170, 110, 40], [255, 250, 200], [128, 0, 0], [170, 255, 195], [0, 0, 128], [128, 128, 128], [255, 255, 255], [0, 0, 0]]
  colors = color_tuples.map(t => color(t));

  // MelBands Multislider
  const ms_width = (width - (margin*3)) / 2;
  const ms_height = (height - (margin * 3)) * 0.7;
  mel_ms = new MultiSlider(margin,margin,ms_width,ms_height,0,70,0,false);
  mel_ms.title = "Mel-Frequency Spectrogram (40 MelBands)"

  subviews.push(mel_ms)

  let mels = [];
  for(let i = 0; i < 40; i++){
    mels[i] = epsilon;
  }

  mel_ms.value(mels)

  mel_ms.setAction(() => {
    mfcc_ms.value(dct(mel_ms.values.map(x => ampdb(max(x,epsilon))),mfcc_ms.values.length));
  })

  // MFCCs Multislider
  mfcc_ms = new MultiSlider((margin*2) + ms_width,margin,ms_width,ms_height,-80,80,0,true);
  mfcc_ms.showIndices = margin * 4;
  mfcc_ms.title = "Mel-Frequency Cepstral Coefficients (13 MFCCs)"
  subviews.push(mfcc_ms)
  mfcc_ms.setColors(colors);

  let mfccs = [];
  for(let i = 0; i < 13; i++){
    mfccs[i] = 0;
  }
 
  mfcc_ms.value(mfccs);

  mfcc_ms.setAction(() => {
    let longenough = [];
    for(let i = 0; i < mel_ms.values.length; i++){
      if(i < mfcc_ms.values.length){
        longenough[i] = mfcc_ms.values[i]
      } else {
        longenough[i] = 0;
      } 
    }
    // print('sketch : mfcc_ms : setAction',longenough)
    mel_ms.value(idct(longenough,longenough.length).map(dbamp))
  })

  // Cosine Shaped MelBands Frequency Slider
  const cos_freq_slider_y = mel_ms.y + mel_ms.h + margin
  const cos_freq_slider = createSlider(0.0,mfcc_ms.values.length-1,1,0)
  cos_freq_slider.position(margin,cos_freq_slider_y)
  cos_freq_slider.style('width','400px')
  cos_freq_slider.input(() => {
    let cospoints = cosinePoints(cos_freq_slider.value(),mel_ms.values.length,false);
    // cospoints = cospoints.map(x => max(x * mel_ms.max * 0.5,epsilon))
    cospoints = cospoints.map(x => max((x * 0.5) + 0.5,epsilon) * mel_ms.max * 0.5)
    mel_ms.valueAction(cospoints)
  })

  // Cosines
  cosines = new Cosines(mel_ms.x,mel_ms.y,mel_ms.w,mel_ms.h)
  subviews.push(cosines)

  // Waveform Display
  const wf_y = cos_freq_slider_y + (margin * 3)
  const wf_h = height - (wf_y + margin)
  waveform = new Waveform(margin,wf_y,width - (margin * 2), wf_h)
  waveform.data = meldata;
  waveform.image = waveform_image;
  subviews.push(waveform)
}

function draw() {
  background(255);
  subviews.forEach((view) => {
    view.display();
  })
}

function mousePressed(){
    subviews.forEach((view) => {
      view.mousePressed(mouseX,mouseY);
    })
}

function mouseDragged(){
  subviews.forEach((view) => {
    view.mouseDragged(mouseX,mouseY);
  })
}

function dct(array,nCoeffs){
  let out = [];

  for(let k = 0; k < nCoeffs; k++){
    let v = [];
    array.forEach((xn,n) => {
      const x = (((2*n)+1)*pi*k) / (2*array.length);
      const c = cos(x) * xn;
      v[n] = c;
    })
    const sum = v.reduce((total,val,idx,arr) => total + val);
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
    const scale = Math.sqrt(2/values.length);
    let v = [];
    for(let n = 1; n < values.length; n++){
      let xn = values[n]
      let x = (((2 * k) + 1) * pi * n) / (2*values.length)
      v[n-1] = cos(x) * xn;
    }
    const sum = v.reduce((total,val) => total + val);
    const off = values[0] / Math.sqrt(values.length);
    out[k] = off + (sum * scale)
  }

  return out;
}

function cosinePoints(freq,nPoints,inv){
  let array = [];
  for(let i = 0; i < nPoints; i++){
    const x = (((2 * i) + 1) * pi) / (2 * nPoints);
    const y = cos(x * freq);
    if(inv) y *= -1;
    array[i] = y;
  }
  return array;
}

const ampdb = function(val){
  return Math.log10(val) * 20;
}

const dbamp = function(val){
  return 10**(val/20);
}