let timer;
let startTime;
let targetTime;
let totalDuration;
let phase = 'countdownToStart'; // Track current phase
let display = 0;
let soundBool = false;
let timerRunning = false;
let defaultSubtitleText = '';

function handleConfigInputChange(event) {
    if (timerRunning && event && event.target && event.target.id === 'target-time') {
        const note = document.getElementById('duration-note');
        if (note) note.classList.remove('d-none');
    }
    if (timerRunning && event && event.target && event.target.id === 'start-time') {
        const note = document.getElementById('start-time-note');
        if (note) {
            note.classList.remove('d-none');
        }
    }
    checkValues();
}

function syncSubtitleVisibility() {
    const headingText = document.getElementById('exam-name').value.trim();
    const extraText = document.getElementById('exam-extra').value.trim();
    const subtitle = document.getElementById('exam-heading-subtitle');

    if (headingText || extraText) {
        subtitle.style.display = 'none';
    } else {
        subtitle.innerText = defaultSubtitleText;
        subtitle.style.display = 'block';
    }
}

function syncHeadingFromInput() {
    const headingText = document.getElementById('exam-name').value.trim();
    if (headingText) {
        document.getElementById('exam-heading').innerText = headingText;
    } else {
        document.getElementById('exam-heading').innerText = "Klausurtimer";
    }
    syncSubtitleVisibility();
}

function syncExtraTextFromInput() {
    const extraText = document.getElementById('exam-extra').value.trim();
    if (extraText) {
        document.getElementById('exam-extra-text').innerText = extraText;
        document.getElementById('exam-extra-container').classList.remove('d-none');
    } else {
        document.getElementById('exam-extra-text').innerText = '';
        document.getElementById('exam-extra-container').classList.add('d-none');
    }
    syncSubtitleVisibility();
}

