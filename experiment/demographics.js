// Full screen
var fullscreen_on = {
    type: jsPsychFullscreen,
    message: fullscreen_text,
    button_label: fullscreen_button,
    fullscreen_mode: true,
    delay_after: 0,
}

var fullscreen_off = {
    type: jsPsychFullscreen,
    message: fullscreen_text,
    button_label: fullscreen_button,
    fullscreen_mode: false,
}

// Retrieve and save browser info ========================================================
var demographics_browser_info = {
    type: jsPsychBrowserCheck,
    data: {
        screen: "browser_info",
        date: new Date().toLocaleDateString("fr-FR"),
        time: new Date().toLocaleTimeString("fr-FR"),
    },
    on_finish: function (data) {
        dat = jsPsych.data.get().filter({ screen: "browser_info" }).values()[0]

        // Rename
        data["screen_height"] = dat["height"]
        data["screen_width"] = dat["width"]

        // Add URL variables - ?sona_id=x&exp=1
        let urlvars = jsPsych.data.urlVariables()
        data["researcher"] = urlvars["exp"]
        data["language"] = urlvars["lang"]
        data["sona_id"] = urlvars["sona_id"]
        data["prolific_id"] = urlvars["PROLIFIC_PID"] // Prolific
        data["study_id"] = urlvars["STUDY_ID"] // Prolific
        data["session_id"] = urlvars["SESSION_ID"] // Prolific
    },
}

// Participant ID ========================================================================
var demographics_participant_id = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: "Enter participant ID:",
            placeholder: "001",
            name: "Participant_ID",
        },
    ],
    data: {
        screen: "participant_id",
    },
    on_finish: function () {
        // Store `participant_id` so that it can be reused later
        jsPsych.data.addProperties({
            participant_id: jsPsych.data.get().last().values()[0]["response"][
                "Participant_ID"
            ],
        })
    },
}

// Consent form ========================================================================
var demographics_consent = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus: consent_text,
    choices: [consent_button],
    data: { screen: "consent" },
}

// Thank you ========================================================================
var demographics_debriefing = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus: text_debriefing,
    choices: [button_continue],
    data: { screen: "debriefing" },
}

var demographics_endscreen = function (
    link = "https://realitybending.github.io/FictionEro/experiment/english.html"
) {
    return {
        type: jsPsychHtmlButtonResponse,
        css_classes: ["narrow-text"],
        stimulus: text_endscreen(link),
        choices: [button_end],
        data: { screen: "endscreen" },
    }
}

// Demographic info ========================================================================
var demographics_multichoice = {
    type: jsPsychSurveyMultiChoice,
    preamble: demographics1_preamble,
    questions: [
        {
            prompt: demographics_q_sex,
            options: demographics_c_sex,
            name: "Sex",
            required: true,
        },
        // {
        //     prompt: "Are you currently a student?",
        //     options: ["Yes", "No"],
        //     name: "student",
        // },
        {
            prompt: demographics_q_edu,
            options: demographics_c_edu,
            name: "Education",
            required: true,
        },
        // {
        //     prompt: "English level",
        //     options: ["native", "fluent", "intermediate", "beginner"],
        //     name: "english",
        // },
    ],
    data: {
        screen: "demographics_1",
    },
}

var demographics_freetext = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: demographics_q_age,
            placeholder: demographics_p_age,
            name: "Age",
            required: true,
        },
        {
            prompt: demographics_q_eth,
            placeholder: demographics_p_eth,
            name: "Ethnicity",
            required: false,
        },
        {
            prompt: demographics_q_cou,
            placeholder: demographics_p_cou,
            name: "Country",
            required: false,
        },
    ],
    data: {
        screen: "demographics_2",
    },
}

var demographics_other = {
    type: jsPsychSurveyLikert,
    autocomplete: true,
    questions: [
        {
            prompt: demographics_q_lang,
            name: "Language_Level",
            required: true,
            labels: demographics_c_lang,
        },
        {
            prompt: demographics_q_ai,
            name: "AI_Knowledge",
            required: true,
            labels: demographics_c_ai,
        },
    ],
    data: {
        screen: "demographics_other",
    },
}

var questionnaire_hormones = {
    type: jsPsychSurveyMultiChoice,
    preamble: demographics_hormones_preamble,
    questions: [
        {
            prompt: demographics_q_hormones,
            options: demographics_c_hormones,
            name: "BirthControl",
        },
    ],
    data: {
        screen: "demographics_hormones",
    },
}

var demographics_info = {
    timeline: [demographics_multichoice, demographics_freetext],
}

var demographics_hormones = {
    timeline: [questionnaire_hormones],
    conditional_function: function () {
        // get the data from the previous trial,
        // and check which key was pressed
        var sex = jsPsych.data
            .get()
            .filter({ screen: "demographics_1" })
            .values()[0]["response"]["Sex"]
        if (["Male", "Maschio", "Masculin"].includes(sex)) {
            return false
        } else {
            return true
        }
    },
}
