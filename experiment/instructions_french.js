// =========================================================================================
// Parameters
// =========================================================================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

var color_cues = shuffleArray(["red", "blue", "green"])
color_cues = { Reality: color_cues[0], Fiction: color_cues[1] }
// =========================================================================================
// Fiction
// =========================================================================================
var text_instructions1 =
    "<h1>Instructions</h1>" +
    // Left aligned text
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Dans cette étude, nous visons à valider notre <b> nouvel algorithme de génération d'images </b> (basé sur une nouvelle forme de technologie Generative Adversarial Network - GAN) entraîné pour produire du contenu érotique (mais aussi non érotique) de haute qualité.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Dans la tâche suivante, on vous présentera des images érotiques et non érotiques générées par notre algorithme (précédées de l'étiquette '<b style='color:" +
    color_cues["Fiction"] +
    "'>generée pa l'IA</b>'), mélangées à des photos réelles (précédées de l'étiquette  '<b style='color:" +
    color_cues["Reality"] +
    "'>Photographie</b>') tirées de bases de données d'images publiques.</p > " +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Après chaque image, vous devrez l'évaluer sur les échelles suivantes :</p>" +
    "<ul style='text-align: left; margin-left: 30%; margin-right: 30%;'>" +
    // Arousal: embodied
    "<li><b>Excitation</b>: Dans quelle mesure trouvez-vous l'image sexuellement excitante ? Cette question porte sur votre <i> réaction personnelle </i> ressentie dans votre corps à la vue de l'image.</li>" +
    // Appeal: "objective"
    "<li><b>Attrait</b>: Dans quelle mesure jugez-vous cette image séduisante et sexuellement attrayante ? Pensez à la façon dont, en général, les personnes qui vous ressemblent en termes de sexe et d'orientation sexuelle l'aimeraient.</li>" +
    // Emotional Valence
    "<li><b>Agrément</b>: L'image a-t-elle suscité en vous un sentiment positif et agréable (pas nécessairement sexuel), ou pourrait-elle être qualifiée de négative et désagréable ? Pensez au plaisir que vous avez pris (ou non) à regarder l'image</li></ul>" +
    // Contrasting explanation
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Si les réponses à ces échelles peuvent parfois être très similaires, elles peuvent aussi être différentes en fonction de la personne, de l'image et du contexte. Par exemple, nous pouvons parfois nous sentir sexuellement excités par une image qui ne serait probablement pas considérée comme universellement attrayante. À l'inverse, une image séduisante et \"objectivement\" sexy peut, pour une raison ou une autre, ne susciter aucune réaction dans notre corps.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'><b>Essayez d'être attentif à ce qui se passe dans votre esprit et dans votre corps lorsque vous regardez les images, afin de tenter de répondre avec précision en fonction de vos propres sentiments et réactions.</b></p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Par ailleurs, certaines images n'étant pas érotiques, il peut sembler étrange de penser à l'excitation qu'elles procurent. Ne vous inquiétez pas, c'est normal. <b>Il n'y a pas de bonne ou de mauvaise réponse</b>, il suffit d'écouter votre corps et d'essayer de répondre le mieux possible en fonction de ce que vous ressentez.</p>"

var text_instructions2 =
    "<h1>Très bien !</h1>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Merci beaucoup. Dans la phase suivante, nous aimerions voir si vous avez trouvé notre <b> algorithme de génération d'images convaincant </b> et sans erreur.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Nous vous présenterons brièvement <b> toutes les images</b>  une dernière fois (celles générées par l'IA, ainsi que les photographies), et vous devrez les évaluer en fonction de leur degré de similitude avec une <b>image réelle</b>  (réalisme,  ressemblance avec une photographie).</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Ce qui nous intéresse, c'est votre impression générale et votre intuition, à savoir si vous avez le sentiment que l'image a été générée par l'IA ou non.</p>"

//-------------------------
var text_instructionsbutton = "Commençons !"

// -------------------------

var text_cue = { Reality: "Photographie", Fiction: "générée par l'IA" }

// -------------------------
var text_instructions_questionnaires =
    "<p><b>Merci</b><br>Maintenant, répondez à quelques questions sur vous.</p>"

// Ratings ----------------------------------------------------------------
var text_ticks = ["Pas du tout", "Beaucoup"]
var text_ticks_valence = ["Désagréable", "Agréable"]
var text_rating_appeal =
    "Dans quelle mesure cette image vous semble-t-elle <b>attrayante</b> ?"
var text_rating_arousal =
    "Dans quelle mesure vous êtes-vous senti(e) <b>sexuellement excité(e)</b> ?"