function startStopwatch() {
    const note = document.getElementById('start-time-note');
    if (note) note.classList.add('d-none');
    const durationNote = document.getElementById('duration-note');
    if (durationNote) durationNote.classList.add('d-none');

    const durationInput = document.getElementById('target-time').value;
    const startTimeInput = document.getElementById('start-time').value;

    const now = new Date();

    if (document.getElementById('countdownOn').checked == true) {
        if (!durationInput || !startTimeInput) {
            console.log('Ein Value fehlt.')
            return;
        } 
        document.getElementById('clock-start').innerText = startTimeInput;
    } else {
        if (!durationInput) {
            console.log('Ein Value fehlt.')
            return;
        } 
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');

        let timeString = `${hours}:${minutes}:${seconds}`;
        document.getElementById('clock-start').innerText = timeString;
    }

    timerRunning = true;

    document.getElementById('accordion-button-settings').click();
    syncHeadingFromInput();
    syncExtraTextFromInput();
    if (document.getElementById('countdownOn').checked == true) {
        let [startHours, startMinutes] = startTimeInput.split(':');
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

    totalDuration = (targetTime - startTime) / 1000;
    if (document.getElementById('countdownOn').checked == true && startTime > now) {
        phase = 'countdownToStart';
        document.getElementById('intro-text').style.display = 'block';
        document.getElementById('progress-bar').style.display = 'none';
        document.getElementById('progress').style.width = '100%';
    } else {
        phase = 'countdownToTarget';
        document.getElementById('intro-text').style.display = 'none';
        document.getElementById('progress-bar').style.display = 'block';
    }
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    updateStopwatch();
    timer = setInterval(updateStopwatch, 1000);

    if (document.getElementById('countdownOn').checked == false) {
        document.getElementById('start-time').value = '';
    }
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
    document.getElementById('target-time').value = '';
    document.getElementById('exam-name').value = '';
    document.getElementById('exam-extra').value = '';
    document.getElementById('progress').style.width = '0%';
    document.getElementById('stop-watch-container--done').style.display = 'none';
    document.getElementById('intro-text').style.display = 'none';
    document.getElementById('minutes').innerText = 'Min.';
    document.getElementById('clock-start').innerText = '-:-';
    document.getElementById('clock-finish').innerText = '-:-';
    document.getElementById('reset').disabled = true;
    syncHeadingFromInput();
    syncExtraTextFromInput();
    timerRunning = false;

    document.getElementById('start').disabled = true;
    const note = document.getElementById('start-time-note');
    if (note) note.classList.add('d-none');
    const durationNote = document.getElementById('duration-note');
    if (durationNote) durationNote.classList.add('d-none');
    
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
        document.getElementById('progress-bar').style.display = 'none';
        document.getElementById('progress').style.width = '100%';
        if (remainingTime <= 0) {
            phase = 'countdownToTarget';
            document.getElementById('intro-text').style.display = 'none';
            document.getElementById('progress-bar').style.display = 'block';
            totalDuration = (targetTime - startTime) / 1000;
            document.getElementById('stopwatch').textContent = "0";
            document.getElementById('progress').style.width = '100%';
            document.getElementById('progress').style.backgroundColor = '#198754';
            return; // Skip the rest until the next interval
        }
    } else if (phase === 'countdownToTarget') {
        remainingTime = targetTime - now;

        if (remainingTime <= 0) {
            document.getElementById('stopwatch').textContent = "0";
            document.getElementById('progress').style.width = '0%';
            document.getElementById('progress-bar').style.display = 'none';
            document.getElementById('stop-watch-container--done').style.display = 'flex';
            document.getElementById('timer-is-runing').style.display = 'none';
            document.getElementById('timer-is-runing-not').style.display = 'block';
            timerRunning = false;

            if (soundBool == true) {
                document.getElementById('sound').play();
            }
            clearInterval(timer);
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
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const currentDate = `${day}.${month}.${year}`;
    const currentTime = `${currentDate} - ${hours}:${minutes}`;
    const currentTimeWithSeconds = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock-with-seconds').textContent = currentTimeWithSeconds;
    document.getElementById('clock-header').textContent = currentTime;
}

function checkValues() {
    var startTimeValue = document.getElementById('start-time').value.trim();
    var targetTimeValue = document.getElementById('target-time').value.trim();
    // var examName = document.getElementById('exam-name').value.trim();

    if (startTimeValue && Number(targetTimeValue) > 0) {
        document.getElementById('start').disabled = false;
    } else if(Number(targetTimeValue) > 0 && document.getElementById('countdownOn').checked == false) {
        document.getElementById('start').disabled = false;
    } else {
        document.getElementById('start').disabled = true;
    }
}

function checkBegin() {
    const durationNote = document.getElementById('duration-note');
    if (durationNote) durationNote.classList.add('d-none');
    // Soft reset on mode change: stop timer UI but keep inputs
    if (timerRunning) {
        const confirmed = window.confirm('Timer läuft. Moduswechsel stoppt den Timer. Fortfahren?');
        if (!confirmed) {
            // revert toggle selection
            if (document.getElementById('countdownOn').checked) {
                document.getElementById('countdownOff').checked = true;
            } else {
                document.getElementById('countdownOn').checked = true;
            }
            checkValues();
            return;
        }
        clearInterval(timer);
        timer = null;
        timerRunning = false;
        document.getElementById('timer-is-runing').style.display = 'none';
        document.getElementById('timer-is-runing-not').style.display = 'block';
        document.getElementById('progress-bar').style.display = 'none';
        document.getElementById('stop-watch-container--done').style.display = 'none';
        document.getElementById('intro-text').style.display = 'none';
        document.getElementById('progress').style.width = '0%';
        document.getElementById('stopwatch').textContent = "0";
        document.getElementById('minutes').innerText = 'Min.';
    }

    if (document.getElementById('countdownOn').checked == true) {
        document.getElementById('start-time').disabled = false;
        document.getElementById('start-time').classList.remove('bg-danger-subtle');
        document.getElementById('start-time').classList.remove('d-none');
    } else {
        document.getElementById('start-time').disabled = true;
        document.getElementById('start-time').classList.add('bg-danger-subtle');
        document.getElementById('start-time').classList.add('d-none');
        const note = document.getElementById('start-time-note');
        if (note) note.classList.add('d-none');
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

function handleDarkModeToggle() {
    if (this.checked) {
        document.body.classList.remove('bg-body-tertiary');
        document.body.classList.remove('light-mode');
        document.body.classList.add('bg-dark');
        document.body.classList.add('bg-gradient');
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'on');
    } else {
        document.body.classList.remove('bg-dark');
        document.body.classList.remove('bg-gradient');
        document.body.classList.remove('dark-mode');
        document.body.classList.add('bg-body-tertiary');
        document.body.classList.add('light-mode');
        localStorage.setItem('darkMode', 'off');
    }
}

function initDarkMode() {
    const darkModeSetting = localStorage.getItem('darkMode');
    const toggle = document.getElementById('darkModeToggle');

    if (darkModeSetting === 'on') {
        document.body.classList.add('bg-dark');
        document.body.classList.add('bg-gradient');
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    } else {
        document.body.classList.add('bg-body-tertiary');
        document.body.classList.add('light-mode');
        toggle.checked = false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    defaultSubtitleText = document.getElementById('exam-heading-subtitle').innerText;

    document.getElementById('start-time').addEventListener('input', handleConfigInputChange);
    document.getElementById('target-time').addEventListener('input', handleConfigInputChange);
    document.getElementById('exam-name').addEventListener('input', syncHeadingFromInput);
    document.getElementById('exam-extra').addEventListener('input', syncExtraTextFromInput);
    // document.getElementById('exam-name').addEventListener('input', checkValues);
    document.getElementById('countdownOn').addEventListener('click', checkBegin);
    document.getElementById('countdownOff').addEventListener('click', checkBegin);
    document.getElementById('soundLabel').addEventListener('click', soundToggle);

    // Dark Mode Toggle
    const toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('change', handleDarkModeToggle);

    // Dark Mode Zustand beim Laden wiederherstellen
    initDarkMode();
    syncHeadingFromInput();
    syncExtraTextFromInput();
    
    setInterval(updateClock, 1000);
});

window.addEventListener('beforeunload', function (e) {
    // Warnung nur wenn der Timer aktiv ist
    if (timerRunning) {
        e.preventDefault();
        e.returnValue = ''; // wichtig für die Anzeige des Warn-Dialogs
    }
});
