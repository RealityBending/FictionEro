import json

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


token = ""  # Paste OSF token here to access private repositories
files = osf_listfiles(
    token=token,
    data_subproject="sm4jc",  # Data subproject ID
    after_date="27/12/2023",
)


# Loop through files ======================================================
# Initialize empty dataframes
alldata = pd.DataFrame()
alldata_subs = pd.DataFrame()

for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}")

    data = pd.read_csv(file["file"]._get(file["url"], stream=True).raw)

    # Participant ========================================================
    # data["screen"].unique()

    # Browser info -------------------------------------------------------
    brower = data[data["screen"] == "browser_info"].iloc[0]

    df = pd.DataFrame(
        {
            "Participant": file["name"],
            "Experimenter": brower["experimenter"],
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Date": brower["date"],
            "Time": brower["time"],
            "Browser": brower["browser"],
            "Mobile": brower["mobile"],
            "Platform": brower["os"],
            "Screen_Width": brower["screen_width"],
            "Screen_Height": brower["screen_height"],
        },
        index=[0],
    )

    # FICTION ------------------------------------------------------------
    fiction1 = data[data["screen"] == "fiction_ratings1"]
    fiction = pd.DataFrame({"Participant": [file["name"]] * len(fiction1)})
    assert len(fiction1) == 60

    # TODO: add fixation cross
    fiction["Item"] = fiction1["stimulus"].values
    fiction["Order1"] = range(1, len(fiction1) + 1)
    fiction["RT1"] = fiction1["rt"].values / 1000
    fiction["Condition"] = fiction1["condition"].values

    fiction_cue = data[data["screen"] == "fiction_cue"]
    fiction["Cue_Color"] = fiction_cue["color"].values
    # fiction["Cue_Duration"] = fiction_cue["trial_duration"].values

    ratings1 = [json.loads(r) for r in fiction1["response"].values]
    fiction["Arousal"] = [r["Arousal"] for r in ratings1]
    fiction["Valence"] = [r["Valence"] for r in ratings1]
    fiction["Enticement"] = [r["Enticement"] for r in ratings1]

    # TODO: double check that this is matches the images
    fiction2 = data[data["screen"] == "fiction_ratings2"]
    fiction2_df = pd.DataFrame({"Item": fiction2["stimulus"].values})
    fiction2_df["Order2"] = range(1, len(fiction2) + 1)
    fiction["RT2"] = fiction2["rt"].values / 1000

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

    # Debriefing ---------------------------------------------------------
    debriefing = data[data["screen"] == "fiction_debriefing"].iloc[0]
    debriefing = json.loads(debriefing["response"])["debriefing"]

    # If 'boring' is is one of the debriefing sentences, True if not False
    df["Debriefing_Boring"] = (
        True if True in [True for s in debriefing if "boring" in s] else False
    )
    df["Debriefing_Fun"] = (
        True if True in [True for s in debriefing if "fun" in s] else False
    )
    df["Debriefing_CouldDiscriminate"] = (
        True if True in [True for s in debriefing if "could tell" in s] else False
    )
    df["Debriefing_CouldNotDiscriminate"] = (
        True if True in [True for s in debriefing if "didn't see" in s] else False
    )
    df["Debriefing_AIMoreArousing"] = (
        True if True in [True for s in debriefing if "more arousing" in s] else False
    )
    df["Debriefing_AILessArousing"] = (
        True if True in [True for s in debriefing if "less arousing" in s] else False
    )
    df["Debriefing_LabelsIncorrect"] = (
        True if True in [True for s in debriefing if "not always" in s] else False
    )
    df["Debriefing_LabelsReversed"] = (
        True if True in [True for s in debriefing if "reversed" in s] else False
    )
    df["Debriefing_Arousing"] = (
        True if True in [True for s in debriefing if "really arousing" in s] else False
    )
    df["Debriefing_NoFeels"] = (
        True if True in [True for s in debriefing if "feel anything" in s] else False
    )

    # Save data ----------------------------------------------------------
    alldata = pd.concat([alldata, fiction], axis=0, ignore_index=True)
    alldata_subs = pd.concat([alldata_subs, df], axis=0, ignore_index=True)
