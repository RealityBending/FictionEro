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
    "<h1>Istruzioni</h1>" +
    // Left aligned text
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'> In questo studio, vogliamo validare il nostro nuovo <b>algoritmo di generazione di immagini</b> (basato su un nuovo tipo di Generative Adversarial Network - GAN) addestrato a produrre contenuti erotici (ma anche non erotici) di alta qualità.</p>" +
    "Nel compito che svolgerai, ti saranno presentate delle immagini sia erotiche che non erotiche generate dal nostro algoritmo (precedute dalla parola '<b style='color:" +
    color_cues["Fiction"] +
    "'>Generata con IA </b>'), inframmezzate da fotografie reali (precedute dalla parola '<b style='color:" +
    color_cues["Reality"] +
    "'>Fotografia</b>') provenienti da database di immagini pubblici.</p > " +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'> Dopo ogni immagine, ti sarà chiesto di esprimere un giudizio sulla scala seguente:</p>" +
    "<ul style='text-align: left; margin-left: 30%; margin-right: 30%;'>" +
    // Arousal: embodied
    "<li><b>Eccitante</b>: Quanto trovi l'immagine sessualmente eccitante. Questa domanda riguarda la <i>reazione soggettiva</i> che percepisci nel tuo corpo quando vedi l'immagine.</li>" +
    // Appeal: "objective"
    "<li><b>Attraente</b>: Quanto trovi che questa immagine sia sessualmente attraente in generale. Immagina quanto una persona con il tuo stesso genere e orientamento sessuale troverebbe attraente questa immagine. </li>" +
    // Emotional Valence
    "<li><b>Valenza</b>: L'immagine suscita in te sensazioni positive e piacevoli (non necessariamente sessuali) oppure negative e spiacevoli? Pensa a quanto è stato gradevole (o sgradevole) osservare l'immagine</li></ul>" +
    // Contrasting explanation
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Anche se talvolta le risposte a queste scale potranno essere molto simili, in altri casi possono variare a seconda dell'osservatore, dell'immagine e del contesto. Per esempio, potremmo essere eccitati da un'immagine che probabilmente potremmo non ritenere universalmente piacevole. Viceversa, un'immagine \"obiettivamente\" attraente potrebbe, per una ragione o per un'altra, non suscitare nel nostro corpo nessuna reazione.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'><b>Prova a prestare attenzione a ciò che succede dentro la tua testa e nel tuo corpo mentre osservi le immagini così da rispondere con precisione sulla base delle tue sensazioni e reazioni.</b></p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Inoltre, siccome alcune immagini non sono erotiche, potrebbe sembrare strano pensare a quanto le ritieni eccitanti. Non preoccuparti, è normale. <b>Non ci sono risposte giuste o sbagliate</b>: ascolta semplicemente il tuo corpo e prova a rispondere al meglio delle tue possibilità sulle base di ciò che provi.</p>"

var text_instructions2 =
    "<h1>Ottimo!</h1>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Molte grazie. Nella prossima fase vorremmo sapere se hai trovato il nostro <b>algoritmo di generazione delle immagini convincente</b> e privo di errori.</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Ti presenteremo rapidamente un'ultima volta <b>tutte le immagini</b> (sia quelle generate con IA che le fotografie) e dovrai giudicarle in base a quanto l'immagine sembri <b>reale</b> (quanto è realistica, quanto sembra una fotografia).</p>" +
    "<p style='text-align: left; margin-left: 30%; margin-right: 30%;'>Ci interessano le tue impressioni generali e le tue sensazioni a pelle riguardo al fatto che l'immagine sia artificiale oppure no.</p>"

//-------------------------
var text_instructionsbutton = "Iniziamo!"

// -------------------------

var text_cue = { Reality: "Fotografia", Fiction: "AI-generated" }

// -------------------------
var text_instructions_questionnaires =
    "<p><b>Grazie</b><br>Ora per favore rispondi ad alcune domande su di te.</p>"

