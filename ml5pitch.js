var pitchDetector;

var fftFreq=0;
var fftVal=0;
function createML5PitchDetection(){
    pitchDetector=ml5.pitchDetection(
        model_url,
        audioContext,
        mic.stream,
        modelLoaded
    );
}
function listening(){
    console.log("listening");
    createML5PitchDetection();
}
function gotPitch(error,frequency){
    if(error)console.error(error);
    else{
        
        if(frequency){
            currentFrequency=frequency;
            
        }
        pitchDetector.getPitch(gotPitch);
    }
}
function modelLoaded(){
    console.log("the model has been loaded");  
    pitchDetector.getPitch(gotPitch);
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