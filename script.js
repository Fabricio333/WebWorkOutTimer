document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timeDisplay = document.getElementById('time');
    const progressBar = document.getElementById('progress-bar');
    const exerciseName = document.getElementById('exercise-name');
    const exerciseDescription = document.getElementById('exercise-description');
    const exerciseList = document.getElementById('exercise-list');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const beepSound = document.getElementById('beep');
    const endSound = document.getElementById('end-sound');

    // Workout routine
    const workoutRoutine = [
        { name: "Pull-ups", description: "Hang from a bar with arms extended, pull yourself up until your chin passes the bar.", duration: 60 },
        { name: "Push-ups", description: "Keep your body straight, lower yourself until your chest nearly touches the floor, then push back up.", duration: 60 },
        { name: "Squats", description: "Stand with feet shoulder-width apart, lower your hips until thighs are parallel to the floor, then stand back up.", duration: 60 },
        { name: "Rest", description: "Take a 30-second break.", duration: 30 },
        { name: "Hanging knee raises (abs)", description: "Hang from a bar, raise your knees toward your chest, then lower them slowly.", duration: 60 },
        { name: "Diamond push-ups", description: "Form a diamond shape with your hands, keep elbows close to your body as you lower and push up.", duration: 60 },
        { name: "Jump squats", description: "Perform a squat, then explode upward into a jump, land softly and repeat.", duration: 60 },
        { name: "Rest", description: "Take a 30-second break.", duration: 30 },
        { name: "Triceps dips", description: "Using a chair or bench, lower your body by bending elbows to 90 degrees, then push back up.", duration: 60 },
        { name: "Wide pull-ups", description: "Pull-ups with hands placed wider than shoulder-width.", duration: 60 },
        { name: "Push-up hold", description: "Hold the bottom position of a push-up (chest close to floor).", duration: 60 },
        { name: "Plank", description: "Hold a straight-arm plank position, keeping your core tight and body in a straight line.", duration: 60 }
    ];

    // Timer variables
    let currentExerciseIndex = 0;
    let timeLeft = workoutRoutine[0].duration;
    let timerInterval;
    let isRunning = false;
    let isPaused = false;

    // Initialize the app
    function init() {
        updateExerciseDisplay();
        renderExerciseList();
        updateTimerDisplay();
    }

    // Update the exercise name and description
    function updateExerciseDisplay() {
        const currentExercise = workoutRoutine[currentExerciseIndex];
        exerciseName.textContent = currentExercise.name;
        exerciseDescription.textContent = currentExercise.description;
        
        // Highlight current exercise in the list
        const listItems = exerciseList.querySelectorAll('li');
        listItems.forEach((item, index) => {
            item.classList.remove('current', 'next', 'future');
            if (index === currentExerciseIndex) {
                item.classList.add('current');
            } else if (index === currentExerciseIndex + 1) {
                item.classList.add('next');
            } else if (index > currentExerciseIndex + 1) {
                item.classList.add('future');
            }
        });
    }

    // Render the exercise list
    function renderExerciseList() {
        exerciseList.innerHTML = '';
        workoutRoutine.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.textContent = `${exercise.name} - ${formatTime(exercise.duration)}`;
            if (index === 0) {
                li.classList.add('current');
            } else if (index === 1) {
                li.classList.add('next');
            } else if (index > 1) {
                li.classList.add('future');
            }
            exerciseList.appendChild(li);
        });
    }

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update the timer display
    function updateTimerDisplay() {
        timeDisplay.textContent = formatTime(timeLeft);
        const currentExercise = workoutRoutine[currentExerciseIndex];
        const progress = (timeLeft / currentExercise.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Change progress bar color based on time
        if (progress < 20) {
            progressBar.style.backgroundColor = '#e74c3c'; // red
        } else if (progress < 50) {
            progressBar.style.backgroundColor = '#f39c12'; // orange
        } else {
            progressBar.style.backgroundColor = '#4CAF50'; // green
        }
    }

    // Start the timer
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            // Play beep sound when 5 seconds remain
            if (timeLeft === 5) {
                beepSound.play();
            }
            
            // When time is up
            if (timeLeft <= 0) {
                endSound.play();
                clearInterval(timerInterval);
                
                // Move to next exercise or end workout
                if (currentExerciseIndex < workoutRoutine.length - 1) {
                    currentExerciseIndex++;
                    timeLeft = workoutRoutine[currentExerciseIndex].duration;
                    updateExerciseDisplay();
                    updateTimerDisplay();
                    startTimer(); // Start next exercise automatically
                } else {
                    // Workout complete
                    exerciseName.textContent = "Workout Complete!";
                    exerciseDescription.textContent = "Great job! You've finished the workout.";
                    isRunning = false;
                    startBtn.disabled = true;
                    pauseBtn.disabled = true;
                }
            }
        }, 1000);
    }

    // Pause the timer
    function pauseTimer() {
        if (!isRunning || isPaused) return;
        
        clearInterval(timerInterval);
        isPaused = true;
        isRunning = false;
        pauseBtn.textContent = "Resume";
    }

    // Resume the timer
    function resumeTimer() {
        if (isRunning || !isPaused) return;
        
        isPaused = false;
        isRunning = true;
        pauseBtn.textContent = "Pause";
        startTimer();
    }

    // Reset the timer
    function resetTimer() {
        clearInterval(timerInterval);
        currentExerciseIndex = 0;
        timeLeft = workoutRoutine[0].duration;
        isRunning = false;
        isPaused = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = "Pause";
        updateExerciseDisplay();
        updateTimerDisplay();
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', function() {
        if (isPaused) {
            resumeTimer();
        } else {
            pauseTimer();
        }
    });
    resetBtn.addEventListener('click', resetTimer);

    // Initialize the app
    init();
});
