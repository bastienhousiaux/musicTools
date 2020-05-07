var model_url='./crepe';

var audioContext;
var mic;
var audio;
var currentFrequency=0;
var fft;


var RATIO_FFT_TO_FREQUENCY=44100/2048;
var noiseMapping=[];

var noiseCaptureTiming=0;
var TOTAL_NOISE_CAPTURE=500;
var lastResults=[];
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




function setup(){
    createCanvas(1024,400);
    audioContext=getAudioContext();
    initializeMic();
    initializeFFT();
}








function draw(){
    background(0);

    var overFloorData=[];
    // drawML5();
    
    
    var spectrum=fft.analyze();
    stroke(255);

    if(noiseCaptureTiming<TOTAL_NOISE_CAPTURE){
        for(var i=0;i<spectrum.length;i++){
            if(noiseCaptureTiming==0)this.noiseMapping[i]=0;
            // if(spectrum[i]>this.noiseMapping[i])this.noiseMapping[i]=spectrum[i];
            this.noiseMapping[i]+=spectrum[i];
            if(noiseCaptureTiming==TOTAL_NOISE_CAPTURE-1)this.noiseMapping[i]/=TOTAL_NOISE_CAPTURE;
        }
        noiseCaptureTiming++;
    }else{

        var maxAmpIndex=-1;
        var maxAmp=-1;
        var avg=0;
        for(var i=0;i<spectrum.length;i++){
            var amp=spectrum[i]-this.noiseMapping[i];
            if(amp>maxAmp){
                maxAmp=amp;
                maxAmpIndex=i;
            }
            var y = map(amp,0,255,height,0);
            line(i,height,i,y);
        }

        stroke(255,0,0);
        for(var i=0;i<400;i+=50){
            line(0,i,1024,i);
        }

        var NB_SURROUNDING_SAMPLES=2;
        var avgCount=0;
        var totalVolume=0;

        for(var i=
            (maxAmpIndex>NB_SURROUNDING_SAMPLES)?
                maxAmpIndex-NB_SURROUNDING_SAMPLES:0;
                i<=maxAmpIndex+NB_SURROUNDING_SAMPLES;i++){
                            var spectrumRectified=spectrum[i]-this.noiseMapping[i];
                            if(spectrumRectified>0){
                                avg+=i*spectrumRectified;
                                totalVolume+=spectrumRectified;
                                avgCount++;
                            }
                        
                }
                    
                

        avg/=totalVolume;

        var finalAmp=maxAmpIndex;

        textAlign(CENTER,CENTER);
        fill(255);
        textSize(64);
        var finalFreq=avg*RATIO_FFT_TO_FREQUENCY;

        lastResults.push(finalFreq);

        if(lastResults.length>100){
            lastResults.shift();
        }

        var finalAvg=0;
        for(var i=0;i<lastResults.length;i++){
            finalAvg+=lastResults[i];
        }

        finalAvg/=lastResults.length;
        text("frequence estimée : " +Math.round(finalAvg),width/2,height/2);
    }
}