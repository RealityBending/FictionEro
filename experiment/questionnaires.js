// Items =================================================


var bait_dimensions = [
    "GAAIS_Negative_9",
    "GAAIS_Negative_10",
    "GAAIS_Negative_15",
    "GAAIS_Positive_7",
    "GAAIS_Positive_12",
    "GAAIS_Positive_17",
    "BAIT_1_ImagesRealistic",
    "BAIT_2_ImagesIssues",
    "BAIT_3_VideosRealistic",
    "BAIT_4_VideosIssues",
    "BAIT_5_ImitatingReality",
    "BAIT_6_EnvironmentReal",
]


// Questionnaires =================================================

function format_questions_analog(
    items,
    dimensions,
    ticks = ["Inaccurate", "Accurate"]
) {
    var questions = []
    for (const [index, element] of items.entries()) {
        questions.push({
            prompt: "<b>" + element + "</b>",
            name: dimensions[index],
            ticks: ticks,
            required: false,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        })
    }
    return questions
}

// BAIT 2.0
var questionnaire_bait = {
    type: jsPsychMultipleSlider,
    questions: format_questions_analog(
        bait_items,
        bait_dimensions,
        // In Schepman et al. (2022) they removed 'Strongly'
        (ticks = bait_ticks)
    ),
    randomize_question_order: true,
    preamble: bait_instructions,
    require_movement: false,
    slider_width: 600,
    data: {
        screen: "questionnaire_bait",
    },
}

// COPS ========================================================================
// Consumption of Pornography Scale – General (COPS – G)
// Hatchet al. (2023)
var questionnaire_cops = {
    type: jsPsychSurveyMultiChoice,
    css_classes: ["narrow-text"],
    preamble: cops_instructions,
    questions: cops_items,
}
