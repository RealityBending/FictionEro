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
        data["sona_id"] = urlvars["sona_id"]
        data["researcher"] = urlvars["exp"]
        data["language"] = urlvars["lang"]
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
            participant_id: jsPsych.data.get().last().values()[0]["response"]["Participant_ID"],
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
    choices: ["Continue"],
    data: { screen: "debriefing" },
}

var demographics_endscreen = function (
    link = "https://realitybending.github.io/FictionEro/experiment/english.html"
) {
    return {
        type: jsPsychHtmlButtonResponse,
        css_classes: ["narrow-text"],
        stimulus: text_endscreen(link),
        choices: ["End"],
        data: { screen: "endscreen" },
    }
}

// Demographic info ========================================================================
var demographics_multichoice = {
    type: jsPsychSurveyMultiChoice,
    preamble: "<b>Please answer the following questions:</b>",
    questions: [
        {
            prompt: "What is your biological sex?",
            options: ["Male", "Female", "Other"],
            name: "Sex",
            required: true,
        },
        // {
        //     prompt: "Are you currently a student?",
        //     options: ["Yes", "No"],
        //     name: "student",
        // },
        {
            prompt: "What is your highest completed education level?",
            options: [
                "University (doctorate)",
                "University (master) <sub><sup>or equivalent</sup></sub>",
                "University (bachelor) <sub><sup>or equivalent</sup></sub>",
                "High school <sub><sup>or equivalent</sup></sub>",
                "Primary school",
                "Other",
            ],
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
            prompt: "Please enter your age (in years)",
            placeholder: "e.g., '31'",
            name: "Age",
            required: true,
        },
        {
            prompt: "Please enter your ethnicity",
            placeholder: "e.g., Caucasian",
            name: "Ethnicity",
            required: false,
        },
        {
            prompt: "In which country do you currently live?",
            placeholder: "e.g., UK, Spain",
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
            prompt: "<b>How would you rate your level of English?</b>",
            name: "Language_Level",
            required: true,
            labels: ["Beginner - 0", "1", "2", "3", "4", "5", "6 - Fluent"],
        },
        {
            prompt: "<b>How knowledgeable do you consider yourself about Artificial Intelligence (AI) technology?</b>",
            name: "AI_Knowledge",
            required: true,
            labels: ["Not at all - 0", "1", "2", "3", "4", "5", "6 - Expert"],
        },
    ],
    data: {
        screen: "demographics_other",
    },
}

var questionnaire_hormones = {
    type: jsPsychSurveyMultiChoice,
    preamble:
        "<b>The following question is important to understand the role of potential biological factors in our study.</b><br>It is however optional, and you can skip it if you want.",
    questions: [
        {
            prompt: "If you are a female, are you currently using birth control treatment?",
            options: [
                "No",
                "Yes - contraceptive pills (combined pills)",
                "Yes - contraceptive pills (progestogen-only pills)",
                "Yes - intrauterine device (copper coil, IUD)",
                "Yes - intrauterine system (IUS)",
                "Yes - female condoms",
                "Yes - condoms for partner",
                "Yes - other",
            ],
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
        var sex = jsPsych.data.get().filter({ screen: "demographics_1" }).values()[0]["response"][
            "Sex"
        ]
        if (sex == "Male") {
            return false
        } else {
            return true
        }
    },
}