// Ratings ----------------------------------------------------------------
var text_ticks = ["Per niente", "Moltissimo"]
var text_ticks_valence = ["Spiacevole", "Piacevole"]
var text_rating_appeal = "Quanto giudichi <b>attraente</b> questa immagine?"
var text_rating_arousal = "Quanta <b>eccitazione sessuale</b> provi?"
var text_rating_valence = "La <b>sensazione</b> suscitata dall'immagine era..."
var text_rating_realness = "Quanto era <b>realistica</b> quest'immagine?"

// -------------------------
var text_feedback1 =
    "<h1>Grazie!</h1>" +
    "<p>Prima di terminare, ci piacerebbe sapere cosa  ne pensi dell'esperimento. Per favore, spunta tutte le considerazioni che condividi:</p>"
var text_feedback1_items = [
    "È stato divertente ",
    "È stato noioso",
    "Ero in grado di dire quali immagini fossero fotografie e quali fossero generate dall'IA",
    "Non ho percepito nessuna differenza tra le fotografie e le immagini generate dall'IA",
    "Mi è parso che le immagini generate dall'IA fossero più eccitanti delle fotografie",
    " Mi è parso che le immagini generate dall'IA fossero meno eccitanti delle fotografie",
    "Mi è parso che le etichette (‘fotografia' e ‘generata dall'IA') non fossero sempre veritiere",
    " Mi è parso che le etichette fossero invertite (‘fotografia' per le immagini generate dall'IA e viceversa)",
    "Alcune immagini erano davvero eccitanti",
    "Non ho provato davvero niente nel guardare le immagini",
]

var text_feedback2 = "Hai altri commenti o feedback?"
var text_feedback2_placeholder = "Scrivili qui"

// -------------------------
var text_debriefing =
    "<h2>Debriefing</h2>" +
    "<p align='left'> Il vero scopo di questo studio era quello di studiare l'effetto di <i>credere</i> che un contenuto sia generato dall'IA sull'eccitazione sessuale " +
    "Vogliamo testare l'ipotesi che credere che certe immagini erotiche siano false diminuisca l'eccitazione sessuale. " +
    "Dal momento che a interessarci sono soprattutto le <i>credenze</i> sulla realtà veridicità delle immagini, tutte le immagini sono state in realtà ottenute da un database di immagini impiegato in psicologia per studiare le emozioni." +
    "Ci scusiamo per l'inevitabile inganno contenuto nelle nostre istruzioni e speriamo che tu ne comprenda il senso al fine di garantire la validità dell'esperimento.</p>" +
    "<p align='left'><b>Grazie ancora!</b> La tua partecipazione in questo studio verrà mantenuta riservata. Se hai dubbi o domande sul progetto, contatta D.Makowski@sussex.ac.uk oppure marco.viola@uniroma3.it.</p>" +
    "<p>Per completare la tua partecipazione a questo studio, clicca su 'Continua' e <b>attendi finché le tue risposte sono state salvate</b> prima di chiudere la scheda.</p> "

var text_endscreen = function (
    link = "https://realitybending.github.io/FictionEro/experiment/english?exp=snow&lang=it" //*** OR NOT???
) {
    return (
        "<h1>Grazie per la tua partecipazione</h1>" +
        "<p>Significa molto per noi. Non esitare a condividere lo studio mandando questo link <i>(ma per favore non svelare i dettagli dell'esperimento)</i>:</p>" +
        "<p><a href='" +
        link +
        "'>" +
        link +
        "<a/></p>" +
        "<p><b>Ora puoi chiudere la scheda.</b></p>"
    )
}

// =========================================================================================
// Questionnaires
// =========================================================================================

var bait_instructions =
    "<h2>A proposito di IA...</h2>" +
    "<p>Ci piacerebbe sapere cosa ne pensi sull'Intelligenza Artificiale (IA).<br>" +
    "Per favore leggi con attenzione le seguenti affermazioni e indica quanto concordi con ciascuna di esse.</p>"

