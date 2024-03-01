import json

import numpy as np
import pandas as pd


# Get files from OSF ======================================================
def osf_listfiles(data_subproject="", token="", after_date=None):
    try:
        import osfclient
    except ImportError:
        raise ImportError("Please install 'osfclient' (`pip install osfclient`)")
    osf = osfclient.OSF(token=token).project(data_subproject)  # Connect to project
    storage = [s for s in osf.storages][0]  # Access storage component
    files = [
        {
            "name": file.name.replace(".csv", ""),
            "date": pd.to_datetime(file.date_created),
            "url": file._download_url,
            "size": file.size,
            "file": file,
        }
        for file in storage.files
    ]

    if after_date is not None:
        date = pd.to_datetime(after_date, format="%d/%m/%Y", utc=True)
        files = [f for f, d in zip(files, [f["date"] > date for f in files]) if d]
    return files


token = "zYboMoukFI8HKabenQ35DH6tESHJo6oZll5BvOPma6Dppjqc2jnIB6sPCERCuaqO0UrHAa"  # Paste OSF token here to access private repositories
files = osf_listfiles(
    token=token,
    data_subproject="sm4jc",  # Data subproject ID
    after_date="19/01/2024",
)


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


for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}")

    if i > 0 and file["name"] in alldata_subs["Participant"].values:
        continue
    data = pd.read_csv(file["file"]._get(file["url"], stream=True).raw)

    # Participant ========================================================
    # data["screen"].unique()

    # Browser info -------------------------------------------------------
    browser = data[data["screen"] == "browser_info"].iloc[0]

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
            "Participant": file["name"],
            "Experimenter": experimenter,
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Language": lang,
            "Date_OSF": file["date"],
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

    df["Age"] = int(demo2["Age"])
    if df["Age"][0] < 18:
        continue
    sex = (
        "Male" if demo1["Sex"] in ["Maschio", "Masculin", "Masculino"] else demo1["Sex"]
    )
    sex = "Female" if sex in ["Femmina", "Féminin", "Femenino"] else sex
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
        "UK" if country in ["Uk", "England", "United Kingdom", "Brighton"] else country
    )
    country = "Netherlands" if country in ["The Netherlands"] else country
    country = "Spain" if country in ["España"] else country
    country = "Colombia" if country in ["Medellin"] else country
    country = "Germany" if country in ["German"] else country
    country = "Czech Republic" if country in ["Czechia"] else country
    country = "Pakistan" if country in ["Pk"] else country
    country = "Italy" if country in ["Italia"] else country
    country = "Belgium" if country in ["Belgique"] else country
    country = "Thailand" if country in ["Th"] else country
    country = (
        "USA"
        if country
        in [
            "USa",
            "Usa",
            "U.S.",
            "United States",
            "United States Of America",
            "Us,Texas",
            "Us",
            "United States Of American",
        ]
        else country
    )
    country = np.nan if country in ["", "Na", "E.G. Europe", "N"] else country
    df["Country"] = country

    # Ethnicity
    race = demo2["Ethnicity"].title().rstrip()
    race = (
        "Caucasian"
        if race
        in [
            "White",
            "Norwegian",
            "European",
            "White Australian",
            "Scandinavian",
            "Latin White",
            "White Caucasian",
            "Causcian",
            "Romanian",
            "Polish",
            "Mediterranian Caucasian",
            "White/European Descent",
            "Russian",
            "Greek",
            "Causasian",
            "Germans",
            "White Slavic European",
            "White British",
            "White/Caucasian",
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
            "Française",
            "Francais",
            "White (Us American)",
            "British",
            "German",
            "Bianca? (Non Sono Sicura Sulla Definizione Di Etnia)",
            "Moldave",
            "Eurasienne",
            "Europea",
            "Caucásico",
            "Blanco",
            "Blanca",
            "Entièrement Français D'Origine Depuis Plus D'Un Siècle",
        ]
        else race
    )
    race = "Arab" if race in ["Arabo", "Afrique Du Nord"] else race
    race = (
        "Asian"
        if race
        in [
            "Southeast Asian",
            "East Asian",
            "Chinese",
            "Indonesian",
            "Asian-American",
            "Asian British",
            "Filipino",
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
            "Antioqueño",
            "Antioqueña",
            "Paisa",
            "Latina",
        ]
        else race
    )
    race = "South Asian" if race in ["Indian", "Brown", "Srilankan"] else race
    race = (
        "Black"
        if race
        in [
            "Black African",
            "African American",
            "Franco-Africain",
            "Negra",
            "Negro",
            "Afrodescendiente",
            "Nigerian",
        ]
        else race
    )
    race = (
        "Mixed"
        if race
        in [
            "Latin American X Asian",
            "White, Hispanic",
            "White/Arabic",
            "Mixed White/Latino",
            "Afro-Mediterranean",
            "Mixed British Asian",
            "Mixed Caucasian/Asian",
            "Afrocolombiano",
            "Afrocolombinao",
            "Asain White Half N Half",
            "Indígenas Y Africanos",
            "Mixed Asian American",
            "Mulato",
        ]
        else race
    )
    race = (
        "Other"
        if race
        in [
            "Native American",
            "Jewish",
            "Meditteranean",
            "Mediterranean",
            "Turkish",
            "Indigenous",
            "Javanese",
            "Polynesian",
            "E.G.Caucasian",
            "German Sheperd",
            "Terrestre",
            "Batak",
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
            if any([x in birth for x in ["IUS", "SIU"]])
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
            if any([x in birth for x in ["for partner", "du partenaire", "pareja"]])
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
    fiction = pd.DataFrame({"Participant": [file["name"]] * len(fiction1)})
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

sona = alldata_subs[~np.isnan(alldata_subs["SONA_ID"])]
alldata_subs = alldata_subs.drop(columns=["SONA_ID"])


# Inspect ================================================================
# alldata_subs["Experimenter"].unique()
# alldata_subs["Country"].unique()
# alldata_subs["Ethnicity"].unique()
# alldata_subs["Education"].unique()
# alldata_subs["BirthControl"].unique()


# Reanonimize
alldata_subs["d"] = pd.to_datetime(
    alldata_subs["Date"] + " " + alldata_subs["Time"], format="%d/%m/%Y %H:%M:%S"
)
alldata_subs = alldata_subs.sort_values(by=["d"]).reset_index(drop=True)
correspondance = {j: f"S{i+1:03}" for i, j in enumerate(alldata_subs["Participant"])}
alldata_subs["Participant"] = [correspondance[i] for i in alldata_subs["Participant"]]
alldata["Participant"] = [correspondance[i] for i in alldata["Participant"]]
alldata_subs = alldata_subs.drop(columns=["Date_OSF", "d"])  # Drop OSf column
alldata_subs = alldata_subs.sort_values(by=["Participant"])
alldata = alldata.sort_values(by=["Participant", "Order1"])

# Save data ===============================================================
alldata.to_csv("../data/rawdata_task.csv", index=False)
alldata_subs.to_csv("../data/rawdata_participants.csv", index=False)
print("Done!")

# SONA check ================================================================
sona_credited = [
    30642,
    30643,
    30664,
    30710,
    30753,
    30800,
    30848,
    30894,
    30900,
    30985,
    31774,
    31777,
    31788,
    31830,
    31851,
    31865,
    31869,
    31911,
    31915,
    31927,
    31935,
    31950,
    31955,
    31965,
    31972,
    32047,
    32056,
    32067,
    32091,
    32093,
    32098,
    32130,
    32164,
    32188,
    32244,
    32253,
]
ids = list(np.sort(sona["SONA_ID"].astype(int).values))
[id for id in ids if id not in sona_credited]
