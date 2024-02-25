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
    "<h1>Instrucciones</h1>" +
    // Left aligned text
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>En este estudio buscamos validar nuestro <b> nuevo algoritmo de generación de imágenes </b> (basado en una nueva forma de Generative Adversarial Network - GAN - tecnología) diseñado para producir contenido erótico de alta calidad (pero también contenido no erótico).</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>En la siguiente tarea, se te presentarán imágenes eróticas y no eróticas generadas por nuestro algoritmo (precedidas por la palabra '<b style='color:" +
    color_cues["Fiction"] +
    "'>Generadas por IA (Inteligencia Artificial)</b>'), entremezcladas con fotos reales (precedidas por la palabra '<b style='color:" +
    color_cues["Reality"] +
    "'>Fotografías</b>') tomada de bases de datos públicas.</p > " +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Después de cada imagen, deberás de evaluarla a través de las siguientes escalas:</p>" +
    "<ul style='text-align: left; margin-left: 30%; margin-right: 30%;'>" +
    // Arousal: embodied
    "<li><b>Activante</b>: En qué medida encuentras la imagen sexualmente activante. Esta pregunta es acerca de tu <i>reacción personal</i> experimentada en tu cuerpo cuando ves la imagen.</li>" +
    // Appeal: "objective"
    "<li><b>Atractiva/apetecible</b>: Que tan atractiva y sexualmente apetecible consideras que es esta imagen. Piensa en qué medida la imagen le gustaría a las personas que comparten tu género y orientación sexual.</li>" +
    // Emotional Valence
    "<li><b>Valencia</b>: ¿La imagen generó una sensación positiva y placentera en ti (no necesariamente sexual), o consideras que la sensación generada por la imagen es negativa y desagradable? Piensa en cuanto disfrutaste (o no disfrutaste) mirando la imagen</li></ul>" +
    // Contrasting explanation
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Pese a que las respuestas a estas escalas pueden ser a veces similares, también pueden ser diferentes dependiendo de cada persona, imagen y contexto. Por ejemplo, en ocasiones podemos encontrar que una foto que nos resulta activante improbablemente sea del agrado de todos. Contrariamente, una foto apetecible y \"objetivamente\" sexy puede, por diferentes razones, no generar ninguna reacción en nuestro cuerpo.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'><b>Intenta prestar atención a lo que pasa en tu mente y en tu cuerpo mientras ves las imágenes para que puedes contestar de forma acertada basándote en tus propios sentimientos y reacciones.</b></p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Además, dado que algunas imágenes no son eróticas, puede parecer raro pensar en que tan activantes son. No te preocupes, esto es normal. <b>No hay respuestas correctas o incorrectas</b>, solo escucha a tu propio cuerpo e intenta contestar lo mejor que puedas basándote en lo que te sientes.</p>"

var text_instructions2 =
    "<h1>Genial!</h1>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Muchas gracias. En la siguiente fase, nos gustaría conocer si encuentras nuestro <b>algoritmo de generación de imágenes convincente</b> y libre de errores.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Te presentaremos brevemente <b>todas las imágenes</b> una vez más(las generadas por IA y las fotos), y deberás evaluar que tan <b>real</b> (que tanto parece una fotografía real) es la imagen.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Nos interesa tu impresión general y tu sensación intuitiva acerca de si la imagen es generada por IA o no.</p>"

//-------------------------
var text_instructionsbutton = "Empecemos!"

// -------------------------

var text_cue = { Reality: "Fotografía", Fiction: "Generada por IA" }

// -------------------------
var text_instructions_questionnaires =
    "<p><b>Gracias</b><br>Ahora por favor ayúdanos contestando algunas preguntas acerca de ti.</p>"

// Ratings ----------------------------------------------------------------
var text_ticks = ["En absoluto", "Mucho"]
var text_ticks_valence = ["Desagradable", "Agradable"]
var text_rating_appeal = "Que tan <b>atractiva/apetecible</b> consideras que es esta imagen?"
var text_rating_arousal = "En qué medida experimentas <b>activación sexual</b>?"
var text_rating_valence = "La<b>sensación</b> generada por la imagen fue..."
var text_rating_realness = "¿Que tan <b>realista</b> fue la imagen?"

// -------------------------
var text_feedback1 =
    "<h1>Gracias!</h1>" +
    "<p>Antes de terminar, nos gustaría conocer algunas de tus impresiones del experimento. Por favor marca todo aquello que aplique:</p>"
var text_feedback1_items = [
    "Me divertí",
    "Me aburrí",
    "Pude identificar que imágenes eran fotos y que imágenes eran generadas por IA",
    "No vi ninguna diferencia entre las fotos y las imágenes generadas por IA",
    "Sentí que las imágenes generadas por IA fueron más activantes que las fotos",
    " Sentí que las imágenes generadas por IA fueron menos activantes que las fotos",
    "Sentí que las categorías ('Fotografía' y 'Generada por IA') no fueron siempre correctas",
    " Sentí que las categorías estaban al revés (e.g., 'Fotografía' para imágenes generadas por IA y viceversa)",
    "Algunas imágenes fueron realmente activantes",
    "Realmente no sentí nada cuando miraba las imágenes",
]

var text_feedback2 = "¿Tienes algún comentario o feedback?"
var text_feedback2_placeholder = "Escribe aquí "

// -------------------------
var text_debriefing =
    "<p align='left'>El propósito de este estudio era en realidad estudiar el efecto sobre la excitación sexual de <i>creer</i> que el contenido es generado por IA. " +
    "De hecho, queremos probar la hipótesis de que creer que las imágenes eróticas son falsas llevaría a una menor excitación emocional. " +
    "Dado que estamos principalmente interesados en tus <i>creencias</i> sobre la realidad, todas las imágenes fueron tomadas de una base de datos existente de imágenes reales utilizadas en investigaciones psicológicas para estudiar las emociones. " +
    "Nos disculpamos por la necesaria “trampa” utilizada en las instrucciones, y esperamos que entiendas su papel en garantizar la validez de nuestro experimento.</p>" +
    "<p align='left'><b>Gracias de nuevo!</b> Tu participación en este estudio se mantendrá completamente confidencial. Si tienes alguna pregunta o inquietud sobre el proyecto, por favor contacta a antonio.oliverade@amigo.edu.co.</p>" +
    "<p>Para completar tu participación en este estudio, haz clic en 'Continuar' y <b>espera hasta que tus respuestas hayan sido guardadas exitosamente</b> antes de cerrar la pestaña.</p> "

var text_endscreen = function (
    link = "https://realitybending.github.io/FictionEro/experiment/english?exp=snow&lang=en"
) {
    return (
        "<h1>Gracias por participar</h1>" +
        "<p>Es importante para nosotros. No dudes en compartir el estudio enviando este enlace <i>(pero por favor no reveles los detalles del experimento)</i>:</p>" +
        "<p><a href='" +
        link +
        "'>" +
        link +
        "<a/></p>" +
        "<p><b>Puedes cerrar la pestañá del navegaodr.</b></p>"
    )
}

// =========================================================================================
// Questionnaires
// =========================================================================================

var bait_instructions =
    "<h2>Acerca IA...</h2>" +
    "<p>Estamos interesados en tus pensamientos acerca de la Inteligencia Artificial (IA).<br>" +
    "Por favor lee los enunciados de abajo cuidadosamente e indica en qué medida estás de acuerdo con cada enunciado.</p>"

// General Attitudes towards Artificial Intelligence Scale (GAAIS; Schepman et al., 2020, 2022)
// We used the most loaded items from Schepman et al. (2023) - loadings from the 2 CFAs are in parentheses
// We adedd items specifically about CGI and artificial media (BAIT)
var bait_items = [
    // Neg3 (0.406, 0.405) - Low loadings
    // "Organisations use Artificial Intelligence unethically",
    // Neg9 (0.726, 0.717) - Not used in FakeFace
    "La Inteligencia Artificial puede tomar el control de la gente",
    // Neg10 (0.850, 0.848) - Modified: removed "I think"
    " La Inteligencia Artificial es peligrosa ",
    // Neg15 (1.014, 0.884) - Not used in FakeFace. Modified: replaced "I shiver with discomfort when I think about" by "I am worried about"
    "Me preocupa los futuros usos de la Inteligencia Artificial<br>",
    // Pos7 (0.820, 0.878)
    "Tengo interés en utilizar la inteligencia artificial en mi vida cotidiana",
    // Pos12 (0.734, 0.554)
    " La Inteligencia Artificial es emocionante",
    // Pos14 (0.516, 0.346) - Low loadings
    // "There are many beneficial applications of Artificial Intelligence",
    // Pos17 (0.836, 0.656) - Not used in FakeFace
    "Gran parte de la sociedad se beneficiará de un future lleno de Inteligencia Artificial<br>",

    // New items (Beliefs about Artificial Images Technology - BAIT) ---------------------------
    // Revised from Makowski et al. (Fake Face study)
    // Changes from FakeFace: remove "I think"
    "Los algoritmos actuales de Inteligencia Artificial pueden generar imágenes muy realistas",
    "Las imágenes de rostros o personas generadas por Inteligencia Artificial siempre contienen errores",
    "Los videos generados por Inteligencia Artificial tienen problemas evidentes que los hacen ser fácilmente identificados como falsos",
    "Los actuales algoritmos de Inteligencia Artificial pueden generar videos muy realistas",
    "Las imágenes generadas por ordenador(CGI) son capaces de imitar la realidad perfectamente",
    "La tecnología permite la creación de ambientes que parecen tan reales como la realidad", // New
    "Los asistentes de Inteligencia Artificial pueden escribir textos que son indistinguibles de aquellos escritos por humanos.", // New
    "Los documentos y párrafos escritos por la Inteligencia Artificial suelen leerse de manera diferente en comparación con las producciones humanas.", // New
] //

var bait_ticks = ["En desacuerdo", "De acuerdo"] // In Schepman et al. (2022) they removed 'Strongly'

// --------------------------------------------------------------------------------
// Hatch, S. G., Esplin, C. R., Hatch, H. D., Halstead, A., Olsen, J., & Braithwaite, S. R. (2023). The consumption of pornography scale–general (COPS–G). Sexual and Relationship Therapy, 38(2), 194-218.
var cops_instructions =
    "<h2>Acerca de la pornografía...</h2>" +
    "<p style='text-align: left;'>Dada la naturaleza del estudio, nos interesa conocer tus hábitos relacionados a la exposición a pornografía. Por favor considera contestar las preguntas de abajo.</p>"

var cops_items = [
    // {
    //     prompt: "<b>1. How often have you viewed pornography in the past year?</b>",
    //     options: [
    //         "0. I haven't viewed pornography in the past year",
    //         "1. I viewed pornography once in the past year",
    //         "2. I viewed pornography about once every six months",
    //         "3. I viewed pornography about monthly",
    //         "4. I viewed pornography weekly",
    //         "5. I viewed pornography multiple times a week",
    //         "6. I viewed pornography daily",
    //     ],
    //     name: "COPS_Frequency_1",
    //     required: false,
    // },
    {
        prompt: "<b>¿Qué tan frecuente miraste pornografía en los últimos 30 días?</b>",
        options: [
            "0. No miré pornografía en los últimos 30 días",
            "1. Miré pornografía una vez en los últimos 30 días",
            "2. Miré pornografía dos veces en los últimos 30 días",
            "3. Miré pornografía semanalmente",
            "4. Miré pornografía varias veces por semana",
            "5. Miré pornografía diariamente",
            "6. Miré pornografía varias veces al día",
        ],
        name: "COPS_Frequency_2",
        required: false,
    },
    // {
    //     prompt: "<b>3. How often have you viewed pornography in the past 7 days?</b>",
    //     options: [
    //         "0. I haven't viewed pornography in the past 7 days",
    //         "1. I viewed pornography once in the past 7 days",
    //         "2. I viewed pornography twice in the past 7 days",
    //         "3. I viewed pornography every day of the past 7 days",
    //         "4. I viewed pornography multiple times a day in the past 7 days",
    //     ],
    //     name: "COPS_Frequency_3",
    //     required: false,
    // },
    {
        prompt: "<b>4. Cuando veo pornografía, lo hago por...</b>",
        options: [
            "1. Menos de 5 minutos",
            "2. 6-15 minutos",
            "3. 16-25 minutos",
            "4. 26-35 minutos",
            "5. 36-45 minutos",
            "6. 46+ minutos",
        ],
        name: "COPS_Duration_1",
        required: false,
    },
    // {
    //     prompt: "<b>When I visit a pornographic website, I visit for...</b>",
    //     options: [
    //         "1. Less than 5 minutes",
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
    //     prompt: "<b>6. The last time I viewed pornography, I viewed it for...</b>",
    //     options: [
    //         "1. Less than 5 minutes",
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
        prompt: "<b>¿Cuándo fue la última vez que tuviste algún tipo de actividad sexual (coito o masturbación)?</b>",
        options: [
            "1. Hace menos de 24 horas",
            "2. Dentro de los últimos 3 días",
            "3. Dentro de la última semana",
            "4. Dentro del último mes",
            "5. Dentro del último año",
            "6. Hace más de un año",
        ],
        name: "SexualActivity",
        required: false,
    },
    {
        prompt: "<b>¿Cómo describirías tu orientación sexual?</b>",
        options: ["Heterosexual", "Bisexual", "Homosexual", "Otro"],
        name: "Orientación Sexual",
        required: false,
    },
]