// General Attitudes towards Artificial Intelligence Scale (GAAIS; Schepman et al., 2020, 2022)
// We used the most loaded items from Schepman et al. (2023) - loadings from the 2 CFAs are in parentheses
// We adedd items specifically about CGI and artificial media (BAIT)
var bait_items = [
    // Neg3 (0.406, 0.405) - Low loadings
    // "Le aziende possono fare un uso immorale dell'Intelligenza Artificiale",
    // Neg9 (0.726, 0.717) - Not used in FakeFace
    "L'Intelligenza Artificiale può prendere il controllo delle persone",
    // Neg10 (0.850, 0.848) - Modified: removed "I think"
    "L'Intelligenza artificiale è pericolosa",
    // Neg15 (1.014, 0.884) - Not used in FakeFace. Modified: replaced "I shiver with discomfort when I think about" by "I am worried about"
    "Mi preoccupano le applicazioni future dell'Intelligenza Artificiale",
    // Pos7 (0.820, 0.878)
    "Ho interesse a usare sistemi di intelligenza artificiale nella mia vita quotidiana",
    // Pos12 (0.734, 0.554)
    "L'intelligenza artificiale è eccitante",
    // Pos14 (0.516, 0.346) - Low loadings
    // "Ci somo molte applicazioni positive dell'Intelligenza Artificiale",
    // Pos17 (0.836, 0.656) - Not used in FakeFace
    "Buona parte della società trarrà benefici da un futuro pieno di Intelligenza Artificiale",

    // New items (Beliefs about Artificial Images Technology - BAIT) ---------------------------
    // Revised from Makowski et al. (Fake Face study)
    // Changes from FakeFace: remove "I think"
    "Gli algoritmi di Intelligenza Artificiale attualmente in circolazione possono generare immagini molto realistiche",
    "Le immagini di volti o persone generate dall'Intelligenza Artificiale contengono sempre errori e imperfezioni",
    "I video generati dall'Intelligenza Artificiale presentano problemi evidenti che rendono facile individuare che sono falsi",
    "Gli algoritmi di Intelligenza Artificiale attualmente in circolazione possono generare video molto realistici",
    "Le Immagini Generate al Computer (CGI) possono imitare perfettamente la realtà",
    "La tecnologia consente la creazione di ambienti che sembrano altrettanto reali della realtà stessa", // New
    "Gli assistenti di Intelligenza Artificiale possono scrivere testi indistinguibili da quelli scritti da esseri umani", // New
    "I documenti e le frasi scritti dall'Intelligenza Artificiale tendono a sembrare diversi dalle produzioni umane", // New
]

var bait_ticks = ["Non sono d'accordo", "Sono d'accordo"] // In Schepman et al. (2022) they removed 'Strongly'

// --------------------------------------------------------------------------------
// Hatch, S. G., Esplin, C. R., Hatch, H. D., Halstead, A., Olsen, J., & Braithwaite, S. R. (2023). The consumption of pornography scale–general (COPS–G). Sexual and Relationship Therapy, 38(2), 194-218.
var cops_instructions =
    "<h2>A proposito di pornografia...</h2>" +
    "<p style='text-align: left;'> Data la natura del nostro studio, siamo interessati a comprendere le tue abitudini in termini di esposizione alla pornografia. Per favore, rispondi alle domande seguenti.</p>"

