function fadeOut(audio) {
    if (!audio) return;
    const fadeOutDuration = 600; // Reduzindo o tempo de fade out para 400 milissegundos
    const fadeOutIntervalTime = 50;
    const fadeOutStep = audio.volume * (fadeOutIntervalTime / fadeOutDuration);

    const fadeOutInterval = setInterval(function() {
        if (audio.volume > fadeOutStep) {
            audio.volume -= fadeOutStep;
        } else {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 1.0;
            clearInterval(fadeOutInterval);
        }
    }, fadeOutIntervalTime);
}

const currentlyPlaying = new Map();

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', function() {
        playAudioForKey(this);
    });
});

document.addEventListener('keydown', function(e) {
    if (e.repeat) return;
    let key = getKeyFromEvent(e);

    const keyElement = document.querySelector(`.key[data-letter="${key}"]`);
    playAudioForKey(keyElement);
});

document.addEventListener('keyup', function(e) {
    let key = getKeyFromEvent(e);

    const keyElement = document.querySelector(`.key[data-letter="${key}"]`);
    if (keyElement) {
        keyElement.classList.remove('pressed');
    }
});

function getKeyFromEvent(e) {
    return e.shiftKey ? e.key.toUpperCase() : e.key.toLowerCase();
}

function playAudioForKey(keyElement) {
    if (keyElement) {
        const note = keyElement.getAttribute('data-key');

        // Parando áudio anterior se estiver tocando
        if (currentlyPlaying.has(note)) {
            const currentAudio = currentlyPlaying.get(note);
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Criando e tocando novo áudio
        const audio = new Audio(`./sounds/${note}.wav`);
        audio.play();
        setTimeout(() => fadeOut(audio), 600);
        keyElement.classList.add('pressed');
        currentlyPlaying.set(note, audio);
    }
}