// =========================================================================================
// Demographics
// =========================================================================================

var consent_text = // Logo and title
    "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
    "<h1>Consentimiento informado</h1>" +
    // Overview
    "<p align='left'><b>Invitación para participar</b><br>" +
    "Le invitamos a participar en un estudio de investigación para mejorar nuestra comprensión del impacto de las nuevas tecnologías. Gracias por leer atentamente esta hoja informativa. Este estudio está siendo liderado por el Dr. Dominique Makowski de la Universidad de Sussex, quien estará encantado de poder ser contactado (D.Makowski@sussex.ac.uk) si tiene alguna pregunta.</p>" +
    // Description
    "<p align='left'><b> ¿Por qué me han invitado y qué haré?</b><br>" +
    " Estamos investigando cómo las nuevas tecnologías pueden afectar los hábitos y comportamientos relacionados con la pornografía. En este estudio, se le mostrarán <b>imágenes eróticas</b>, así que asegúrese de encontrarse en un <b>entorno privado</b> durante todo el experimento(~25min).</p>" +
    // Results and personal information
    "<p align='left'><b> ¿Qué pasará con los resultados y con mi información personal?</b><br>" +
    "Los resultados de esta investigación podrán plasmarse en una publicación científica. Su anonimato estará garantizado de la manera descrita en la información de consentimiento a continuación. Lea esta información detenidamente y luego, si desea participar, reconozca que ha entendido completamente esta hoja y que acepta participar en el estudio como se describe aquí.</p>" +
    "<p align='left'><b>Consentimiento</b><br></p><ul>" +
    // Bullet points
    "<li align='left'> Entiendo que al firmar a continuación acepto participar en la investigación de la Universidad de Sussex que se describe aquí y que he leído y comprendido esta hoja informativa. </li>" +
    "<li align='left'> Entiendo que mi participación es totalmente voluntaria, que puedo elegir no participar en parte o en todo el estudio y que puedo retirarme en cualquier etapa sin tener que dar una razón y sin ser penalizado de ninguna manera (por ejemplo, si soy estudiante, mi decisión de participar o no no penalizará mis calificaciones).</li>" +
    "<li align='left'> Entiendo que al ser el estudio anónimo será imposible retirar mis datos una vez haya completado y enviado el test/cuestionario.</li>" +
    "<li align='left'>Entiendo que mis datos personales serán utilizados para los fines de este estudio de investigación y serán tratados de acuerdo con la legislación de Protección de Datos. Entiendo que el Aviso de Privacidad de la Universidad proporciona más información sobre cómo la Universidad utiliza datos personales en sus investigaciones.</li>" +
    "<li align='left'> Entiendo que mis datos recopilados se almacenarán de forma anónima. Los datos no identificados pueden ponerse a disposición del público a través de depósitos de datos científicos seguros en línea.</li>" +
    // Consideraciones Éticas
    "<li align='left'> Entiendo que se me mostrará material potencialmente sensible (imágenes eróticas), por lo que confirmo que soy mayor de 18 años.</li>" +
    "</ul></p>" +
    // "<p align='left'> Su participación en esta investigación se mantendrá completamente confidencial. Sus respuestas son completamente anónimas y no se recopila ninguna dirección IP ni ningún identificador.</p>" +
    // "<p align='left'><b> Al participar, acepta seguir las instrucciones y proporcionar respuestas honestas.</b> Si no desea participar en esta encuesta, simplemente cierre su navegador.</p>" +
    // "<p> Tenga en cuenta que se realizarán varias comprobaciones para garantizar la validez de los datos.<br>Nos reservamos el derecho de devolverle su participación o un reembolso prorrateado si detectamos respuestas no válidas (por ejemplo, patrón aleatorio de respuestas, instrucciones no leídas, . ..).</p>"
    "<p align='left'>Para obtener más información sobre esta investigación, o si tiene alguna inquietud, comuníquese con el Dr Antonio Olivera-La Rosa (antonio.oliverade@amigo.edu.co). Esta investigación ha sido aprobada (ER/MHHE20/2) por el consejo de ética. La Universidad de Sussex cuenta con un seguro para cubrir sus responsabilidades legales con respecto a este estudio.</p>"

