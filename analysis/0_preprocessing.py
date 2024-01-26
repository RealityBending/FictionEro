import json

import pandas as pd
import numpy as np


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


token = ""  # Paste OSF token here to access private repositories
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

    data = pd.read_csv(file["file"]._get(file["url"], stream=True).raw)

    # Participant ========================================================
    # data["screen"].unique()

    # Browser info -------------------------------------------------------
    brower = data[data["screen"] == "browser_info"].iloc[0]

    # Experimenter
    experimenter = brower["researcher"]
    if experimenter == "TEST":
        continue
    if isinstance(experimenter, float):
        experimenter = "Experimenter" + str(int(experimenter))

    file["date"]
    df = pd.DataFrame(
        {
            "Participant": file["name"],
            "Experimenter": experimenter,
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Language": brower["language"],
            "Date": brower["date"],
            "Time": brower["time"],
            "Date_OSF": file["date"],
            "Browser": brower["browser"],
            "Mobile": brower["mobile"],
            "Platform": brower["os"],
            "Screen_Width": brower["screen_width"],
            "Screen_Height": brower["screen_height"],
        },
        index=[0],
    )

    # Demographics -------------------------------------------------------
    demo1 = data[data["screen"] == "demographics_1"].iloc[0]
    demo1 = json.loads(demo1["response"])
    demo2 = data[data["screen"] == "demographics_2"].iloc[0]
    demo2 = json.loads(demo2["response"])
    demo3 = data[data["screen"] == "demographics_other"].iloc[0]
    demo3 = json.loads(demo3["response"])

    df["Sex"] = demo1["Sex"]
    df["Age"] = demo2["Age"]
    df["Country"] = demo2["Country"]
    df["Language_Level"] = demo3["Language_Level"]
    df["AI_Knowledge"] = demo3["AI_Knowledge"]

    # Education
    edu = demo1["Education"]
    edu = "Bachelor" if "bachelor" in edu else edu
    edu = "Master" if "master" in edu else edu
    edu = "Doctorate" if "doctorate" in edu else edu
    edu = "High School" if "High school" in edu else edu
    df["Education"] = edu

    # Country
    country = demo2["Country"].title().rstrip()
    country = "UK" if country in ["Uk", "England"] else country
    country = "Pakistan" if country in ["Pk"] else country
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
        ]
        else country
    )
    country = np.nan if country in ["", "Na"] else country
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
            "Mediterranean",
            "Romanian",
            "Polish",
            "Mediterranian Caucasian",
            "White/European Descent",
        ]
        else race
    )
    race = "Asian" if race in ["Southeast Asian", "East Asian", "Chinese"] else race
    race = "Hispanic" if race in ["Latino", "Latin", "Mexican"] else race
    race = "South Asian" if race in ["Indian", "Brown"] else race
    race = "Black" if race in ["Black African", "African American"] else race
    race = (
        "Mixed"
        if race in ["Latin American X Asian", "White, Hispanic", "White/Arabic"]
        else race
    )
    race = "Other" if race in ["Native American"] else race
    race = np.nan if race in ["", "Na", "Human"] else race
    df["Ethnicity"] = race

    # Female questions
    if "demographics_hormones" in data["screen"].unique():
        demo4 = data[data["screen"] == "demographics_hormones"].iloc[0]
        demo4 = json.loads(demo4["response"])
        birth = demo4["BirthControl"].replace("Yes - ", "")
        birth = "Intrauterine Device (IUD)" if "copper" in birth else birth
        birth = "Intrauterine System (IUS)" if "IUS" in birth else birth
        birth = "Combined pills" if "combined pills" in birth else birth
        birth = "Condoms (for partner)" if "condoms for partner" in birth else birth
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
    for item in cops:
        df[item] = cops[item]

    # Feedback ---------------------------------------------------------
    feedback = data[data["screen"] == "fiction_feedback1"].iloc[0]
    feedback = json.loads(feedback["response"])["FeedbackChoice"]

    df["Feedback_Boring"] = (
        True if True in [True for s in feedback if "boring" in s] else False
    )
    df["Feedback_Fun"] = (
        True if True in [True for s in feedback if "fun" in s] else False
    )
    df["Feedback_CouldDiscriminate"] = (
        True if True in [True for s in feedback if "could tell" in s] else False
    )
    df["Feedback_CouldNotDiscriminate"] = (
        True if True in [True for s in feedback if "didn't see" in s] else False
    )
    df["Feedback_AIMoreArousing"] = (
        True if True in [True for s in feedback if "more arousing" in s] else False
    )
    df["Feedback_AILessArousing"] = (
        True if True in [True for s in feedback if "less arousing" in s] else False
    )
    df["Feedback_LabelsIncorrect"] = (
        True if True in [True for s in feedback if "not always" in s] else False
    )
    df["Feedback_LabelsReversed"] = (
        True if True in [True for s in feedback if "reversed" in s] else False
    )
    df["Feedback_Arousing"] = (
        True if True in [True for s in feedback if "really arousing" in s] else False
    )
    df["Feedback_NoFeels"] = (
        True if True in [True for s in feedback if "feel anything" in s] else False
    )

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

# Inspect ================================================================
# alldata_subs["Experimenter"].unique()
# alldata_subs["Country"].unique()
# alldata_subs["Ethnicity"].unique()
# alldata_subs["BirthControl"].unique()

# Reanonimize
alldata_subs = alldata_subs.sort_values(by=["Date_OSF"]).reset_index(drop=True)
correspondance = {j: f"S{i+1:03}" for i, j in enumerate(alldata_subs["Participant"])}
alldata_subs["Participant"] = [correspondance[i] for i in alldata_subs["Participant"]]
alldata["Participant"] = [correspondance[i] for i in alldata["Participant"]]
alldata_subs = alldata_subs.drop(columns=["Date_OSF"])  # Drop OSf column

# Save data ===============================================================
alldata.to_csv("../data/rawdata_task.csv", index=False)
alldata_subs.to_csv("../data/rawdata_participants.csv", index=False)
print("Done!")
