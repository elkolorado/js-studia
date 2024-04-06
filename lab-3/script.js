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

let isRecording = false;
let currentTrackRecording = null;
let timeline = [];
function playSound(sound, timeout = 0) {
    setTimeout(() => {
        const audio = sounds[sound]
        audio.currentTime = 0;
        audio.play();
        console.log('played sound at', sound, timeout)
    }, timeout)
}

document.addEventListener('keypress', event => {
    if (Object.entries(soundKeybinds).some(e => e[1] == event.key)) {
        let detectedSound = Object.keys(soundKeybinds).find(key => soundKeybinds[key] == event.key)

        playSound(detectedSound)

        if (isRecording) {
            recordSound(currentTrackRecording, detectedSound, performance.now())
        }
    }
})

function recordSound(id = 0, sound, time) {
    let track = timeline.find(t => t.id == id)
    track.sounds[sound].push(time)
}

function playTrack(id = 0) {
    let track = timeline.find(t => t.id == id)
    Object.entries(track.sounds).forEach(s => {
        s[1].forEach(timestamp => playSound(s[0], timestamp - track.recordingStart))
    })
    console.log("Now playing track ", id)

}

function addTrack() {
    timeline.push({
        id: timeline.at(-1)?.id + 1 || 0,
        recordingStart: 0,
        active: false,
        sounds: {
            ...Object.fromEntries(Object.entries(sounds).map(x => [x[0], []]))
        }
    })

    renderTrack(timeline.at(-1)?.id || 0)
}

function deleteTrack(id) {
    let track = timeline.find(t => t.id == id)
    if (track) {
        if (confirm("delete track?")) {
            let i = timeline.indexOf(track)
            timeline.splice(i, 1)
            document.querySelector(`[data-track-id="${id}"]`).remove();
        }

    }
}

function selectTrack(id) {
    let track = timeline.find(t => t.id == id)
    if (track) {
        track.active ? track.active = false : track.active = true
    }
}

function renderTrack(id = 0) {
    let trackContainer = document.createElement("div")
    let trackId = document.createElement("p")
    let trackRecord = document.createElement("button")
    let trackDelete = document.createElement("button")
    let trackButtons = document.createElement("div")
    let trackPlay = document.createElement("button");
    let trackSelected = document.createElement("input");
    trackContainer.dataset.trackId = id

    trackId.textContent = `Track ${id}`
    trackPlay.textContent = "Play"
    trackPlay.addEventListener("click", () => playTrack(id))

    trackRecord.textContent = "Record"
    trackRecord.addEventListener("click", () => {

        if (isRecording) {
            isRecording = false;
            trackRecord.textContent = "Record"
            currentTrackRecording = null;
        } else {
            timeline.find(t => t.id == id).recordingStart = performance.now()
            isRecording = true;
            currentTrackRecording = id;
            trackRecord.textContent = "Stop record"
        }

        console.log(isRecording, currentTrackRecording)
        console.table(timeline[0].sounds)
    })

    trackDelete.textContent = "Delete"
    trackDelete.addEventListener("click", () => deleteTrack(id))

    trackSelected.type = "checkbox"
    trackSelected.classList.add("track-select")
    trackSelected.addEventListener("click", () => selectTrack(id))

    trackButtons.appendChild(trackSelected)
    trackButtons.appendChild(trackPlay)
    trackButtons.appendChild(trackRecord)
    trackButtons.appendChild(trackDelete)

    trackContainer.appendChild(trackId)
    trackContainer.appendChild(trackButtons)

    document.querySelector("#tracks").appendChild(trackContainer)

}

function renderAddTrack() {
    let addTrackBtn = document.createElement("button")
    addTrackBtn.textContent = "Add track"
    addTrackBtn.addEventListener("click", () => addTrack())
    document.querySelector("#controls").appendChild(addTrackBtn)
}

function renderPlayAll() {
    // let playAll = document.createComment("button")
    // playAll.textContent = "Play"
    // playAll.addEventListener("click", () => {
    //     let selectedTracks = timeline.filter(t => t.active)
    //     selectedTracks.forEach(t => {
    //         playTrack(t.id)
    //     })
    // })

    document.querySelector("#controls").appendChild(playAll)

}


// renderPlayAll();
renderAddTrack();
addTrack();
addTrack();

console.log(timeline)


// let timeline = [newSoundsTimeline]
// console.log(soundsTimeline);