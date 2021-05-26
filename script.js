let videoElem = document.querySelector("video");
let captureImaBtn = document.querySelector(".click-image");
let filterColor = document.querySelectorAll(".filter>*");
//let audioElem = document.querySelector("audio");

//1.
let recordBtn = document.querySelector(".record");
let pauseBtn = document.querySelector(".pause");
let isRecording = false;
let isPaused = false;

//what we want have to do contraint of it
let constraint = {
    audio: true, video: true
}

//represent recordings
let recording = [];

let mediarecordingsObjectsForCurrStream;

//promise
let usermediaPromise = navigator
    .mediaDevices.getUserMedia(constraint);

usermediaPromise.then(function (stream) {
    //UI stream            
    videoElem.srcObject = stream;
    // audioElem.srcObject =   stream; not need video conatins both audio and video

    // to take video in buffers
    mediarecordingsObjectsForCurrStream = new MediaRecorder(stream);

    // when there is sufficent amt of data push it in recordings
    mediarecordingsObjectsForCurrStream.ondataavailable = function (e) {
        recording.push(e.data);
    }


    mediarecordingsObjectsForCurrStream.addEventListener("stop", function () {
        //mime type mdn chaeck
        const blob = new Blob(recording, { type: 'video/mp4' });
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.download = "file.mp4";
        a.href = url;
        a.click();
        recording = [];
    })

}).catch(function (err) {
    console.log(err);
    alert("Please allow prermission of camera and microphone");
})

recordBtn.addEventListener("click", function () {
    if (mediarecordingsObjectsForCurrStream == undefined) {
        alert("First select devices the devices");
        return;
    }

    if (isRecording == false) {
        mediarecordingsObjectsForCurrStream.start();
        recordBtn.innerText = "Recording....";
    } else {
        mediarecordingsObjectsForCurrStream.stop();
        recordBtn.innerText = "Record";
    }
    isRecording = !isRecording;
})

captureImaBtn.addEventListener("click",function(){
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");
    tool.drawImage(videoElem,0,0);
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.download = "file.png";
    a.href = url;
    a.click();
    a.remove();
})

for (let i = 0; i < filterColor.length; i++) {
    filterColor[i].addEventListener("click",function(){
        let color = filterColor[i].getAttribute("color");
        document.querySelector(".filter-screen").style.background = color;
    });
}
