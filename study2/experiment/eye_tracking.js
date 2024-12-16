var eyetracking_consent = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h2>Eye movements</h2>" +
        "<p>As the next phase of the experiment involves the presentation of visual stimuli, we are interested in what parts of the image people look at, and we would like to use your webcam to record your gaze.</p>" +
        "<p><b style='color: red'>Important: The experiment does <i>not</i> record your face or any images from the camera.</b> It only extracts the estimated gaze pattern on the screen. <b>Your participation remains completely anonymous</b>.</p>" +
        "<img src='media/eyetracker.gif' height='300' align='center'></img>" +
        "<p>After you pressed <b>'I agree'</b>, a pop-up will appear asking you to enable your webcam. It may take a couple of seconds for the camera to initialize.</p>",
    choices: ["I agree", "I don't have a webcam"],
    data: {
        screen: "eyetracking_consent",
    },
}

// Calibration ====================================================================
const calibration_points = [
    [20, 20],
    [50, 20],
    [80, 20],
    [20, 50],
    [50, 50],
    [50, 50],
    [80, 50],
    [20, 80],
    [50, 80],
    [80, 80],
]

var eyetracking_webcam = {
    type: jsPsychWebgazerInitCamera,
    instructions:
        "<h2>Setup</h2>" +
        "<p style='text-align: left;'><b>1.</b> Make sure you are in a well-lit room, that your face is well lit, and clean your glasses if need be.</p>" +
        "<p style='text-align: left;'><b>2.</b> Center your face in the box.</p>" +
        "<p style='text-align: left;'><b>3.</b> Make sure you are seated comfortably, as it is important that you keep this head position throughout the experiment.</p>" +
        "<p style='text-align: left;'><b>4.</b> When your face is centered in the box and the box is green, you can click to continue.</p>",
}

var eyetracking_calibration_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h2>Gaze Calibration (1/2)</h2>" +
        "<p>You will now see a series of <b>black dots</b> appear on the screen. Look at each dot and <b>click on it</b> without moving your head too much.</p>",
    choices: ["Ready"],
    data: {
        screen: "eyetracking_calibration_instructions",
    },
}

var eyetracking_calibration_run = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: calibration_points,
    repetitions_per_point: 1,
    randomize_calibration_order: true,
    data: {
        screen: "eyetracking_calibration_run",
    },
}

var eyetracking_validation_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h2>Gaze Calibration (2/2)</h2>" +
        "<p>Again, look at each dot as it appears on the screen, but <b>do not click on them this time</b>. Don't forget to keep your head still.</p>",
    choices: ["Ready"],
    post_trial_gap: 1000,
    data: {
        screen: "eyetracking_validation_instructions",
    },
}

var eyetracking_validation_run = {
    type: jsPsychWebgazerValidate,
    validation_points: calibration_points,
    roi_radius: function () {
        return Math.round(0.03 * window.innerWidth)
    },
    time_to_saccade: 1000,
    validation_duration: 2000,
    show_validation_data: true,
    data: {
        screen: "eyetracking_validation_run",
    },
}

var calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h2>Done!</h2>" +
        "<p>Please try to remain steady for the next phase :)</p>",
    choices: ["Understood"],
}

// Recalibration ====================================================================
var eyetracking_recalibrate_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h2>Gaze Calibration (1/2)</h2>" +
        "<p>The calibration accuracy is a little lower than we'd like.</p>" +
        "<p>Let's try calibrating one more time.</p>" +
        "<p>On the next screen, look at the dots and <b>click on them</b>.<p>",
    choices: ["Ready"],
}

// Timeline
var eyetracking_recalibrate_process = {
    timeline: [
        eyetracking_recalibrate_instructions,
        eyetracking_calibration_run,
        eyetracking_validation_instructions,
        eyetracking_validation_run,
    ],
    conditional_function: function () {
        var validation_data = jsPsych.data
            .get()
            .filter({ screen: "eyetracking_validation_run" })
            .values()[0]
        return validation_data.percent_in_roi.some(function (x) {
            var minimum_percent_acceptable = 50
            return x < minimum_percent_acceptable
        })
    },
    data: {
        phase: "recalibration",
    },
}

// Timeline ====================================================================

// Timeline ---------------------------------------------------------------------
var eyetracking_calibration = {
    timeline: [
        eyetracking_webcam,
        eyetracking_calibration_instructions,
        eyetracking_calibration_run,
        eyetracking_validation_instructions,
        eyetracking_validation_run,
        eyetracking_recalibrate_process,
        calibration_done,
    ],
    conditional_function: function () {
        var consent = jsPsych.data
            .get()
            .filter({ screen: "eyetracking_consent" })["trials"][0]
        if (consent["response"] == 0) {
            return true
        } else {
            return false
        }
    },
}

var eyetracking_recalibration = {
    timeline: [
        eyetracking_calibration_instructions,
        eyetracking_calibration_run,
        eyetracking_validation_instructions,
        eyetracking_validation_run,
        calibration_done,
    ],
    conditional_function: function () {
        var consent = jsPsych.data
            .get()
            .filter({ screen: "eyetracking_consent" })["trials"][0]
        if (consent["response"] == 0) {
            return true
        } else {
            return false
        }
    },
}