var text_rating_valence = "Le <b>sentiment</b> évoqué par l'image était..."
var text_rating_realness =
    "Dans quelle mesure cette image est-elle <b>réaliste</b> ?"

// -------------------------
var text_feedback1 =
    "<h1>Merci !</h1>" +
    "<p>Avant de terminer, nous aimerions connaître votre avis sur l'expérience. Veuillez cocher toutes les cases correspondantes :</p>"
var text_feedback1_items = [
    "Je me suis amusé(e)",
    "C'était ennuyeux",
    "Je pouvais distinguer les images qui étaient des photographies de celles qui étaient générées par l'IA.",
    "Je n'ai pas vu de différence entre les photographies et les images générées par l'IA.",
    "J'ai eu l'impression que les images générées par l'IA étaient plus excitantes que les photographies.",
    "J'ai eu l'impression que les images générées par l'IA étaient moins excitantes que les photographies.",
    "J'ai eu l'impression que les étiquettes (\"photographie\" et \"généré par l'IA\") n'étaient pas toujours correctes.",
    "J'ai eu l'impression que les étiquettes étaient inversées (par exemple, \"Photographie\" pour les images générées par l'IA et vice versa).",
    "Certaines photos étaient vraiment excitantes.",
    "Je n'ai rien ressenti en regardant les images.",
]

var text_feedback2 = "Avez-vous d'autres commentaires ou réactions ?"
var text_feedback2_placeholder = "Saisissez ici"

// -------------------------
var text_debriefing =
    "<h2>Debriefing</h2>" +
    "<p align='left'>L'objectif de cette étude était d'étudier l'effet sur l'excitation sexuelle de la <b>croyance</b> que le contenu d'une image soit généré par l'IA. " +
    "En effet, nous voulons tester l'hypothèse selon laquelle le fait de croire que les images érotiques sont fausses entraînerait une baisse de l'excitation émotionnelle. " +
    "Comme nous nous intéressons principalement à vos <i>croyances</i> sur la réalité, toutes les images étaient en fait tirées d'une base de données d'images réelles utilisées dans la recherche en psychologie sur les émotions. " +
    "Nous nous excusons pour la tromperie inévitable contenue dans nos instructions, et nous espérons que vous comprenez son rôle pour assurer la validité de notre expérience.</p>" +
    "<p align='left'><b>Merci !</b> Votre participation à cette étude restera totalement confidentielle. Si vous avez des questions ou des doutes concernant le projet, veuillez contacter D.Makowski@sussex.ac.uk ou marco.sperduti@u-paris.fr.</p>" +
    '<p>Pour terminer votre participation à cette étude, cliquez sur "Continuer" et <b>attendez que vos réponses aient été sauvegardées</b> avant de fermer l\'onglet.</p> '

var text_endscreen = function (
    link = "https://realitybending.github.io/FictionEro/experiment/english?exp=snow&lang=en"
) {
    return (
        "<h1>Merci de votre participation</h1>" +
        "<p>Cela représente beaucoup pour nous. N'hésitez pas à partager l'étude en envoyant ce lien <i>(mais ne révélez pas les détails de l'expérience)</i>:</p>" +
        "<p><a href='" +
        link +
        "'>" +
        link +
        "<a/></p>" +
        "<p><b>Vous pouvez maintenant fermer l'onglet en toute sécurité.</b></p>"
    )
}

// =========================================================================================
// Questionnaires
// =========================================================================================

var bait_instructions =
    "<h2>À propos de l'IA...</h2>" +
    "<p>Nous sommes intéressés par vos idées sur l'intelligence artificielle (IA).<br>" +
    "Veuillez lire attentivement les déclarations ci-dessous et indiquer dans quelle mesure vous êtes d'accord avec chacune d'entre elles.</p>"

