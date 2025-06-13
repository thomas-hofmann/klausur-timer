let timer;
let startTime;
let targetTime;
let totalDuration;
let phase = 'countdownToStart'; // Track current phase
let display = 0;
let referenceTime; // Reference time for synchronization
let soundBool = false;

function startStopwatch() {
    const durationInput = document.getElementById('target-time').value;
    const startTimeInput = document.getElementById('start-time').value;
    const headingText = document.getElementById('exam-name').value;

    const now = new Date();

    if (document.getElementById('countdownOn').checked == true) {
        if (!durationInput || !startTimeInput || !headingText) {
            console.log('Ein Value fehlt.')
            return;
        } 
        document.getElementById('clock-start').innerText = startTimeInput;
    } else {
        if (!durationInput || !headingText) {
            console.log('Ein Value fehlt.')
            return;
        } 
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');

        let timeString = `${hours}:${minutes}:${seconds}`;
        document.getElementById('clock-start').innerText = timeString;
    }

    document.getElementById('accordion-button-settings').click();
    document.getElementById('exam-heading').innerText = headingText;

    let [startHours, startMinutes] = startTimeInput.split(':');
    
    if (document.getElementById('countdownOn').checked == true) {
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes);
    } else {
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    }

    if (document.getElementById('countdownOn').checked == true) {
        targetTime = new Date(startTime.getTime() + parseInt(durationInput, 10) * 60000); // Zielzeit basierend auf Dauer in Minuten berechnen
        let targetHours = String(targetTime.getHours()).padStart(2, '0');
        let targetMinutes = String(targetTime.getMinutes()).padStart(2, '0');
        document.getElementById('clock-finish').innerText = `${targetHours}:${targetMinutes}`;
    } else {
        targetTime = new Date(startTime.getTime() + parseInt(durationInput, 10) * 60000); // Zielzeit basierend auf Dauer in Minuten berechnen
        let targetHours = String(targetTime.getHours()).padStart(2, '0');
        let targetMinutes = String(targetTime.getMinutes()).padStart(2, '0');
        let targetSeconds = String(targetTime.getSeconds()).padStart(2, '0');
        document.getElementById('clock-finish').innerText = `${targetHours}:${targetMinutes}:${targetSeconds}`;
    }

    document.getElementById('timer-is-runing').style.display = 'block';
    document.getElementById('timer-is-runing-not').style.display = 'none';
    document.getElementById('progress').style.width = '100%';
    document.getElementById('progress').style.backgroundColor = '#198754';
    document.getElementById('stop-watch-container--done').style.display = 'none';

    phase = 'countdownToStart';
    referenceTime = new Date();
    
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    timer = setInterval(updateStopwatch, 1000);

    document.getElementById('start-time').value = '';
    document.getElementById('reset').disabled = false;
    document.getElementById('start').disabled = true;
}

function resetStopwatch() {
    clearInterval(timer);
    document.getElementById('timer-is-runing').style.display = 'none';
    document.getElementById('timer-is-runing-not').style.display = 'block';
    document.getElementById('progress-bar').style.display = 'none';
    document.getElementById('stopwatch').textContent = "0";
    document.getElementById('start-time').value = '';
    document.getElementById('progress').style.width = '0%';
    document.getElementById('stop-watch-container--done').style.display = 'none';
    document.getElementById('intro-text').style.display = 'none';
    document.getElementById('minutes').innerText = 'Min.';
    document.getElementById('clock-start').innerText = '-:-';
    document.getElementById('clock-finish').innerText = '-:-';
    document.getElementById('reset').disabled = true;

    if (document.getElementById('countdownOn').checked == false) {
        document.getElementById('start').disabled = false;
    } else {
        document.getElementById('start').disabled = true;
    }
    
    document.getElementById('soundLabel').setAttribute('data-soundtoggle', 'off');
    document.getElementById('soundOnIcon').style.display = 'none';
    document.getElementById('soundOffIcon').style.display = 'inline-block';
    document.getElementById('soundCheckbox').checked = false;
    soundBool = false;
}

