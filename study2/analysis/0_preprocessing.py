import json
import os
import numpy as np
import pandas as pd

import requests

path = "C:/Users/domma/Box/Data/FakeFace2/"
files = os.listdir(path)


# Loop through files ======================================================
# Initialize empty dataframes
data_demo = pd.DataFrame()
data_task = pd.DataFrame()
data_eye = pd.DataFrame()

for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}")  # Print progress

    # Skip if participant already in the dataset
    filename = file.replace(".csv", "")
    if (
        "Participant" in data_demo.columns
        and filename in data_demo["Participant"].values
    ):
        continue

    data = pd.read_csv(path + file)

    # Participant ----------------------------------------------------------
    # data["screen"].unique()

    # Browser info -------------------------------------------------------
    if "browser_info" not in data["screen"].values:
        continue
    browser = data[data["screen"] == "browser_info"].iloc[0]

    # Skip
    if (
        isinstance(browser["researcher"], str) is False
        or browser["researcher"] == "test"
    ):
        continue

    df = pd.DataFrame(
        {
            "Participant": filename,
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Date": browser["date"],
            "Time": browser["time"],
            "Browser": browser["browser"],
            "Mobile": browser["mobile"],
            "Platform": browser["os"],
            "Screen_Width": browser["screen_width"],
            "Screen_Height": browser["screen_height"],
            "Source": browser["researcher"],
        },
        index=[0],
    )

    df["Datetime"] = pd.to_datetime(
        df["Date"] + " " + df["Time"], format="%d/%m/%Y %H:%M:%S"
    )
    if df["Datetime"].values[0] < pd.Timestamp("2024-07-20"):
        continue
    if "sona_id" in browser.index and not pd.isnull(browser["sona_id"]):
        df["SONA_ID"] = int(browser["sona_id"])

    # Demographics -------------------------------------------------------
    demo = data[data["screen"] == "demographic_questions"].iloc[0]
    demo = json.loads(demo["response"])

    for item in demo:
        if "Comment" in item:
            answer = demo[item]
            demo[item.replace("-Comment", "")] = "Other_" + answer
            demo[item] = "Other_" + answer
            item = item.replace("-Comment", "")
        df[item] = "Prefer not to say" if demo[item] == None else demo[item]
    # HEXACO ----------------------------------------------------------------
    hexaco = data[data["screen"] == "questionnaire_hexaco18"].iloc[0]

    df["Hexaco_Duration"] = hexaco["rt"] / 1000 / 60
    hexaco = json.loads(hexaco["response"])
    for item in hexaco:
        df[item] = float(hexaco[item])

    # BAIT ------------------------------------------------------------------
    bait = data[data["screen"] == "questionnaire_bait"].iloc[0]

    df["Bait_Duration"] = bait["rt"] / 1000 / 60
    bait = json.loads(bait["response"])
    for item in bait:
        df[item] = float(bait[item])

    # Feedback -------------------------------------------------------------
    f1 = data[data["screen"] == "fiction_feedback1"].iloc[0]
    f1 = json.loads(f1["response"])

    df["Feedback_NoFacesAttractive"] = False
    df["Feedback_SomeFacesAttractive"] = False
    df["Feedback_AIMoreAttractive"] = False
    df["Feedback_AILessAttractive"] = False
    if f1["Feedback_1"] is not None:
        for f in f1["Feedback_1"]:
            if "No face" in f:
                df["Feedback_NoFacesAttractive"] = True
            if "Some faces" in f:
                df["Feedback_SomeFacesAttractive"] = True
            if "more attractive" in f:
                df["Feedback_AIMoreAttractive"] = True
            if "less attractive" in f:
                df["Feedback_AILessAttractive"] = True

    df["Feedback_DiffObvious"] = False
    df["Feedback_DiffSubtle"] = False
    df["Feedback_DiffNone"] = False
    df["Feedback_LabelsIncorrect"] = False
    df["Feedback_LabelsReversed"] = False
    df["Feedback_AllReal"] = False
    df["Feedback_AllFake"] = False
    if f1["Feedback_2"] is not None:
        for f in f1["Feedback_2"]:
            if "obvious" in f:
                df["Feedback_DiffObvious"] = True
            if "subtle" in f:
                df["Feedback_DiffSubtle"] = False
            if "any difference" in f:
                df["Feedback_DiffNone"] = True
            if "not always correct" in f:
                df["Feedback_LabelsIncorrect"] = True
            if "reversed" in f:
                df["Feedback_LabelsReversed"] = True
            if "were photos" in f:
                df["Feedback_AllReal"] = True
            if "were AI-generated" in f:
                df["Feedback_AllFake"] = True

    df["Feedback_AllRealConfidence"] = (
        np.nan
        if f1["Feedback_2_ConfidenceReal"] == None
        else f1["Feedback_2_ConfidenceReal"]
    )
    df["Feedback_AllFakeConfidence"] = (
        np.nan
        if f1["Feedback_2_ConfidenceFake"] == None
        else f1["Feedback_2_ConfidenceFake"]
    )

    f2 = data[data["screen"] == "experiment_feedback"].iloc[0]
    f2 = json.loads(f2["response"])
    df["Feedback_Enjoyment"] = f2["Feedback_Enjoyment"]
    df["Feedback_Text"] = f2["Feedback_Text"]

    # Task data -----------------------------------------------------------
    df["Instruction_Duration1"] = (
        data[data["screen"] == "fiction_instructions1"].iloc[0]["rt"] / 1000
    )
    df["Instruction_Duration2"] = (
        data[data["screen"] == "fiction_instructions2"].iloc[0]["rt"] / 1000
    )

    # Phase 1
    stims1 = data[data["screen"] == "fiction_image1"].copy()
    ratings1 = data[data["screen"] == "fiction_ratings1"].copy()
    cues = data[data["screen"] == "fiction_cue"].copy()

    dftask = pd.DataFrame(
        {
            "Participant": filename,
            "Stimulus": stims1["stimulus"],
            "Trial_Order_Phase1": stims1["trial_number"],
            "Trial_Duration_Phase1": stims1["trial_duration"] / 1000,
            "Rating_RT_Phase1": ratings1["rt"].values,
            "Cue_Color": cues["color"].values,
            "Condition": cues["condition"].values,
        }
    )

    ratings1 = [json.loads(k) for k in ratings1["response"]]
    dftask["Beauty"] = [r["Beauty"] for r in ratings1]
    dftask["Attractiveness"] = [r["Attractiveness"] for r in ratings1]
    dftask["Trustworthiness"] = [r["Trustworthiness"] for r in ratings1]

    # Phase 2
    stims2 = data[data["screen"] == "fiction_image2"].copy()
    ratings2 = data[data["screen"] == "fiction_ratings2"].copy()

    dftask2 = pd.DataFrame(
        {
            "Stimulus": stims2["stimulus"],
            "Trial_Order_Phase2": stims2["trial_number"],
            "Trial_Duration_Phase2": stims2["trial_duration"] / 1000,
            "Rating_RT_Phase2": ratings2["rt"].values,
        }
    )

    ratings2 = [json.loads(k) for k in ratings2["response"]]
    dftask2["Realness"] = [r["Realness"] for r in ratings2]

    # Merge and clean
    dftask = pd.merge(dftask, dftask2, on="Stimulus", how="left")
    dftask["Stimulus"] = dftask["Stimulus"].apply(
        lambda x: x.replace("stimuli/AMFD/", "")
    )
    dftask["Stimulus"] = dftask["Stimulus"].apply(lambda x: x.replace(".jpg", ""))
    dftask = dftask.reset_index(drop=True)

    data_task = pd.concat([data_task, dftask], axis=0, ignore_index=True)

    # Eye-tracking data --------------------------------------------------
    if "eyetracking_validation_run" in data["screen"].values:
        eye = data[data["screen"] == "eyetracking_validation_run"]
        calib = [json.loads(k) for k in eye["percent_in_roi"]]
        dist = [json.loads(k) for k in eye["average_offset"]]

        df["Eyetracking_Validation1_Mean"] = np.mean(calib[-2])
        df["Eyetracking_Validation1_Max"] = np.max(calib[-2])
        df["Eyetracking_Validation1_Min"] = np.min(calib[-2])
        # The average x and y distance from each validation point, plus the median
        # distance r of the points from this average offset.
        df["Eyetracking_Validation1_Distance"] = np.mean([g["r"] for g in dist[-2]])

        df["Eyetracking_Validation2_Mean"] = np.mean(calib[-1])
        df["Eyetracking_Validation2_Max"] = np.max(calib[-1])
        df["Eyetracking_Validation2_Min"] = np.min(calib[-1])
        df["Eyetracking_Validation2_Distance"] = np.mean([g["r"] for g in dist[-1]])

        stims = data[data["screen"] == "fiction_image1"].copy().reset_index(drop=True)
        for j, row in stims.iterrows():
            item = row["stimulus"].replace("stimuli/AMFD/", "")
            gaze = json.loads(row["webgazer_data"])
            dfgaze = pd.DataFrame(
                {
                    "Participant": filename,
                    "Stimulus": item.replace(".jpg", ""),
                    "Trial": row["trial_number"],
                    "Time": [g["t"] / 1000 for g in gaze],
                    "Gaze_x": [g["x"] for g in gaze],
                    "Gaze_y": [g["y"] for g in gaze],
                    "Type": "Image",
                }
            )

            # Contain x and y properties specifying the top-left corner of the object, width and height values,
            # plus top, bottom, left, and right parameters which specify the bounding rectangle of the element.
            target = json.loads(row["webgazer_targets"])[
                "#jspsych-image-keyboard-response-stimulus"
            ]
            dfgaze["Target_TopLeft_x"] = target["x"]
            dfgaze["Target_TopLeft_y"] = target["y"]
            dfgaze["Target_BottomRight_x"] = target["x"] + target["width"]
            dfgaze["Target_BottomRight_y"] = target["y"] + target["height"]

            # Fixation cross
            fixcross = data[
                (data["screen"] == "fiction_fixation1b") & (data["item"] == item)
            ]

            target = json.loads(fixcross["webgazer_targets"].values[0])[
                "#jspsych-html-keyboard-response-stimulus"
            ]

            fixcross = json.loads(fixcross["webgazer_data"].values[0])

            dfgazefixcross = pd.DataFrame(
                {
                    "Participant": filename,
                    "Stimulus": item.replace(".jpg", ""),
                    "Trial": row["trial_number"],
                    "Time": [g["t"] / 1000 for g in fixcross],
                    "Gaze_x": [g["x"] for g in fixcross],
                    "Gaze_y": [g["y"] for g in fixcross],
                    "Type": "Fixation Cross",
                    "Target_TopLeft_x": target["x"],
                    "Target_TopLeft_y": target["y"],
                    "Target_BottomRight_x": target["x"] + target["width"],
                    "Target_BottomRight_y": target["y"] + target["height"],
                }
            )

            dfgaze = pd.concat([dfgazefixcross, dfgaze], axis=0, ignore_index=True)
            data_eye = pd.concat([data_eye, dfgaze], axis=0, ignore_index=True)

    # Concatenate data ------------------------------------------------------
    data_demo = pd.concat([data_demo, df], axis=0, ignore_index=True)