// General Attitudes towards Artificial Intelligence Scale (GAAIS; Schepman et al., 2020, 2022)
// We used the most loaded items from Schepman et al. (2023) - loadings from the 2 CFAs are in parentheses
// We adedd items specifically about CGI and artificial media (BAIT)
var bait_items = [
    // Neg3 (0.406, 0.405) - Low loadings
    // "Organisations use Artificial Intelligence unethically",
    // Neg9 (0.726, 0.717) - Not used in FakeFace
    "L'intelligence artificielle pourrait prendre le contrôle des personnes",
    // Neg10 (0.850, 0.848) - Modified: removed "I think"
    "L'intelligence artificielle est dangereuse",
    // Neg15 (1.014, 0.884) - Not used in FakeFace. Modified: replaced "I shiver with discomfort when I think about" by "I am worried about"
    "Je m'inquiète des utilisations futures de l'intelligence artificielle",
    // Pos7 (0.820, 0.878)
    "Je suis intéressé(e) par l'utilisation de systèmes artificiellement intelligents dans ma vie quotidienne",
    // Pos12 (0.734, 0.554)
    "L'intelligence artificielle est passionnante",
    // Pos14 (0.516, 0.346) - Low loadings
    // "There are many beneficial applications of Artificial Intelligence",
    // Pos17 (0.836, 0.656) - Not used in FakeFace
    "Une grande partie de la société bénéficiera d'un avenir riche en intelligence artificielle",

    // New items (Beliefs about Artificial Images Technology - BAIT) ---------------------------
    // Revised from Makowski et al. (Fake Face study)
    // Changes from FakeFace: remove "I think"
    "Les algorithmes actuels d'intelligence artificielle peuvent générer des images très réalistes.",
    "Les images de visages ou de personnes générées par l'intelligence artificielle contiennent toujours des erreurs et des artefacts.",
    "Les vidéos générées par l'intelligence artificielle présentent des problèmes évidents qui les rendent faciles à repérer comme fausses.",
    "Les algorithmes actuels d'intelligence artificielle peuvent générer des vidéos très réalistes.",
    "Les images générées par ordinateur (CGI) sont capables d'imiter parfaitement la réalité",
    "La technologie permet de créer des environnements qui semblent aussi réels que la réalité", // New
    "Les assistants d'intelligence artificielle peuvent rédiger des textes qui ne peuvent pas être distingués de ceux écrits par des humains.", // New
    "Les documents et les phrases rédigés par une intelligence artificielle ont tendance à être différents des productions humaines.", // New
]

var bait_ticks = ["Pas d'accord", "D'accord"] // In Schepman et al. (2022) they removed 'Strongly'

// --------------------------------------------------------------------------------
// Hatch, S. G., Esplin, C. R., Hatch, H. D., Halstead, A., Olsen, J., & Braithwaite, S. R. (2023). The consumption of pornography scaleâgeneral (COPSâG). Sexual and Relationship Therapy, 38(2), 194-218.
var cops_instructions =
    "<h2>À propos de la pornographie...</h2>" +
    "<p style='text-align: left;'>Compte tenu de la nature de notre étude, nous souhaitons connaître vos habitudes en matière d'exposition à la pornographie. Veuillez répondre aux questions ci-dessous.</p>"

var cops_items = [
    // {
    //     prompt: "<b>1. Combien de fois avez-vous regardé de la pornographie au cours de l'année écoulée ?</b>",
    //     options: [
    //         "0. Je n'ai pas regardé de pornographie",
    //         "1. J'ai regardé de la pornographie une fois",
    //         "2. J'ai regardé de la pornographie environ une fois tous les six mois",
    //         "3. J'ai regardé de la pornographie environ une fois par mois",
    //         "4. J'ai regardé de la pornographie chaque semaine",
    //         "5. J'ai regardé de la pornographie plusieurs fois par semaine",
    //         "6. J'ai regardé de la pornographie tous les jours",
    //     ],
    //     name: "COPS_Frequency_1",
    //     required: false,
    // },
    {
        prompt: "<b>Combien de fois avez-vous regardé de la pornographie au cours des 30 derniers jours ?</b>",
        options: [
            "0. Je n'ai pas regardé de pornographie",
            "1. J'ai regardé de la pornographie une fois",
            "2. J'ai regardé de la pornographie deux fois",
            "3. J'ai regardé de la pornographie chaque semaine",
            "4. J'a regardé de la pornographie plusieurs fois par semaine",
            "5. J'a regardé de la pornographie tous les jours",
            "6. J'ai regardé de la pornographie plusieurs fois par jour",
        ],
        name: "COPS_Frequency_2",
        required: false,
    },
    // {
    //     prompt: "<b>3. Combien de fois avez-vous regardé de la pornographie au cours des 7 derniers jours ?</b>",
    //     options: [
    //         "0. Je n'ai pas regardé de pornographie",
    //         "1. J'ai regardé de la pornographie une fois",
    //         "2. J'ai regardé de la pornographie deux fois",
    //         "3. J'a regardé de la pornographie tous les jours",
    //         "4. J'ai regardé de la pornographie plusieurs fois par jour",
    //     ],
    //     name: "COPS_Frequency_3",
    //     required: false,
    // },
    {
        prompt: "<b>4. Lorsque je regarde de la pornographie, je le fais pendant...</b>",
        options: [
            "1. Moins de 5 minutes",
            "2. 6-15 minutes",
            "3. 16-25 minutes",
            "4. 26-35 minutes",
            "5. 36-45 minutes",
            "6. 46+ minutes",
        ],
        name: "COPS_Duration_1",
        required: false,
    },
    // {
    //     prompt: "<b>Lorsque je visite un site pornographique, je le fais pendant...</b>",
    //     options: [
    //         "1. Moins de 5 minutes",
    //         "2. 6-15 minutes",
    //         "3. 16-25 minutes",
    //         "4. 26-35 minutes",
    //         "5. 36-45 minutes",
    //         "6. 46+ minutes",
    //     ],
    //     name: "COPS_Duration_2",
    //     required: false,
    // },
    // {
    //     prompt: "<b>6. La dernière fois que j'ai regardé de la pornographie, je l'ai fait pendant...</b>",
    //     options: [
    //         "1. Moins de 5 minutes",
    //         "2. 6-15 minutes",
    //         "3. 16-25 minutes",
    //         "4. 26-35 minutes",
    //         "5. 36-45 minutes",
    //         "6. 46+ minutes",
    //     ],
    //     name: "COPS_Duration_3",
    //     required: false,
    // },
    // Extra questions ------------------------------------------
    {
        prompt: "<b>Quand avez-vous eu pour la dernière fois une activité sexuelle (rapports sexuels ou masturbation) ?</b>",
        options: [
            "1. Il y a moins de 24h",
            "2. Au cours des 3 derniers jours",
            "3. Au cours de la dernière semaine",
            "4. Au cours du dernier mois",
            "5. Au cours de la dernier année",
            "6. Il y a plus d'un an",
        ],
        name: "SexualActivity",
        required: false,
    },
    {
        prompt: "<b>Comment décririez-vous votre orientation sexuelle ?</b>",
        options: ["Hétérosexuel", "Bisexuel", "Homosexuel", "Autre"],
        name: "SexualOrientation",
        required: false,
    },
]

