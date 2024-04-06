const sounds = {
    "boom": new Audio("./sounds/boom.wav"),
    "clap": new Audio("./sounds/clap.wav"),
    "hihat": new Audio("./sounds/hihat.wav"),
    "kick": new Audio("./sounds/kick.wav"),
    "openhat": new Audio("./sounds/openhat.wav"),
    "ride": new Audio("./sounds/ride.wav"),
    "snare": new Audio("./sounds/snare.wav"),
    "tink": new Audio("./sounds/tink.wav"),
    "tom": new Audio("./sounds/tom.wav")
}

const soundKeybinds = {
    "boom": "b",
    "clap": "c",
    "hihat": "h",
    "kick": "k",
    "openhat": "o",
    "ride": "r",
    "snare": "s",
    "tink": "t",
    "tom": "m"
}



// function newSoundsTimeline(id = 0) {
//     return {
//         track: {
//             id: id,
//             ...Object.fromEntries(Object.entries(sounds).map(x => [x[0], []]))
//         }
//     }
// }

let isRecording = true;
let timeline = [{
    id: 0,
    recordingStart: 0,
    sounds: {
    ...Object.fromEntries(Object.entries(sounds).map(x => [x[0], []]))
    }
}]
function playSound(sound, timeout = 0){
    setTimeout(() => {
        const audio = sounds[sound]
        audio.currentTime = 0;
        audio.play();
    }, timeout)
}

document.addEventListener('keypress', event => {
    if(Object.entries(soundKeybinds).some(e => e[1] == event.key)){
        let detectedSound = Object.keys(soundKeybinds).find(key => soundKeybinds[key] == event.key)

        playSound(detectedSound)
        
        if(isRecording){
            recordSound(0, detectedSound, performance.now())
        }
    }
})

function recordSound(id = 0, sound, time){
    let track = timeline.find(t => t.id == id)
    track.sounds[sound].push(time)
    track.recordingStart = performance.now()
}

function playTrack(id = 0){
    let track = timeline.find(t => t.id == id)
    Object.entries(track.sounds).forEach(s => {
        s[1].forEach(timestamp => playSound(s[0], timestamp))
    })
}

function renderTrack(id = 0){
}


// let timeline = [newSoundsTimeline]
// console.log(soundsTimeline);