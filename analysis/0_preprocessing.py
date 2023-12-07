import json
import os

import osfclient
import pandas as pd

token = ""  # Paste OSF token here to access private repositories
data_subproject = "sm4jc"  # Data subproject ID
data_all = pd.DataFrame()  # Initialize empty dataframe

osf = osfclient.OSF(token=token).project(data_subproject)  # Connect to project
storage = [s for s in osf.storages][0]  # Access storage component
n_files = sum([1 for _ in storage.files])
for i, file in enumerate(storage.files):
    print(f"File N°{i+1}/{n_files}")
    file_name = file.name.replace(".csv", "")
    response = file._get(file._download_url, stream=True)
    data = pd.read_csv(response.raw)

    # Collection date
    date = pd.to_datetime(data["date"].dropna().unique()[0], format="%d/%m/%Y")
    if date < pd.to_datetime("06/12/2023", format="%d/%m/%Y"):
        continue

    # Participant ========================================================
    # data["screen"].unique()

    # Browser info -------------------------------------------------------
    brower = data[data["screen"] == "browser_info"].iloc[0]

    df = pd.DataFrame(
        {
            "Participant": file_name,
            # "Experimenter": brower["experimenter"],
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
    #
    # df["Debriefing_Boring"] = True if "boring" == "boring" else False

    # # Demographics -------------------------------------------------------
    # demo1 = data[data["screen"] == "demographics_1"].iloc[0]
    # demo1 = json.loads(demo1["response"])

    # df["Gender"] = demo1["gender"]
    # df["Education"] = demo1["education"]

    # demo2 = data[data["screen"] == "demographics_2"].iloc[0]
    # demo2 = json.loads(demo2["response"])

    # df["Age"] = demo2["age"]
    # df["Ethnicity"] = demo2["ethnicity"]

    data_all = pd.concat([data_all, df], axis=0)

data_all.to_csv("../data/data.csv", index=False)
print("Done!")