function updateStopwatch() {
    const now = new Date();
    let remainingTime;

    if (phase === 'countdownToStart') {
        remainingTime = startTime - now;
        document.getElementById('intro-text').style.display = 'block';
        if (remainingTime <= 0) {
            phase = 'countdownToTarget';
            document.getElementById('intro-text').style.display = 'none';
            document.getElementById('progress-bar').style.display = 'block';
            totalDuration = (targetTime - startTime) / 1000;
            document.getElementById('stopwatch').textContent = "0";
            document.getElementById('progress').style.width = '100%';
            document.getElementById('progress').style.backgroundColor = '#198754';
            referenceTime = now; // Reset reference time for the next phase
            return; // Skip the rest until the next interval
        }
    } else if (phase === 'countdownToTarget') {
        remainingTime = targetTime - now;

        if (remainingTime <= 0) {
            document.getElementById('stopwatch').textContent = "0";
            document.getElementById('progress').style.width = '0%';
            document.getElementById('progress-bar').style.display = 'none';
            document.getElementById('stop-watch-container--done').style.display = 'block';

            if (soundBool == true) {
                document.getElementById('sound').play();
                clearInterval(timer);
            }
            console.log('Fertig!');
            
            return;
        }
    }

    const remainingSeconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    if (minutes === 0) {
        display = seconds + 1;
        document.getElementById('minutes').innerText = phase === 'countdownToStart' ? 'Sek.' : 'Sek.';
    } else {
        display = minutes + 1;
        document.getElementById('minutes').innerText = 'Min.';
    }

    document.getElementById('stopwatch').textContent = display;

    const elapsed = phase === 'countdownToStart' ? (startTime - now) / 1000 : (totalDuration - remainingSeconds);
    const progressPercentage = (elapsed / totalDuration) * 100;

    if (progressPercentage <= 50) {
        document.getElementById('progress').style.backgroundColor = '#198754';
    } else if (progressPercentage <= 80) {
        document.getElementById('progress').style.backgroundColor = '#ffc107';
    } else {
        document.getElementById('progress').style.backgroundColor = '#dc3545';
    }

    document.getElementById('progress').style.width = `${100 - progressPercentage}%`;
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    const currentTimeWithSeconds = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = currentTime;
    document.getElementById('clock-with-seconds').textContent = currentTimeWithSeconds;
}

function checkValues() {
    var startTimeValue = document.getElementById('start-time').value.trim();
    var targetTimeValue = document.getElementById('target-time').value.trim();
    var examName = document.getElementById('exam-name').value.trim();

    if (startTimeValue && Number(targetTimeValue) > 0 && examName) {
        document.getElementById('start').disabled = false;
    } else if(Number(targetTimeValue) > 0 && examName && document.getElementById('countdownOn').checked == false) {
        document.getElementById('start').disabled = false;
    } else {
        document.getElementById('start').disabled = true;
    }
}

function checkBegin() {
    if (document.getElementById('countdownOn').checked == true) {
        document.getElementById('start-time').disabled = false;
        document.getElementById('start-time').classList.remove('bg-danger-subtle');
    } else {
        document.getElementById('start-time').disabled = true;
        document.getElementById('start-time').classList.add('bg-danger-subtle');
    }
    checkValues();
}

function soundToggle() {
    if (document.getElementById('soundLabel').getAttribute('data-soundtoggle') === 'on') {
        document.getElementById('soundLabel').setAttribute('data-soundtoggle', 'off');
        document.getElementById('soundOnIcon').style.display = 'none';
        document.getElementById('soundOffIcon').style.display = 'inline-block';
        document.getElementById('sound').pause();
        soundBool = false;
    } else if (document.getElementById('soundLabel').getAttribute('data-soundtoggle') === 'off') {
        document.getElementById('soundLabel').setAttribute('data-soundtoggle', 'on');
        document.getElementById('soundOnIcon').style.display = 'inline-block';
        document.getElementById('soundOffIcon').style.display = 'none';
        document.getElementById('sound').play();
        soundBool = true;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateClock();

    document.getElementById('start-time').addEventListener('input', checkValues);
    document.getElementById('target-time').addEventListener('input', checkValues);
    document.getElementById('exam-name').addEventListener('input', checkValues);
    document.getElementById('countdownOn').addEventListener('click', checkBegin);
    document.getElementById('countdownOff').addEventListener('click', checkBegin);
    document.getElementById('soundLabel').addEventListener('click', soundToggle);
    
    setInterval(updateClock, 1000);
});
