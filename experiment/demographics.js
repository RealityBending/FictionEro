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
    on_finish: function () {
        data = jsPsych.data.get().filter({ screen: "browser_info" }).values()[0]
        jsPsych.data.addProperties({
            ["screen_height"]: data["height"],
            ["screen_width"]: data["width"],
        })
        for (var key in data) {
            if (
                [
                    "vsync_rate",
                    "os",
                    "mobile",
                    "browser",
                    "browser_version",
                ].includes(key)
            ) {
                jsPsych.data.addProperties({
                    [key]: data[key],
                })
            }
        }
        jsPsych.data.addProperties()
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
function demographics_consent(experimenter = "DEFAULT") {
    return {
        type: jsPsychHtmlButtonResponse,
        css_classes: ["narrow-text"],
        stimulus: consent_text,
        choices: [consent_button],
        data: { screen: "consent" },
        on_finish: function () {
            jsPsych.data.addProperties({
                experimenter: experimenter,
            })
        },
    }
}

// Thank you ========================================================================
var demographics_waitdatasaving = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<p>Done! now click on 'Continue' and <b>wait until your responses have been successfully saved</b> before closing the tab.</p> ",
    choices: ["Continue"],
    data: { screen: "waitdatasaving" },
}

var demographics_endscreen = function (
    link = "https://realitybending.github.io/FictionEro/experiment/english1.html"
) {
    return {
        type: jsPsychHtmlButtonResponse,
        css_classes: ["narrow-text"],
        stimulus:
            "<h1>Thank you for participating</h1>" +
            "<p>It means a lot to us. Don't hesitate to share the study by sending this link:</p>" +
            "<p><a href='" +
            link +
            "'>" +
            link +
            "<a/></p>" +
            "<h2>Debriefing</h2>" +
            "<p align='left'>The purpose of this study was actually to study the effect on sexual arousal of <i>believing</i> that the content is AI-generated. In fact, all images were taken from an existing database of images used in psychology. We apologize for the necessary deception used in the instructions, and we hope that you understand its role in ensuring the validity of our experiment.</p>" +
            "<p align='left'><b>Thank you again!</b> Your participation in this study will be kept completely confidential.If you have any questions or concerns about the project, please contact D.Makowski@sussex.ac.uk.</p>" +
            "<p><b>You can safely close the tab now.</b></p>",
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
            name: "Gender",
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
        var sex = jsPsych.data
            .get()
            .filter({ screen: "demographics_1" })
            .values()[0]["response"]["Gender"]
        if (sex == "Male") {
            return false
        } else {
            return true
        }
    },
}
