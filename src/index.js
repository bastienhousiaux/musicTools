let model_url='https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/tree/master/models/pitch-detection/crepe/';
let pitchDetector;
let audioContext;
let mic;
function setup(){
    console.log("setup");
    createCanvas(400,400);
    // audioContext=getAudioContext();
    // mic=new p5.AudioIn();
    // mic.start(listening);
    // pitchDetector=ml5.pitchDetection(
    //     model_url,
    //     audioContext,
    //     mic.stream,
    //     modelLoaded
    // )
}

function gotPitch(){
    
}

function listening(){
    console.log("listening");
}

function modelLoaded(){
    console.log("the model has been loaded");
}

pitchDetector.getPitch(gotPitch);

function draw(){
    background(220);
}