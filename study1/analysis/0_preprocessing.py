import json
import os

import numpy as np
import pandas as pd

# Loop through files ======================================================
# Initialize empty dataframes
alldata = pd.DataFrame()
alldata_subs = pd.DataFrame()
norm_data = pd.read_csv("../experiment/stimuli_selection/stimuli_data.csv").rename(
    columns={
        "ID": "Item",
        "JPEG_size80": "Complexity",
        "LABA": "Red",
        "LABB": "Green",
        "Luminance": "Luminance2",
        "LABL": "Luminance",
    }
)

# Get files from local directory ==========================================
path = "C:/Users/asf25/Box/FictionEro1/"
files = os.listdir(path)
after_date = pd.to_datetime("2024-01-19")  # Date after which files were added
cutoff_date = pd.to_datetime("2024-06-01")  
skipped_files = []

# Convert list of dicts into a DataFrame
new_data = pd.DataFrame()
for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}, file: {file}") 

    data = pd.read_csv(path + file)
    filename = file.replace(".csv", "")

    # Participant ========================================================
    # data["screen"].unique()

    # Browser info -------------------------------------------------------
    browser = data[data["screen"] == "browser_info"].iloc[0]

    # Skip participants with no language column 
    if "language" not in browser.index:
        print(f"Skipping {filename}: no language column")
        skipped_files.append({"filename": filename, "date": browser["date"]})
        continue

    # Experimenter
    experimenter = browser["researcher"]
    if experimenter in ["TEST", "jc"]:
        continue
    if isinstance(experimenter, float):
        if np.isnan(experimenter):
            experimenter = "Unknown"
        else:
            experimenter = "Experimenter" + str(int(experimenter))
    experimenter = "Readme (GitHub)" if experimenter in ["readme"] else experimenter
    experimenter = "RISC" if experimenter in ["risc"] else experimenter
    experimenter = "Snowball" if experimenter in ["snow", "snow〈"] else experimenter
    experimenter = "SONA" if experimenter in ["sona"] else experimenter

    lang = "English" if browser["language"] == "en" else browser["language"]
    lang = "Italian" if lang == "it" else lang
    lang = "French" if lang == "fr" else lang
    lang = "Colombian" if lang == "co" else lang
    lang = "Spanish" if lang == "es" else lang
    if lang not in ["English", "Italian", "French"]:
        sex = json.loads(data[data["screen"] == "demographics_1"].iloc[0]["response"])
        if sex["Sex"] in ["Male", "Female", "Other"]:  # Fix
            lang = "English"

    df = pd.DataFrame(
        {
            "Participant": filename,
            "Experimenter": experimenter,
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Language": lang,
            # "Date_OSF": file["date"],
            "Date": browser["date"],
            "Time": browser["time"],
            "Browser": browser["browser"],
            "Mobile": browser["mobile"],
            "Platform": browser["os"],
            "Screen_Width": browser["screen_width"],
            "Screen_Height": browser["screen_height"],
        },
        index=[0],
    )

    df["SONA_ID"] = np.nan
    if "sona_id" in browser.index:
        if np.isnan(browser["sona_id"]) == False:
            id = int(browser["sona_id"])
            df["SONA_ID"] = id

    # Demographics -------------------------------------------------------
    demo1 = data[data["screen"] == "demographics_1"].iloc[0]
    demo1 = json.loads(demo1["response"])
    demo2 = data[data["screen"] == "demographics_2"].iloc[0]
    demo2 = json.loads(demo2["response"])
    demo3 = data[data["screen"] == "demographics_other"].iloc[0]
    demo3 = json.loads(demo3["response"])

    age = int(demo2["Age"])
    if age < 18:
        continue
    if age > 100:
        age = np.nan
    df["Age"] = age
    sex = (
        "Male" if demo1["Sex"] in ["Maschio", "Masculin", "Masculino"] else demo1["Sex"]
    )
    sex = "Female" if sex in ["Femmina", "Féminin", "Femenino"] else sex
    sex = "Other" if sex in ["Autre", "Altro"] else sex
    df["Sex"] = sex
    df["Language_Level"] = demo3["Language_Level"]
    df["AI_Knowledge"] = demo3["AI_Knowledge"]

    # Education
    edu = demo1["Education"]
    edu = (
        "Bachelor"
        if any([x in edu for x in ["bachelor", "laurea triennale", "licence"]])
        else edu
    )
    edu = "Master" if any([x in edu for x in ["master", "laurea magistrale"]]) else edu
    edu = (
        "Doctorate"
        if any([x in edu for x in ["doctorate", "dottorato", "doctorat", "Doctorado"]])
        else edu
    )
    edu = (
        "High School"
        if any(
            [
                x in edu
                for x in ["High school", "Scuola superior", "Baccalauréat", "Instituto"]
            ]
        )
        else edu
    )
    edu = (
        "Primary School"
        if any([x in edu for x in ["Primary school", "École primaire", "dell'obbligo"]])
        else edu
    )
    edu = (
        "Other"
        if any([x in edu for x in ["Autre", "Altro", "Other", "Otros"]])
        else edu
    )
    df["Education"] = edu

    # Country
    country = demo2["Country"].title().rstrip()
    country = (
        "UK"
        if country
        in ["Uk", "England", "United Kingdom", "Brighton", "Uk, England", "Uk,"]
        else country
    )
    country = (
        "Netherlands" if country in ["The Netherlands", "Paesi Bassi"] else country
    )
    country = "Spain" if country in ["España", "Spagna"] else country
    country = "Colombia" if country in ["Medellin"] else country
    country = "Germany" if country in ["German", "Germania"] else country
    country = "Czech Republic" if country in ["Czechia"] else country
    country = "Pakistan" if country in ["Pk"] else country
    country = "Italy" if country in ["Italia"] else country
    country = "Belgium" if country in ["Belgique"] else country
    country = "Thailand" if country in ["Th"] else country
    country = "France" if country in ["Francia"] else country
    country = "Turkey" if country in ["Turkish"] else country
    country = (
        "USA"
        if country
        in [
            "USa",
            "Usa",
            "U.S.",
            "United States",
            "United States Of America",
            "Stati Uniti D’America",
            "Us,Texas",
            "Us",
            "United States Of American",
        ]
        else country
    )
    country = np.nan if country in ["", "Na", "E.G. Europe", "N", "At"] else country
    df["Country"] = country

    # Ethnicity
    race = demo2["Ethnicity"].title().rstrip().lstrip()
    race = (
        "Caucasian"
        if race
        in [
            "White",
            "Norwegian",
            "European",
            "White Australian",
            "British - White",
            "Scandinavian",
            "Latin White",
            "White Caucasian",
            "White Other",
            "White- European",
            "Causcian",
            "Caucaisan",
            "Caucasici",
            "Europoide",
            "Romanian",
            "Polish",
            "Mediterranian Caucasian",
            "White/European Descent",
            "Bianca/Caucasica (Europa Mediterranea)",
            "Russian",
            "Greek",
            "Causasian",
            "English",
            "Germans",
            "White Slavic European",
            "White British",
            "White Britiush",
            "White/Romanian",
            "White/Caucasian",
            "White - Irish",
            "Italiana",
            "Caucasico",
            "Caucasica",
            "Caucasien",
            "Caucasienne",
            "Cacasien",
            "Français",
            "Caucasien / Française",
            "Européen",
            "Caucasion",
            "Caucasian/White",
            "Française",
            "Francais",
            "European White",
            "Italico",
            "White (Us American)",
            "British",
            "German",
            "Bianca? (Non Sono Sicura Sulla Definizione Di Etnia)",
            "Bianco",
            "Moldave",
            "Eurasienne",
            "Europea",
            "Caucásico",
            "Cacucasico",
            "Blanco",
            "Blanca",
            "Spagnola",
            "Entièrement Français D'Origine Depuis Plus D'Un Siècle",
            "Auvergnat",
            "Serbian",
            "Ukrainian",
            "White - Other",
        ]
        else race
    )

    race = (
        "Asian"
        if race
        in [
            "Southeast Asian",
            "East Asian",
            "Chinese",
            "Asian-American",
            "Asian British",
            "Any Other Asian Background",
            "Asian, Chinese",
            "British Asian",
        ]
        else race
    )
    race = (
        "Hispanic"
        if race
        in [
            "Latino",
            "Latin",
            "Mexican",
            "Mestizo",
            "Mestiza",
            "Hispano",
            "Colombiana",
            "Brazilian",
            "Medellín",
            "Antioqueño",
            "Antioqueña",
            "Guarseño",
            "Paisa",
            "Latina",
            "Manizales",
        ]
        else race
    )
    race = (
        "South Asian"
        if race in ["Indian", "Brown", "Srilankan", "Pakistani", "Bengali"]
        else race
    )
    race = (
        "African"
        if race
        in [
            "Black African",
            "Black British",
            "African",
            "Black Caribbean",
            "African American",
            "Black African Caribbean",
            "Black,",
            "Franco-Africain",
            "Negra",
            "Negro",
            "Afrodescendiente",
            "Nigerian",
            "Moreno",
            "Raizal",
            "Sudanese",
        ]
        else race
    )
    race = (
        "Mixed"
        if race
        in [
            "Latin American X Asian",
            "White And Black Caribbean",
            "White, Hispanic",
            "White/Arabic",
            "White Filipino",
            "Mixed White/Latino",
            "Afro-Mediterranean",
            "Mixed British Asian",
            "Mixed Caucasian/Asian",
            "Mixed White And Asian",
            "Mixed Asian American",
            "Afrocolombiano",
            "Afrocolombinao",
            "Asain White Half N Half",
            "Indígenas Y Africanos",
            "Mulato",
            "Afrocolombiana",
            "Mélange Caucasien Et Latino-Américain",
        ]
        else race
    )
    race = "Mixed" if "mixed" in race.lower() else race

    race = (
        "Austronesian"
        if race
        in [
            "Javanese",
            "Polynesian",
            "Pacific Islander",
            "Batak",
            "Indonesian",
            "Filipino",
        ]
        else race
    )

    race = (
        "Middle Eastern"
        if race
        in [
            "Meditteranean",
            "Mediterranean",
            "Turkish",
            "Turk",
            "Turkey",
            "Arab",
            "Arabo",
            "Afrique Du Nord",
            "North African",
        ]
        else race
    )
    race = (
        "Other"
        if race
        in [
            "Native American",
            "Jewish",
            "Indigenous",
            "E.G.Caucasian",
            "Terrestre",
            "Kyrgyz",
            "Caldence",
        ]
        else race
    )
    race = (
        np.nan
        if race
        in [
            "",
            "Na",
            "Human",
            "Caucasian Is Not An Ethnicity",
            "E.G. Caucadian",
            "N/A",
            "No",
            "107615603",
            "Natural",
            "Normal",
            "No Aplica",
            "Ninguna",
            "No Pertenezco A Ninguna",
            "N/D",
            "Religioso",
            "Estudiante De Contaduria Publica",
            "Monteriana",
            "Neandertal, Caucasion",
            "German Sheperd",
        ]
        else race
    )
    df["Ethnicity"] = race

    # Female questions
    if "demographics_hormones" in data["screen"].unique():
        demo4 = data[data["screen"] == "demographics_hormones"].iloc[0]
        demo4 = json.loads(demo4["response"])
        birth = demo4["BirthControl"]
        birth = (
            "Intrauterine Device (IUD)"
            if any([x in birth for x in ["IUD", "DIU"]])
            else birth
        )
        birth = (
            "Intrauterine System (IUS)"
            if any([x in birth for x in ["IUS", "SIU", "coppetta intrauterina"]])
            else birth
        )
        birth = (
            "Combined pills"
            if any(
                [
                    x in birth
                    for x in ["combined pills", "combinées", "combinadas", "combinate"]
                ]
            )
            else birth
        )
        birth = (
            "Progestogen pills"
            if any(
                [
                    x in birth
                    for x in [
                        "progestogen-only",
                        "progestatif ",
                        "solo de progestágeno",
                        "solo progestinico",
                    ]
                ]
            )
            else birth
        )
        birth = (
            "Condoms (female)"
            if any([x in birth for x in ["préservatifs féminins"]])
            else birth
        )
        birth = (
            "Condoms (for partner)"
            if any(
                [
                    x in birth
                    for x in [
                        "for partner",
                        "du partenaire",
                        "pareja",
                        "per il partner",
                    ]
                ]
            )
            else birth
        )
        birth = (
            "Other"
            if any([x in birth for x in ["Yes - other", "Oui - autre", "Sí - otro"]])
            else birth
        )
        birth = "None" if any([x in birth for x in ["No", "Non"]]) else birth
        birth = np.nan if birth in [""] else birth
        df["BirthControl"] = birth

    else:
        df["BirthControl"] = np.nan

    # FICTION ------------------------------------------------------------
    fiction1 = data[data["screen"] == "fiction_ratings1"]
    fiction = pd.DataFrame({"Participant": [filename] * len(fiction1)})
    assert len(fiction1) == 60

    fiction["Item"] = fiction1["stimulus"].values
    fiction["Order1"] = range(1, len(fiction1) + 1)
    fiction["RT1"] = fiction1["rt"].values / 1000
    fiction["Condition"] = fiction1["condition"].values

    fiction_img1 = data[data["screen"] == "fiction_image1"]
    assert np.all(
        "stimuli/" + fiction["Item"].values == fiction_img1["stimulus"].values
    )
    fiction["Duration1"] = fiction_img1["trial_duration"].values
    fiction_cross1 = data[data["screen"] == "fiction_fixationcross1b"]
    fiction["ISI1"] = fiction_cross1["trial_duration"].values
    fiction_cue = data[data["screen"] == "fiction_cue"]
    fiction["Cue_Color"] = fiction_cue["color"].values
    fiction["Cue_Duration"] = fiction_cue["trial_duration"].values

    ratings1 = [json.loads(r) for r in fiction1["response"].values]
    fiction["Arousal"] = [r["Arousal"] for r in ratings1]
    fiction["Valence"] = [r["Valence"] for r in ratings1]
    fiction["Enticement"] = [r["Enticement"] for r in ratings1]

    fiction2 = data[data["screen"] == "fiction_ratings2"]
    fiction2_df = pd.DataFrame({"Item": fiction2["stimulus"].values})
    fiction2_df["Order2"] = range(1, len(fiction2) + 1)
    fiction2_df["RT2"] = fiction2["rt"].values / 1000

    fiction_img2 = data[data["screen"] == "fiction_image2"]
    assert np.all(
        "stimuli/" + fiction2_df["Item"].values == fiction_img2["stimulus"].values
    )
    fiction2_df["Duration2"] = fiction_img2["trial_duration"].values
    fiction_cross2 = data[data["screen"] == "fiction_fixationcross2"]
    fiction2_df["ISI2"] = fiction_cross2["trial_duration"].values

    ratings2 = [json.loads(r) for r in fiction2["response"].values]
    fiction2_df["Realness"] = [r["Realness"] for r in ratings2]
    assert len(fiction2_df) == len(fiction)

    fiction = pd.merge(fiction, fiction2_df, on="Item")

    # BAIT ---------------------------------------------------------------
    bait = data[data["screen"] == "questionnaire_bait"].iloc[0]

    df["BAIT_Duration"] = bait["rt"] / 1000 / 60

    bait = json.loads(bait["response"])
    for item in bait:
        df[item] = bait[item]

    # COPS ---------------------------------------------------------------
    cops = data[data["screen"] == "questionnaire_cops"].iloc[0]

    df["COPS_Duration"] = cops["rt"] / 1000 / 60
    cops = json.loads(cops["response"])

    # Sexual orientation
    if "SexualOrientation" in cops:
        sexorientation = cops["SexualOrientation"].rstrip()
    else:
        sexorientation = cops["Orientación Sexual"].rstrip()
    sexorientation = (
        "Heterosexual"
        if sexorientation in ["Hétérosexuel", "Eterosessuale"]
        else sexorientation
    )
    sexorientation = (
        "Homosexual"
        if sexorientation in ["Omosessuale", "Homosexuel"]
        else sexorientation
    )
    sexorientation = (
        "Bisexual" if sexorientation in ["Bisessuale", "Bisexuel"] else sexorientation
    )
    sexorientation = (
        "Other" if sexorientation in ["Altro", "Autre", "Otro"] else sexorientation
    )
    sexorientation = np.nan if sexorientation in [""] else sexorientation
    df["SexualOrientation"] = sexorientation

    sexactivity = cops["SexualActivity"].lower().rstrip()
    sexactivity = "1. Less than 24h ago" if "1." in sexactivity else sexactivity
    sexactivity = "2. Within the last 3 days" if "2." in sexactivity else sexactivity
    sexactivity = "3. Within the last week" if "3." in sexactivity else sexactivity
    sexactivity = "4. Within the last month" if "4." in sexactivity else sexactivity
    sexactivity = "5. Within the last year" if "5." in sexactivity else sexactivity
    sexactivity = "6. More than a year ago" if "6." in sexactivity else sexactivity
    sexactivity = np.nan if sexactivity in [""] else sexactivity
    df["SexualActivity"] = sexactivity

    copsfreq = cops["COPS_Frequency_2"].rstrip()
    copsfreq = (
        "0. I haven't viewed pornography in the past 30 days"
        if "0." in copsfreq
        else copsfreq
    )
    copsfreq = (
        "1. I viewed pornography once in the past 30 days"
        if "1." in copsfreq
        else copsfreq
    )
    copsfreq = (
        "2. I viewed pornography twice in the past 30 days"
        if "2." in copsfreq
        else copsfreq
    )
    copsfreq = "3. I viewed pornography weekly" if "3." in copsfreq else copsfreq
    copsfreq = (
        "4. I viewed pornography multiple times a week"
        if "4." in copsfreq
        else copsfreq
    )
    copsfreq = "5. I viewed pornography daily" if "5." in copsfreq else copsfreq
    copsfreq = (
        "6. I viewed pornography multiple times a day" if "6." in copsfreq else copsfreq
    )
    copsfreq = np.nan if copsfreq in [""] else copsfreq
    df["COPS_Frequency_2"] = copsfreq

    copsdur = cops["COPS_Duration_1"].rstrip()
    copsdur = "1. Less than 5 minutes" if "1." in copsdur else copsdur
    copsdur = "2. 6-15 minutes" if "2." in copsdur else copsdur
    copsdur = "3. 16-25 minutes" if "3." in copsdur else copsdur
    copsdur = "4. 26-35 minutes" if "4." in copsdur else copsdur
    copsdur = "5. 36-45 minutes" if "5." in copsdur else copsdur
    copsdur = "6. 46+ minutes" if "6." in copsdur else copsdur
    copsdur = np.nan if copsdur in [""] else copsdur
    df["COPS_Duration_1"] = copsdur

    # Feedback ---------------------------------------------------------
    feedback = data[data["screen"] == "fiction_feedback1"].iloc[0]
    feedback = json.loads(feedback["response"])["FeedbackChoice"]

    df["Feedback_Boring"] = False
    df["Feedback_Fun"] = False
    df["Feedback_CouldDiscriminate"] = False
    df["Feedback_CouldNotDiscriminate"] = False
    df["Feedback_AIMoreArousing"] = False
    df["Feedback_AILessArousing"] = False
    df["Feedback_LabelsIncorrect"] = False
    df["Feedback_LabelsReversed"] = False
    df["Feedback_Arousing"] = False
    df["Feedback_NoFeels"] = False

    for f in feedback:
        if any(x in f for x in ["boring", "noioso", "ennuyeux", "aburrí"]):
            df["Feedback_Boring"] = True
        if any(x in f for x in ["fun", "divertente", "amusé(e)", "divertí"]):
            df["Feedback_Fun"] = True
        if any(
            x in f
            for x in [
                "could tell",
                "in grado",
                "pouvais distinguer",
                "Pude identificar",
            ]
        ):
            df["Feedback_CouldDiscriminate"] = True
        if any(
            x in f
            for x in ["didn't see", "percepito alcuna", "pas vu", "No vi ninguna"]
        ):
            df["Feedback_CouldNotDiscriminate"] = True
        if any(
            x in f
            for x in [
                "more arousing",
                "più eccitanti",
                "plus excitantes",
                "más activantes",
            ]
        ):
            df["Feedback_AIMoreArousing"] = True
        if any(
            x in f
            for x in [
                "less arousing",
                "meno eccitanti",
                "moins excitantes",
                "menos activantes",
            ]
        ):
            df["Feedback_AILessArousing"] = True
        if any(
            x in f
            for x in ["not always", "non fossero", "pas toujours", "no fueron siempre"]
        ):
            df["Feedback_LabelsIncorrect"] = True
        if any(x in f for x in ["reversed", "viceversa", "inversées", "viceversa"]):
            df["Feedback_LabelsReversed"] = True
        if any(
            x in f
            for x in [
                "really arousing",
                "davvero eccitanti",
                "vraiment excitantes.",
                "realmente activantes",
            ]
        ):
            df["Feedback_Arousing"] = True
        if any(
            x in f
            for x in [
                "feel anything",
                "niente guardando",
                "rien ressenti",
                "no sentí nada",
            ]
        ):
            df["Feedback_NoFeels"] = True

    feedback = data[data["screen"] == "fiction_feedback2"].iloc[0]
    df["Feedback_Comments"] = json.loads(feedback["response"])["FeedbackFree"]

    # Merge with validation data ------------------------------------------
    if demo1["Sex"] == "Male":
        norms = norm_data.copy().rename(
            columns={"Men_Valence": "Norms_Valence", "Men_Arousal": "Norms_Arousal"}
        )
    else:
        norms = norm_data.copy().rename(
            columns={"Women_Valence": "Norms_Valence", "Women_Arousal": "Norms_Arousal"}
        )

    norms = norms[
        [
            "Item",
            "Type",
            "Category",
            "Orientation",
            "Norms_Arousal",
            "Norms_Valence",
            # These variables below are fairly uncorrelated (good)
            "Luminance",
            "Contrast",
            "Entropy",  # Greyscale entropy
            "Complexity",  # Overall complexity
            "Red",
            "Green",
        ]
    ]
    fiction = pd.merge(fiction, norms, on="Item")

    # Save data ----------------------------------------------------------
    alldata = pd.concat([alldata, fiction], axis=0, ignore_index=True)
    alldata_subs = pd.concat([alldata_subs, df], axis=0, ignore_index=True)

