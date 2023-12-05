// Full screen
var fullscreen_on = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    delay_after: 0,
}

var fullscreen_off = {
    type: jsPsychFullscreen,
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
        stimulus:
            // Logo and title
            "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
            "<h1>Informed Consent</h1>" +
            // Overview
            "<p align='left'><b>Invitation to Take Part</b><br>" +
            "You are being invited to take part in a research study to further our understanding of the impact of new technologies. Thank you for carefully reading this information sheet. This study is being conducted by Dr Dominique Makowski from the University of Sussex, who is happy to be contacted (D.Makowski@sussex.ac.uk) if you have any questions.</p>" +
            // Description
            "<p align='left'><b>Why have I been invited and what will I do?</b><br>" +
            "We are investigating how new technology can impact the habits and behaviours related to pornography. In this study, you will be shown <b>erotic images</b>, so please make sure you find yourself in an <b>private setting</b> for the whole duration of the experiment (~20min).</p>" +
            // Results and personal information
            "<p align='left'><b>What will happen to the results and my personal information?</b><br>" +
            "The results of this research may be written into a scientific publication. Your anonymity will be ensured in the way described in the consent information below. Please read this information carefully and then, if you wish to take part, please acknowledge that you have fully understood this sheet, and that you consent to take part in the study as it is described here.</p>" +
            "<p align='left'><b>Consent</b><br></p>" +
            // Bullet points
            "<li align='left'>I understand that by signing below I am agreeing to take part in the University of Sussex research described here, and that I have read and understood this information sheet</li>" +
            "<li align='left'>I understand that my participation is entirely voluntary, that I can choose not to participate in part or all of the study, and that I can withdraw at any stage without having to give a reason and without being penalised in any way (e.g., if I am a student, my decision whether or not to take part will not affect my grades).</li>" +
            "<li align='left'>I understand that since the study is anonymous, it will be impossible to withdraw my data once I have completed and submitted the test/questionnaire.</li>" +
            "<li align='left'>I understand that my personal data will be used for the purposes of this research study and will be handled in accordance with Data Protection legislation. I understand that the University's Privacy Notice provides further information on how the University uses personal data in its research.</li>" +
            "<li align='left'>I understand that my collected data will be stored in a de-identified way. De-identified data may be made publically available through secured scientific online data repositories.</li>" +
            // Ethical managements
            "<li align='left'>I understand that I will be shown potentially sensitive material (erotic images), and thus confirm that I am older than 18 years old.</li>" +
            "</p>" +
            // "<p align='left'>Your participation in this research will be kept completely confidential. Your responses are entirely anonymous, and no IP address or any identifiers is collected.</p>" +
            // "<p align='left'><b>By participating, you agree to follow the instructions and provide honest answers.</b> If you do not wish to participate this survey, simply close your browser.</p>" +
            // "<p>Please note that various checks will be performed to ensure the validity of the data.<br>We reserve the right to return your participation or prorate reimbursement should we detect non-valid responses (e.g., random pattern of answers, instructions not read, ...).</p>"
            "<p align='left'><br><sub><sup>For further information about this research, or if you have any concerns, please contact Dr Dominique Makowski (D.Makowski@sussex.ac.uk). This research has been approved (XX/XXXX/XX) by the ethics board. The University of Sussex has insurance in place to cover its legal liabilities in respect of this study.</sup></sub></p>",

        choices: [
            "I am more than 18 years old, and I read, understood, and consent to the above",
        ],
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
                "High school",
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

var demographics_ai = {
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
        screen: "demographics_AIknowledge",
    },
}

var questionnaire_hormones = {
    type: jsPsychSurveyMultiChoice,
    preamble:
        "<b>The following questions is important to understand the role of potential biological factors in our study.</b><br>It is however optional, and you can skip it if you want.",
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