var cops_items = [
    // {
    //     prompt: "<b>1. Quanto spesso hai guardato pornografia nell'ultimo anno?</b>",
    //     options: [
    //         "0. Non ho guardato pornografia nell'ultimo anno",
    //         "1. Ho guardato pornografia una volta nell'ultimo anno",
    //         "2. Ho guardato pornografia circa una volta ogni sei mesi",
    //         "3. Ho guardato pornografia circa ogni mese",
    //         "4. Ho guardato pornografia settimanalmente",
    //         "5. Ho guardato pornografia più volte alla settimana",
    //         "6. Ho guardato pornografia quotidianamente",
    //     ],
    //     name: "COPS_Frequency_1",
    //     required: false,
    // },
    {
        prompt: "<b>2. Quanto spesso hai guardato pornografia negli ultimi 30 giorni?</b>",
        options: [
            "0. Non ho guardato pornografia negli ultimi 30 giorni",
            "1. Ho guardato pornografia una volta negli ultimi 30 giorni",
            "2. Ho guardato pornografia due volte negli ultimi 30 giorni",
            "3. Ho guardato pornografia settimanalmente",
            "4. Ho guardato pornografia più volte alla settimana",
            "5. Ho guardato pornografia giornalmente",
            "6. Ho guardato pornografia più volte al giorno",
        ],
        name: "COPS_Frequency_2",
        required: false,
    },
    // {
    //     prompt: "<b>3. Quanto spesso hai guardato pornografia negli ultimi 7 giorni?</b>",
    //     options: [
    //         "0. Non ho guardato pornografia negli ultimi 7 giorni",
    //         "1. Ho guardato pornografia una volta negli ultimi 7 giorni",
    //         "2. Ho guardato pornografia due volte negli ultimi 7 giorni",
    //         "3. Ho guardato pornografia ogni giorno degli ultimi 7 giorni",
    //         "4. Ho guardato pornografia più volte al giorno negli ultimi 7 giorni",
    //     ],
    //     name: "COPS_Frequency_3",
    //     required: false,
    // },
    {
        prompt: "<b>4. Quando guardo pornografia, la guardo per...</b>",
        options: [
            "1. Meno di 5 minuti",
            "2. Da 6 a 15 minuti",
            "3. Da 16 a 25 minuti",
            "4. Da 26 a 35 minuti",
            "5. Da 36 a 45 minuti",
            "6. 46+ minuti",
        ],
        name: "COPS_Duration_1",
        required: false,
    },
    // {
    //     prompt: "<b>5. Quando visito un sito web pornografico, lo visito per...</b>",
    //     options: [
    //         "1. Meno di 5 minuti",
    //         "2. Da 6 a 15 minuti",
    //         "3. Da 16 a 25 minuti",
    //         "4. Da 26 a 35 minuti",
    //         "5. Da 36 a 45 minuti",
    //         "6. 46+ minuti",
    //     ],
    //     name: "COPS_Duration_2",
    //     required: false,
    // },
    // {
    //     prompt: "<b>6. L'ultima volta che ho guardato pornografia, l'ho guardata per...</b>",
    //     options: [
    //         "1. Meno di 5 minuti",
    //         "2. Da 6 a 15 minuti",
    //         "3. Da 16 a 25 minuti",
    //         "4. Da 26 a 35 minuti",
    //         "5. Da 36 a 45 minuti",
    //         "6. 46+ minuti",
    //     ],
    //     name: "COPS_Duration_3",
    //     required: false,
    // },
    // Extra questions ------------------------------------------
    {
        prompt: "<b>Quando è stata l'ultima volta che hai partecipato a qualsiasi tipo di attività sessuale (rapporto o masturbazione)?</b>",
        options: [
            "1. Meno di 24 ore fa",
            "2. Nei ultimi 3 giorni",
            "3. Nella scorsa settimana",
            "4. Nel corso dell'ultimo mese",
            "5. Nel corso dell'ultimo anno",
            "6. Più di un anno fa",
        ],
        name: "SexualActivity",
        required: false,
    },
    {
        prompt: "<b>Come descriveresti il tuo orientamento sessuale?</b>",
        options: ["Eterosessuale", "Bisessuale", "Omosessuale", "Altro"],
        name: "SexualOrientation",
        required: false,
    },
]

// =========================================================================================
// Demographics
// =========================================================================================