# ========================================================================
# Rename
alldata["Condition"] = alldata["Condition"].replace(
    {"Fiction": "AI-Generated", "Reality": "Photograph"}
)
alldata["Item"] = alldata["Item"].str.replace(".jpg", "")

# Remove duplicates ======================================================
dups = alldata_subs[~np.isnan(alldata_subs["SONA_ID"])]["SONA_ID"].duplicated()
alldata_subs[~np.isnan(alldata_subs["SONA_ID"])][dups]


# Inspect ================================================================
# alldata_subs["Experimenter"].unique()
# alldata_subs["Country"].unique()
# alldata_subs["Ethnicity"].unique()
# alldata_subs["Education"].unique()
# alldata_subs["BirthControl"].unique()


# Reanonimize ============================================================
# SONA
sona = alldata_subs[~np.isnan(alldata_subs["SONA_ID"])]
alldata_subs = alldata_subs.drop(columns=["SONA_ID"])

# ID
alldata_subs["d"] = pd.to_datetime(
    alldata_subs["Date"] + " " + alldata_subs["Time"], format="%d/%m/%Y %H:%M:%S"
)
alldata_subs = alldata_subs.sort_values(by=["d"]).reset_index(drop=True)
correspondance = {j: f"S{i+1:03}" for i, j in enumerate(alldata_subs["Participant"])}
alldata_subs["Participant"] = [correspondance[i] for i in alldata_subs["Participant"]]
alldata["Participant"] = [correspondance[i] for i in alldata["Participant"]]
# alldata_subs = alldata_subs.drop(columns=["Date_OSF", "d"])  # Drop OSf column
alldata_subs = alldata_subs.sort_values(by=["Participant"])
alldata = alldata.sort_values(by=["Participant", "Order1"])

# Save data ===============================================================
alldata.to_csv("../data/rawdata_task.csv", index=False)
alldata_subs.to_csv("../data/rawdata_participants.csv", index=False)
print("Done!")

# SONA check ================================================================
ids = list(np.sort(sona["SONA_ID"].astype(int).values))
30770 in ids