// =========================================================================================
// Demographics
// =========================================================================================

var consent_text = // Logo and title
    "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
    "<h1>Consentement éclairé</h1>" +
    // Overview
    "<p align='left'><b>Invitation à participer</b><br>" +
    "Vous êtes invité(e) à participer à une étude visant à mieux comprendre l'impact des nouvelles technologies. Nous vous remercions de lire attentivement cette fiche d'information. Cette étude est menée par le Dr Dominique Makowski de l'Université du Sussex et le Dr Marco Sperduti de l'Université Paris Cité, qui se tiennent à votre disposition (D.Makowski@sussex.ac.uk ; marco.sperduti@u-paris.fr) si vous avez des questions.</p>" +
    // Description
    "<p align='left'><b>Pourquoi ai-je été invité et que vais-je faire ?</b><br>" +
    "Nous étudions l'impact des nouvelles technologies sur les habitudes et les comportements liés à la pornographie. Dans le cadre de cette étude, des <b>images érotiques</b> vous seront montrées. Veillez donc à vous trouver dans un <b>endroit privé</b> pendant toute la durée de l'expérience (~20min).</p>" +
    // Results and personal information
    "<p align='left'><b>Qu'adviendra-t-il des résultats et de mes informations personnelles ?</b><br>" +
    "Les résultats de cette recherche peuvent faire l'objet d'une publication scientifique. Votre anonymat sera garanti de la manière décrite dans les informations de consentement ci-dessous. Veuillez lire attentivement ces informations et, si vous souhaitez participer, reconnaissez que vous avez bien compris cette fiche et que vous acceptez de prendre part à l'étude telle qu'elle est décrite ici.</p>" +
    "<p align='left'><b>Consentement</b><br></p><ul>" +
    // Bullet points
    "<li align='left'>Je comprends qu'en signant ci-dessous, j'accepte de participer à la recherche de l'Université du Sussex décrite ici, et que j'ai lu et compris cette fiche d'information.</li>" +
    "<li align='left'>Je comprends que ma participation est entièrement volontaire, que je peux choisir de ne pas participer à tout ou partie de l'étude et que je peux me retirer à tout moment sans avoir à donner de raison et sans être pénalisé(e) de quelque manière que ce soit (par exemple, si je suis étudiant(r), ma décision de participer ou non à l'étude n'affectera pas mes notes).</li>" +
    "<li align='left'>Je comprends que,  l'étude étant anonyme, il sera impossible de retirer mes données une fois que j'aurai completé et envoyé mes réponses.</li>" +
    "<li align='left'>Je comprends que mes données personnelles seront utilisées aux fins de cette recherche et qu'elles seront traitées conformément à la législation sur la protection des données. Je comprends que la déclaration de confidentialité de l'Université fournit de plus amples informations sur la manière dont l'Université utilise les données personnelles dans le cadre de la recherche.</li>" +
    "<li align='left'>Je comprends que les données collectées seront stockées de manière anonyme. Les données anonymes peuvent être rendues publiques par le biais de dépôts de données scientifiques sécurisés en ligne.</li>" +
    // Ethical managements
    "<li align='left'>Je comprends que l'on me montrera du matériel potentiellement sensible (images érotiques) et je confirme donc que j'ai plus de 18 ans.</li>" +
    "</ul></p>" +
    // "<p align='left'>Votre participation à cette recherche restera totalement confidentielle. Vos réponses sont entièrement anonymes et aucune adresse IP ni aucun identifiant ne sera collecté.</p>" +
    // "<p align='left'><b>En participant, vous acceptez de suivre les instructions et de fournir des réponses honnêtes.</b> Si vous ne souhaitez pas participer à cette étude, fermez simplement votre navigateur.</p>" +
    // "<p>Veuillez noter que divers contrôles seront effectués pour garantir la validité des données.<br>Nous nous réservons le droit d'exclure vos données si nous détectons des réponses non valides (par exemple, des réponses aléatoires, des instructions non lues, ...).</p>"
    "<p align='left'>Pour plus d'informations sur cette recherche, ou si vous avez des questions, veuillez contacter le Dr Dominique Makowski (D.Makowski@sussex.ac.uk) et/ou le Dr Marco Sperduti (marco.sperduti@u-paris.fr). Cette recherche a été approuvée (ER/NR274/1) par la School of Psychology de l'Université du Sussex. L'Université du Sussex a souscrit une assurance pour couvrir ses responsabilités légales dans le cadre de cette étude.</p>"