var consent_text = // Logo and title
    "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
    "<h1>Consenso Informato</h1>" +
    // Overview
    "<p align='left'><b>Invito a Partecipare</b><br>" +
    "Ti stiamo invitando a partecipare ad una ricerca scientifica volta a comprendere l'impatto delle nuove tecnologie. Ti chiediamo cortesemente di leggere attentamente questo foglio informativo. Lo studio è condotto dal Dr. Dominique Makowski dell'Università di Sussex (D.Makowski@sussex.ac.uk) assieme al Dr. Marco Viola dell'Università di Roma Tre (marco.viola@uniroma3.it). Puoi contattarli se hai domande.</p>" +
    // Description
    "<p align='left'><b>Perché questo invito e cosa devo fare?</b><br>" +
    "Stiamo indagando come le nuove tecnologie possono influenzare le abitudini e i comportamenti legati alla pornografia. In questo studio, ti verranno mostrate <b>immagini erotiche</b>, quindi assicurati di trovarti in un ambiente <b>privato</b> per tutta la durata dell'esperimento (circa 20 minuti).</p>" +
    // Results and personal information
    "<p align='left'><b>Cosa accadrà ai risultati e alle mie informazioni personali?</b><br>" +
    "I risultati di questa ricerca potrebbero essere inclusi in una pubblicazione scientifica. Il tuo anonimato sarà garantito come descritto di seguito. Leggi attentamente queste informazioni e, se desideri partecipare, conferma di aver compreso appieno questo foglio e acconsenti a partecipare allo studio come descritto qui.</p>" +
    "<p align='left'><b>Consenso</b><br></p><ul>" +
    // Bullet points
    "<li align='left'>Comprendo che firmando qui sotto acconsento a partecipare alla ricerca dell'Università di Sussex descritta qui e che ho letto e compreso questo foglio informativo.</li>" +
    "<li align='left'>Comprendo che la mia partecipazione è completamente volontaria, posso scegliere di non partecipare a tutto lo studio o a parte di esso e posso ritirarmi in qualsiasi momento senza dover fornire spiegazioni né ricevere alcuno svantaggio (ad es., la mia decisione se partecipare o meno non influirà sui miei voti se sono uno studente).</li>" +
    "<li align='left'>Comprendo che poiché lo studio è anonimo, sarà impossibile ritirare i miei dati una volta completato e inviato il test/questionario.</li>" +
    "<li align='left'>Comprendo che i miei dati personali saranno utilizzati per gli scopi di questa ricerca e saranno gestiti in conformità con la legislazione sulla protezione dei dati. Comprendo che l'Informativa sulla privacy dell'Università fornisce ulteriori informazioni su come l'Università utilizza i dati personali nella ricerca.</li>" +
    "<li align='left'>Comprendo che i dati raccolti saranno conservati in modo de-identificato. I dati de-identificati potrebbero essere resi pubblicamente disponibili tramite repository di dati scientifici online sicuri.</li>" +
    // Ethical managements
    "<li align='left'>Comprendo che mi verrà mostrato materiale potenzialmente sensibile (immagini erotiche) e confermo quindi di avere più di 18 anni.</li>" +
    "</ul></p>" +
    "<p align='left'>Per ulteriori informazioni su questa ricerca o se hai domande, contatta il Dr. Dominique Makowski (D.Makowski@sussex.ac.uk) e/o il Dr. Marco Viola dell'Università di Roma Tre (marco.viola@uniroma3.it). Questa ricerca è stata approvata (ER/NR274/1) dalla School of Psychology dell'Università del Sussex. L'Università di Sussex ha un'assicurazione in vigore per coprire le responsabilità legali relative a questo studio.</p>"

var consent_button = "Ho più di 18 anni, ho letto, compreso e acconsento a quanto sopra"

var fullscreen_text =
    "<p>L'esperimento passerà alla modalità a schermo intero appena premerai il pulsante qui sotto</p>"
var fullscreen_button = "Continua"
