// Parameters ======================================================
var fiction_trialnumber = 1

// instructions ====================================================
var fiction_instructions1 = {
    type: jsPsychHtmlButtonResponse,
    choices: [text_instructionsbutton_en],
    stimulus: text_instructions1_en,
    data: { screen: "fiction_instructions" },
}

// Condition assignment ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function assignCondition(stimuli_list) {
    new_stimuli_list = []
    // Loop through unique categories
    for (let cat of [...new Set(stimuli_list.map((a) => a.Category))]) {
        // Get all stimuli of this category
        var cat_stimuli = stimuli_list.filter((a) => a.Category == cat)

        // Shuffle cat_stimuli
        cat_stimuli = shuffleArray(cat_stimuli)

        // Assign half to "Reality" condition and half to "Fiction" condition
        for (let i = 0; i < cat_stimuli.length; i++) {
            cat_stimuli[i].Condition =
                i < cat_stimuli.length / 2 ? "Reality" : "Fiction"
        }

        // Add to new_stimuli_list
        new_stimuli_list.push(...cat_stimuli)
    }
    return new_stimuli_list
}

stimuli_list = assignCondition(stimuli_list)

// Trials ==========================================================
var fiction_preloadstims = {
    type: jsPsychPreload,
    images: stimuli_list.map((a) => "stimuli/" + a.stimulus),
}

function fiction_fixationcross(isi = 500) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        on_start: function () {
            document.body.style.cursor = "none"
        },
        stimulus:
            "<div  style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
        choices: "NO_KEYS",
        trial_duration: isi,
        save_trial_parameters: { trial_duration: true },
        data: { screen: "fiction_fixationcross" },
    }
}

function fiction_prime(text_cue) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            var cond = jsPsych.timelineVariable("Condition")
            return (
                "<div style='font-size:400%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'><b>" +
                text_cue[cond] +
                "</b></div>"
            )
        },
        choices: "NO_KEYS",
        trial_duration: 1000,
        data: { screen: "fiction_prime" },
    }
}

var fiction_showimage = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.timelineVariable("stimulus")
    },
    stimulus_height: function () {
        if (jsPsych.timelineVariable("Orientation") == "h") {
            return null
        } else {
            return Math.round(
                jsPsych.data.get().last().values()[0]["screen_height"] * 0.9
            )
        }
    },
    stimulus_width: function () {
        if (jsPsych.timelineVariable("Orientation") == "v") {
            return null
        } else {
            return Math.round(
                jsPsych.data.get().last().values()[0]["screen_height"] * 0.9
            )
        }
    },
    choices: ["s"],
    trial_duration: 3000,
    on_finish: function (data) {
        data.trial_number = fiction_trialnumber
        fiction_trialnumber += 1
        data.screen = "fiction_image"
    },
}

var fiction_ratings = {
    type: jsPsychMultipleSlider,
    on_start: function () {
        document.body.style.cursor = "auto"
    },
    questions: [
        {
            prompt: text_rating_sexy_en,
            name: "Sexiness",
            ticks: text_ticks_en,
            required: false,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
        {
            prompt: text_rating_arousal_en,
            name: "Arousal",
            ticks: text_ticks_en,
            required: false,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
    ],
    randomize_question_order: false,
    require_movement: true,
    slider_width: 600,
    data: function () {
        return {
            screen: "fiction_ratings",
            stimulus: jsPsych.timelineVariable("stimulus"),
            condition: jsPsych.timelineVariable("Condition"),
        }
    },
}

var fiction_trials = {
    timeline_variables: stimuli_list.slice(0, 3),
    randomize_order: true,
    timeline: [
        fiction_fixationcross((isi = 1000)),
        fiction_prime(text_cue_en),
        fiction_fixationcross((isi = 500)),
        fiction_showimage,
        fiction_ratings,
    ],
}

// var fiction_trials_realness = {
//     timeline_variables: stimuli_list.slice(0, 3),
//     randomize_order: true,
//     timeline: [
//         fiction_fixationcross((isi = 1000)),
//         fiction_prime(text_cue_en),
//         fiction_fixationcross((isi = 500)),
//         fiction_showimage,
//         fiction_ratings,
//     ],
// }
