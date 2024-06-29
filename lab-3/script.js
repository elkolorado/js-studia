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


let isRecording = false;
let currentTrackRecording = null;
let timeline = [];
let barsAmount = 16;
let bpm = 120;


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
            let id = currentTrackRecording;
            recordSound(id, detectedSound, Date.now())
            let barsContainer = document.querySelector(`[data-track-id="${id}"] [data-sound="${detectedSound}"] .bars-container`)
            //change the contents to renderSound
            barsContainer.innerHTML = ""
            barsContainer.appendChild(renderSound(timeline.find(t => t.id == id).sounds[detectedSound]))
            //if clicked on canvas
            document.querySelector(`[data-track-id="${id}"] [data-sound="${detectedSound}"] .bars-container canvas`).addEventListener("click", () => {

                barsContainer.innerHTML = ""
                for (let i = 0; i < barsAmount; i++) {
                    barsContainer.appendChild(renderBar(i, detectedSound))
                }
                timeline.find(t => t.id == id).sounds[detectedSound] = []

            })
        }
    }
})

function recordSound(id = 0, sound, time) {
    let track = timeline.find(t => t.id == id)
    let timestamp = Date.now() - track.recordingStart;
    track.sounds[sound].push(timestamp);
    console.log("recorded sound", sound, "at", timestamp);
}

function playTrack(id = 0) {


    let track = timeline.find(t => t.id == id)

    if (track.interval) {
        clearInterval(track.interval)
        document.querySelectorAll('.bar').forEach(bar => {
            bar.classList.remove("playing")
        })
        document.querySelector(`[data-track-id="${id}"] .play`).textContent = "Play"
        track.interval = null
    } else {
        console.log("Now playing track ", id)

        Object.entries(track.sounds).forEach(s => {
            s[1].forEach(timestamp => playSound(s[0], timestamp))
        })
        document.querySelector(`[data-track-id="${id}"] .play`).textContent = "Stop"
        track.interval = trackShowTimeline(id)
    }
}

function trackShowTimeline(id = 0) {
    let i = 0;
    timeline.find(t => t.id == id).recordingStart = Date.now()
    let interval = setInterval(() => {    
        let bars = document.querySelectorAll(`[data-track-id="${id}"] [data-bar-id="${i}"]`)
        // remove active class from all bars
        document.querySelectorAll(`[data-track-id="${id}"] .bar`).forEach(bar => {
            bar.classList.remove("playing")
        })
        bars.forEach(bar => {
            bar.classList.add("playing")
        })

        //if track is playing, play sounds at the bars that are active
        let activeBars = document.querySelectorAll(`[data-bar-id="${i}"].active`)
        activeBars.forEach(bar => {
            let sound = bar.parentElement.parentElement.dataset.sound
            playSound(sound)
        })


        i++;
        if (i == barsAmount) {
            i = 0;
        }
    }, 60000 / bpm)

    return interval
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
    trackPlay.classList = "play"
    trackPlay.addEventListener("click", () => playTrack(id))

    trackRecord.textContent = "Record"
    trackRecord.classList = "recording"
    trackRecord.addEventListener("click", () => {

        let track = timeline.find(t => t.id == id)
        console.log("Now recording track ", id)
        if (track.interval) {
            clearInterval(track.interval)
            isRecording = false;

            document.querySelectorAll('.bar').forEach(bar => {
                bar.classList.remove("playing")
            })
            document.querySelector(`[data-track-id="${id}"] .recording`).textContent = "Record"
            track.interval = null
        } else {
            isRecording = true;
            currentTrackRecording = id;

            document.querySelector(`[data-track-id="${id}"] .recording`).textContent = "Stop"
            track.interval = trackShowTimeline(id)

            // end recording after barsAmount bars
            setTimeout(() => {
                isRecording = false;
                clearInterval(track.interval)
                document.querySelector(`[data-track-id="${id}"] .recording`).textContent = "Record"
                document.querySelectorAll('.bar').forEach(bar => {
                    bar.classList.remove("playing")
                })
                track.interval = null

                currentTrackRecording = null;
            }, 60000 / bpm * barsAmount)
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

    let bars = document.createElement("div")
    bars.classList.add("sounds")

    trackContainer.appendChild(trackId)
    trackContainer.appendChild(trackButtons)

    //render barsAmount bars for each of the sounds
    Object.entries(sounds).forEach(s => {
        let sound = s[0]
        let soundContainer = document.createElement("div")
        soundContainer.classList.add("bars")

        let soundName = document.createElement("div")
        let soundKeyBind = document.createElement("div")
        soundKeyBind.textContent = soundKeybinds[sound]
        soundKeyBind.classList.add("sound-keybind")
        soundContainer.appendChild(soundKeyBind)
        soundName.textContent = sound
        soundName.classList.add("sound-name")
        soundContainer.appendChild(soundName)

        soundContainer.dataset.sound = sound


        let barContainer = renderBars(sound)
        soundContainer.appendChild(barContainer)
        bars.appendChild(soundContainer)
    })

    trackContainer.appendChild(bars)
    trackContainer.appendChild(document.createElement("hr"))
    document.querySelector("#tracks").appendChild(trackContainer)
}


function renderBars(sound = "boom") {
    let barContainer = document.createElement("div")
    barContainer.classList.add("bars-container")

    for (let i = 0; i < barsAmount; i++) {
        barContainer.appendChild(renderBar(i, sound))
    }
    return barContainer
}

function renderBar(i, sound) {
    let bar = document.createElement("div")
    bar.classList.add("bar")
    bar.dataset.barId = i

    //click to add sound and timestamp
    bar.addEventListener("click", () => {
        playSound(sound)
        bar.classList.toggle("active")

    })
    return bar
}



function renderAddTrack() {
    let addTrackBtn = document.createElement("button")
    addTrackBtn.textContent = "Add track"
    addTrackBtn.addEventListener("click", () => addTrack())
    document.querySelector("#controls").appendChild(addTrackBtn)
}

function renderPlayAll() {
    let playAll = document.createElement("button")
    playAll.textContent = "Play"
    playAll.addEventListener("click", () => {
        let selectedTracks = timeline.filter(t => t.active)
        selectedTracks.forEach(t => {
            playTrack(t.id)
        })
    })

    document.querySelector("#controls").appendChild(playAll)

}

function renderSound(sounds) {
    let canvas = document.createElement("canvas")
    canvas.width = barsAmount * 10 + (barsAmount - 1) * 5
    canvas.height = 25
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "green"
    sounds.forEach((timestamp, i) => {
        const x = (timestamp / (barsAmount * 500)) * canvas.width;
        ctx.fillRect(x, 0, 10, 25);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, 0, 10, 25);
    })

    return canvas
}



renderAddTrack();
renderPlayAll();
addTrack();
addTrack();