# SONA ====================================================================
sona = data_demo.loc[data_demo["Source"] == "SONA"].sort_values("SONA_ID")
sona[["SONA_ID"]].astype(int)
data_demo = data_demo.drop(columns=["SONA_ID"])

# Reanonimize =============================================================
data_demo = data_demo.sort_values(["Datetime"])
ppt = {s: f"S{i+1:03d}" for i, s in enumerate(data_demo["Participant"].unique())}
data_demo["Participant"] = [ppt[s] for s in data_demo["Participant"]]
data_task["Participant"] = [ppt[s] for s in data_task["Participant"]]
data_eye["Participant"] = [ppt[s] for s in data_eye["Participant"]]
data_demo = data_demo.drop(columns=["Datetime"])


# Manual clean-up =========================================================
def replace_value(df, column, old, new):
    df = df.copy()
    df.loc[df[column] == old, column] = new
    return df


# data_demo["Ethnicity"][data_demo["Ethnicity"].str.contains("Other_").values].values
data_demo = replace_value(data_demo, "Ethnicity", "Other_White, Hispanic", "Mixed")


# data_demo["Discipline"][data_demo["Discipline"].str.contains("Other_").values].values
data_demo = replace_value(
    data_demo, "Discipline", "Other_Business Psychology", "Psychology"
)
data_demo = replace_value(data_demo, "Discipline", "Other_Journalism", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Industrial Design", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_pharmacy", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Geography", "Other")
data_demo = replace_value(
    data_demo, "Discipline", "Other_Health Sciences and Public Health", "Other"
)
data_demo = replace_value(data_demo, "Discipline", "Other_public health", "Other")
data_demo = replace_value(
    data_demo,
    "Discipline",
    "Other_Business: Human Resources and Industrial Relations\nEducation: Special Education",
    "Other",
)
data_demo = replace_value(data_demo, "Discipline", "Other_Tourism", "Other")

# data_demo["SexualOrientation"][data_demo["SexualOrientation"].str.contains("Other_").values].values
data_demo = replace_value(data_demo, "SexualOrientation", "Other_Pansexual", "Other")
data_demo = replace_value(
    data_demo, "SexualOrientation", "Other_Mainly heterosexual", "Heterosexual"
)
data_demo = replace_value(data_demo, "SexualOrientation", "Other_Queer", "Other")
data_demo = replace_value(data_demo, "SexualOrientation", "Other_Demisexual", "Other")
data_demo = replace_value(data_demo, "SexualOrientation", "Other_Questioning", "Other")
data_demo = replace_value(data_demo, "SexualOrientation", "Other_Asexual", "Other")
data_demo = replace_value(data_demo, "SexualOrientation", "Other_AroAce", "Other")


# data_demo["SexualStatus"][data_demo["SexualStatus"].str.contains("Other_").values].values
data_demo = replace_value(
    data_demo,
    "SexualStatus",
    "Other_Married not open to dating",
    "In a relationship and not open to dating",
)
data_demo = replace_value(
    data_demo,
    "SexualStatus",
    "Other_Prefer not to say.",
    np.nan,
)

# data_demo["Gender"][data_demo["Gender"].str.contains("Other_").values].values
# data_demo["Country"][data_demo["Country"].str.contains("Other_").values].values
# data_demo["Education"][data_demo["Education"].str.contains("Other_").values].values
data_demo = replace_value(data_demo, "Education", "Other_Diploma in TEFL", "Other")
data_demo = replace_value(data_demo, "Education", "Other_A level", "High school")
data_demo = replace_value(data_demo, "Education", "Other_collage", "High school")
data_demo = replace_value(
    data_demo, "Education", "Other_A-Levels, college", "High school"
)
data_demo = replace_value(data_demo, "Education", "Other_Middle school", "Other")
data_demo = replace_value(data_demo, "Education", "Other_Middle School", "Other")

# Save data ==============================================================

data_demo.to_csv("../data/rawdata_participants.csv", index=False)
data_task.to_csv("../data/rawdata_task.csv", index=False)
data_eye.to_csv("../data/rawdata_eyetracking.csv", index=False)