var consent_button =
    "J'ai plus de 18 ans et j'ai lu, compris et accepté ce qui précède."

var fullscreen_text =
    "<p>L'expérience passe en mode plein écran lorsque vous appuyez sur le bouton ci-dessous.</p>"
var fullscreen_button = "Continuer"

// -------------------------
var button_continue = "Continuer"
var button_end = "Fin"

var demographics1_preamble =
    "<b>Merci de répondre aux questions suivantes :</b>"
var demographics_q_sex = "Quel est votre sexe biologique ?"
var demographics_c_sex = ["Masculin", "Féminin", "Autre"]
var demographics_q_edu =
    "Quel est le cycle d'étude le plus élevé que vous ayez jamais completé ?"
var demographics_c_edu = [
    "Université (doctorat)",
    "Université (master/maîtrise) <sub><sup>ou équivalent</sup></sub>",
    "Université (licence) <sub><sup>ou équivalent</sup></sub>",
    "Baccalauréat <sub><sup>ou équivalent</sup></sub>",
    "École primaire",
    "Autre",
]
var demographics_q_age = "Veuillez indiquer votre âge (en années)"
var demographics_p_age = "e.g., '31'"
var demographics_q_eth = "Veuillez indiquer votre appartenance ethnique"
var demographics_p_eth = "e.g., Caucasien"
var demographics_q_cou = "Dans quel pays vivez-vous actuellement ?"
var demographics_p_cou = "e.g., UK, France"
var demographics_q_lang =
    "<b>Comment évaluez-vous votre niveau de français ?</b>"
var demographics_c_lang = [
    "Débutant - 0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6 - Langue maternelle",
]
var demographics_q_ai =
    "<b>Dans quelle mesure considérez-vous que vous connaissez la technologie de l'intelligence artificielle (IA) ?</b>"
var demographics_c_ai = [
    "Pas du tout - 0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6 - Expert",
]
var demographics_hormones_preamble =
    "<b>La question suivante est importante pour comprendre le rôle des facteurs biologiques potentiels dans notre étude.</b><br>Elle est toutefois facultative et vous pouvez l'omettre si vous le souhaitez."
var demographics_q_hormones =
    "Si vous êtes une femme, utilisez-vous actuellement un moyen de contraception ?"
var demographics_c_hormones = [
    "No",
    "Oui - pilules contraceptives (pilules combinées)",
    "Oui - pilules contraceptives (progestatif seul)",
    "Oui - dispositif intra-utérin (stérilet en cuivre, DIU)",
    "Oui - système intra-utérin (SIU)",
    "Oui - préservatifs féminins",
    "Oui - préservatifs du partenaire",
    "Oui - autre",
]
