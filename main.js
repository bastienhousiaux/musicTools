var model_url='./crepe';
var pitchDetector;
var audioContext;
var mic;
var audio;
var currentFrequency=0;
var fft;

var fftFreq=0;
var fftVal=0;

var RATIO_FFT_TO_FREQUENCY=44100/2048;
var noiseMapping=[];

var noiseCaptureTiming=0;
var TOTAL_NOISE_CAPTURE=1000;

var notes=[
    {name:"E2",frequency:82.41},
    {name:"A2",frequency:110.00},
    {name:"D3",frequency:146.83},
    {name:"G3",frequency:196.00},
    {name:"B3",frequency:246.94},
    {name:"E4",frequency:329.63}
]


function initializeMic(){
    mic=new p5.AudioIn();
    mic.start(listening);
}

function initializeFFT(){
    fft=new p5.FFT(0,1024);
    fft.setInput(mic);
}

function createML5PitchDetection(){
    pitchDetector=ml5.pitchDetection(
        model_url,
        audioContext,
        mic.stream,
        modelLoaded
    );
}


function setup(){
    createCanvas(1024,400);
    audioContext=getAudioContext();
    initializeMic();
    initializeFFT();
}
function gotPitch(error,frequency){
    if(error)console.error(error);
    else{
        if(frequency){
            currentFrequency=frequency;
            var samples=fft.analyze();
            var iMax=-1;
            var maxVal=-1;
            for(var i=0;i<samples.length;i++){
                if(samples[i]>maxVal){
                    iMax=i;
                    maxVal=samples[i];
                }
            }

            fftFreq=iMax;
            fftVal=maxVal;
            
        }
        pitchDetector.getPitch(gotPitch);
    }
}

function listening(){
    console.log("listening");
    // createML5PitchDetection();
}

function modelLoaded(){
    console.log("the model has been loaded");  
    // pitchDetector.getPitch(gotPitch);
}


var DETECT_FLOOR=100;


function draw(){
    background(0);

    var overFloorData=[];
    // drawML5();
    
    
    var spectrum=fft.analyze();
    stroke(255);

    if(noiseCaptureTiming<TOTAL_NOISE_CAPTURE){
        for(var i=0;i<spectrum.length;i++){
            if(noiseCaptureTiming==0)this.noiseMapping[i]=0;
            this.noiseMapping[i]+=spectrum[i];
            if(noiseCaptureTiming==TOTAL_NOISE_CAPTURE-1)this.noiseMapping[i]/=TOTAL_NOISE_CAPTURE;
        }
        noiseCaptureTiming++;
    }else{

        var maxAmpIndex=-1;
        var maxAmp=-1;
        for(var i=0;i<spectrum.length;i++){
            var amp=spectrum[i]-this.noiseMapping[i];
            if(amp>maxAmp){
                maxAmp=amp;
                maxAmpIndex=i;
            }
            if(amp>DETECT_FLOOR){
                overFloorData.push(i);
            }
            var y = map(amp,0,255,height,0);
            line(i,height,i,y);
        }

        stroke(255,0,0);
        for(var i=0;i<400;i+=50){
            line(0,i,1024,i);
        }

        // maxAmp*=RATIO_FFT_TO_FREQUENCY;

        var FLOOR_SURROUNDERS=100;
        var surrounding=[];
        var i=maxAmpIndex-1;
        // while(spectrum[i]-this.noiseMapping[i]>FLOOR_SURROUNDERS){
        //     surrounding.push({value:i,intensity:maxAmp-spectrum[i]-this.noiseMapping[i]});
        //     i--;
        // }
        // var i=maxAmpIndex+1;
        // while(spectrum[i]-this.noiseMapping[i]>FLOOR_SURROUNDERS){
        //     surrounding.push({value:i,intensity:(maxAmp-spectrum[i]-this.noiseMapping[i])/maxAmp});
        //     i++;
        // }

        // var correction=0;

        // for(var i=0;i<surrounding.length;i++){
        //     correction+=surrounding[i].value*surrounding[i].intensity;
        // }

        // correction/=surrounding.length;

        var finalAmp=maxAmpIndex;

        textAlign(CENTER,CENTER);
        fill(255);
        textSize(64);
        text("valeur pic : "+maxAmpIndex*RATIO_FFT_TO_FREQUENCY,width/2,height/2-75);
        text("pic corrigé : " +finalAmp,width/2,height/2);
    }

    

    // let previous=overFloorData[0];
    // let freqGroup=[previous];
    // let freqs=[];
    // let current=overFloorData[0];

    // for(var i=1;i<overFloorData.length;i++){
    //     if(Math.abs(overFloorData[i]-current)<20){
    //         if(overFloorData[i]>current){
    //             current=overFloorData[i];
    //         }
    //     }else{
    //         freqs.push(current);
    //         i++;
    //         if(i<overFloorData.length)current=overFloorData[i];
    //     }
    // }
    // if(freqs.length>0)console.log(freqs);
}


function getSurroundersOfFrequency(spectrum,frequency,floor){
    var surrounding=[];
}

function drawML5(){
    textAlign(CENTER,CENTER);
    fill(255);
    textSize(64);

    var indexNote=0;
    var diff=Math.abs(currentFrequency-notes[0].frequency);
    for(var i=1;i<notes.length;i++){
        var currentDiff=Math.abs(notes[i].frequency-currentFrequency);
        if(currentDiff<diff){
            indexNote=i;
        diff=currentDiff;
        }
        
    }
    

    text(currentFrequency.toFixed(2),width/2,height/2);
    text(notes[indexNote].name,width/2,height/2+75);

    var diff=currentFrequency-notes[indexNote].frequency;

    var amt=map(abs(diff),0,100,0,1);
    var r=color(255,0,0);
    var g=color(0,255,0);
    var col=lerpColor(g, r, amt);
    

    fill(col);
    rect(200,100,diff,50);
}