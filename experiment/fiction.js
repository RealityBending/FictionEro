// Parameters ======================================================
var fiction_trialnumber = 1

// instructions ====================================================
var fiction_instructions1 = {
    type: jsPsychHtmlButtonResponse,
    choices: [text_instructionsbutton_en],
    stimulus: text_instructions1_en,
    data: { screen: "fiction_instructions1" },
}

var fiction_instructions2 = {
    type: jsPsychHtmlButtonResponse,
    choices: [text_instructionsbutton_en],
    stimulus: text_instructions2_en,
    data: { screen: "fiction_instructions2" },
}

// Condition assignment ============================================

function assignCondition(stimuli_list) {
    new_stimuli_list = []
    // Loop through unique categories
    for (let cat of [...new Set(stimuli_list.map((a) => a.Category))]) {
        // Get all stimuli of this category
        var cat_stimuli = stimuli_list.filter((a) => a.Category == cat)

        // Shuffle cat_stimuli
        cat_stimuli = shuffleArray(cat_stimuli) // Defined in instructions.js

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
        choices: ["s"],
        trial_duration: isi,
        save_trial_parameters: { trial_duration: true },
        data: { screen: "fiction_fixationcross" },
    }
}

function fiction_cue(text_cue, duration = 1000) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            var cond = jsPsych.timelineVariable("Condition")
            return (
                "<div style='font-size:450%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%; color: " +
                color_cues[cond] +
                "'><b>" +
                text_cue[cond] +
                "</b></div>"
            )
        },
        data: function () {
            var cond = jsPsych.timelineVariable("Condition")
            return {
                screen: "fiction_cue",
                color: color_cues[cond],
                text: cond,
            }
        },
        choices: ["s"],
        trial_duration: duration,
    }
}

function fiction_showimage(duration = 2500) {
    return {
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
        trial_duration: duration,
        on_finish: function (data) {
            data.trial_number = fiction_trialnumber
            fiction_trialnumber += 1
            data.screen = "fiction_image"
        },
    }
}

var fiction_ratings = {
    type: jsPsychMultipleSlider,
    on_start: function () {
        document.body.style.cursor = "auto"
    },
    questions: [
        {
            prompt: text_rating_arousal_en,
            name: "Arousal",
            ticks: text_ticks_en,
            required: true,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        },
        {
            prompt: text_rating_appeal_en,
            name: "Enticement",
            ticks: text_ticks_en,
            required: true,
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
            screen: "fiction_ratings1",
            stimulus: jsPsych.timelineVariable("stimulus"),
            condition: jsPsych.timelineVariable("Condition"),
        }
    },
}

var fiction_trials = {
    // timeline_variables: stimuli_list.slice(0, 2),
    timeline_variables: stimuli_list,
    randomize_order: true,
    timeline: [
        fiction_fixationcross((isi = 750)),
        fiction_cue(text_cue_en, (duration = 1250)),
        fiction_fixationcross((isi = 500)),
        fiction_showimage((duration = 2500)),
        fiction_ratings,
    ],
}

// Part 2 ==========================================================
var instructions_questionnaires = {
    type: jsPsychHtmlButtonResponse,
    stimulus: text_instructions_questionnaires_en,
    choices: ["Continue"],
    data: { screen: "instructions_questionnaires" },
}

var fiction_ratings2 = {
    type: jsPsychMultipleSlider,
    on_start: function () {
        document.body.style.cursor = "auto"
    },
    questions: [
        {
            prompt: text_rating_realness_en,
            name: "Realness",
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
            screen: "fiction_ratings2",
            stimulus: jsPsych.timelineVariable("stimulus"),
            condition: jsPsych.timelineVariable("Condition"),
        }
    },
}

var fiction_trials_realness = {
    // timeline_variables: stimuli_list.slice(0, 2),
    timeline_variables: stimuli_list,
    randomize_order: true,
    timeline: [
        fiction_fixationcross((isi = 500)),
        fiction_showimage((duration = 1000)),
        fiction_ratings2,
    ],
}

// Debriefing
var fiction_debriefing = {
    type: jsPsychSurveyMultiSelect,
    preamble:
        "<h1>Thank you!</h1>" +
        "<p>Before we end, we wanted to know some of your thoughts on the experiment. Please tick all that apply:</p>",
    questions: [
        {
            prompt: " ",
            options: [
                "I had fun",
                "It was boring",
                "I could tell which images were photos and which were AI-generated",
                "I didn't see any difference between photos and AI-generated images",
                "I felt like the AI-generated images were more arousing than the photos",
                "I felt like the AI-generated images were less arousing than the photos",
                "I felt like the labels ('Photo' and 'AI-generated') were not always correct",
                "I felt like the labels were reversed (e.g., 'Photo' for AI-generated images and vice versa)",
                "Some pictures were really arousing",
                "I didn't really feel anything",
            ],
            name: "debriefing",
        },
    ],
    data: {
        screen: "fiction_debriefing",
    },
}