var consent_button = " Tengo más de 18 años y leo, entiendo y doy mi consentimiento a lo anterior."

var fullscreen_text =
    "<p> El experimento cambiará al modo de pantalla completa cuando presione el botón a continuación</p>"
var fullscreen_button = "Continúa"

// -------------------------
var button_continue = "Continúa"
var button_end = "Fin"

var demographics1_preamble = "<b>Por favor, contesta las siguientes preguntas:</b>"
var demographics_q_sex = "¿Cual es tu sexo biológico?"
var demographics_c_sex = ["Masculino", "Femenino", "Otro"]
var demographics_q_edu = "¿Cual es tu máximo nivel de estudios alcanzado?"
var demographics_c_edu = [
    "Universidad (Doctorado)",
    "Universidad (master) <sub><sup>o equivalente/sup></sub>",
    "Universidad (bachelor) <sub><sup>o equivalente</sup></sub>",
    "Instituto  <sub><sup>o equivalente</sup></sub>",
    "Primarios",
    "Otros",
]
var demographics_q_age = "Escribe tu edad en años"
var demographics_p_age = "p.e., '31'"
var demographics_q_eth = "Escribe tu etnicidad"
var demographics_p_eth = "p.e., caucásico"
var demographics_q_cou = "¿En qué país vives?"
var demographics_p_cou = "p.e., España"
var demographics_q_lang = "<b>¿Cúal dirías que es tu nivel de castellano?</b>"
var demographics_c_lang = ["Principiante - 0", "1", "2", "3", "4", "5", "6 - Nativo"]
var demographics_q_ai =
    "<b>¿En qué medida te consideras conocedor sobre la tecnología de Inteligencia Artificial (IA)?</b>"
var demographics_c_ai = ["Nada - 0", "1", "2", "3", "4", "5", "6 - Experto"]
var demographics_hormones_preamble =
    "<b>La siguiente pregunta es importante para entender el papel de los posibles factores biológicos en nuestro estudio.</b><br>Sin embargo, es opcional y puedes omitirla si lo deseas."
var demographics_q_hormones =
    "Si eres mujer, ¿estás utilizando actualmente algún tratamiento anticonceptivo?"
var demographics_c_hormones = [
    "No",
    "Sí - píldoras anticonceptivas (píldoras combinadas)",
    "Sí - píldoras anticonceptivas (píldoras solo de progestágeno)",
    "Sí - dispositivo intrauterino (DIU de cobre)",
    "Sí - sistema intrauterino (SIU)",
    "Sí - condones femeninos",
    "Sí - condones para la pareja",
    "Sí - otro",
]
