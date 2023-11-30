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
var demographics_consent = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        // Logo
        "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
        // Title
        "<h1>Informed Consent</h1>" +
        "<p align='left'>This study aims at comparing ....</p>" +
        "<p align='left'>As you will be shown <b>erotic images</b>, please make sure you find yourself in an private setting for the whole duration of the experiment (~30min).</p>" +
        "<p align='left'>Your participation in this research will be kept completely confidential. <b>Your responses are entirely anonymous</b>, and no IP address or any identifiers are collected.</p>" +
        "<p align='left'>Your participation contributes to scientific advancement. <b>By participating, you agree to follow the instructions and provide honest answers.</b> If you are minor or if you do not wish to participate this survey, simply close your browser.</p>" +
        // "<p>Please note that various checks will be performed to ensure the validity of the data.<br>We reserve the right to return your participation or prorate reimbursement should we detect non-valid responses (e.g., random pattern of answers, instructions not read, ...).</p>"
        "<p align='left'><br><sub><sup>If you have any questions about the project, please contact D.Makowski@sussex.ac.uk. This project has been reviewed and approved by the Ethics Comitee of the University of Sussex (XXXX).</sup></sub></p>",

    choices: ["I am more than 18 years old and I consent to the above"],
    data: { screen: "consent" },
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
        stimulus:
            "<h1>Thank you for participating</h1>" +
            "<p>It means a lot to us. Don't hesitate to share the study by sending this link:</p>" +
            // Blue URL
            "<p><a href='" +
            link +
            "'>" +
            link +
            "<a/></p>" +
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
            name: "gender",
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
                "High school",
                "Other",
            ],
            name: "education",
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
            name: "age",
        },
        {
            prompt: "Please enter your ethnicity",
            placeholder: "e.g., Caucasian",
            name: "ethnicity",
        },
        {
            prompt: "In which country do you currently live?",
            placeholder: "e.g., UK, Spain",
            name: "country",
        },
    ],
    data: {
        screen: "demographics_2",
    },
}

var demographics_hormones = {
    type: jsPsychSurveyMultiChoice,
    preamble:
        "<b>The following questions are important to understand the role of potential biological factors in our study.</b><br>Please leave blank if the questions don't apply.",
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
            name: "birthcontrol",
        },
    ],
    data: {
        screen: "demographics_hormones",
    },
}

var demographics_sex = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: "When is the last time you engaged in sexual activity (intercourse or masturbation)?",
            placeholder: "e.g., '2 days ago', '3 years ago'",
            name: "lastsex",
        },
    ],
    data: {
        screen: "demographics_sexlast",
    },
}

var demographics_info = {
    timeline: [
        demographics_multichoice,
        demographics_freetext,
        demographics_hormones,
        demographics_sex,
    ],
}

var demographics_ai = {
    type: jsPsychSurveyLikert,
    autocomplete: true,
    questions: [
        {
            prompt: "<b>How knowledgeable do you consider yourself about Artificial Intelligence (AI) technology?</b>",
            name: "AIknowledge",
            required: true,
            labels: ["Not at all - 0", "1", "2", "3", "4", "5", "6 - Expert"],
        },
    ],
    data: {
        screen: "demographics_AIknowledge",
    },
}
