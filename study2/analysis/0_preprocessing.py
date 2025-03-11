import json
import os
import numpy as np
import pandas as pd

import requests

path = "C:/Users/asf25/Box/FictionEro2/"
# path = "C:/Users/aneve/Box/FictionEro2/"
files = os.listdir(path)

# ============================== IMCOMPLETE DATA SETS ===================================

# Demographic data =========================================
all_demo_data = []  # List to store browser info
demo_files = [file for file in files if file.endswith("_demo.csv")] # only files ending in demo

# Identify and collect demo files
for file in demo_files:
    full_path = os.path.join(path, file)
    data = pd.read_csv(full_path) 
    # browser data
    browser_demo = data[data["screen"] == "browser_info"].iloc[0]

    # Extract browser info
    df_row = {
        "Prolific_ID": browser_demo["prolific_id"],
        "Participant": file,  
        "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
        "Date": browser_demo["date"],
        "Time": browser_demo["time"],
        "Browser": browser_demo["browser"],
        "Mobile": browser_demo["mobile"],
        "Platform": browser_demo["os"],
        "Screen_Width": browser_demo["screen_width"],
        "Screen_Height": browser_demo["screen_height"],
        "Source": browser_demo["researcher"],
    }

    all_demo_data.append(df_row)

demo_browser_df = pd.DataFrame(all_demo_data)

# Data till the Break of phase ===============================================
all_break_data = []  # List to store browser info
break_files = [file for file in files if file.endswith("_break.csv")] # only files ending in demo

# Identify and collect demo files
for file in break_files:
    full_path = os.path.join(path, file)
    data = pd.read_csv(full_path) 
    # browser data
    browser_demo = data[data["screen"] == "browser_info"].iloc[0]

    # Extract browser info
    df_row = {
        "Prolific_ID": browser_demo["prolific_id"],
        "Participant": file,  
        "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
        "Date": browser_demo["date"],
        "Time": browser_demo["time"],
        "Browser": browser_demo["browser"],
        "Mobile": browser_demo["mobile"],
        "Platform": browser_demo["os"],
        "Screen_Width": browser_demo["screen_width"],
        "Screen_Height": browser_demo["screen_height"],
        "Source": browser_demo["researcher"],
    }

    all_break_data.append(df_row)

demo_break_df = pd.DataFrame(all_break_data)

# Data with phase 1 complete ============================================================
all_phase1_data = []  # List to store browser info
phase1_files = [file for file in files if file.endswith("_phase1.csv")] # only files ending in demo

# Identify and collect demo files
for file in phase1_files:
    full_path = os.path.join(path, file)
    data = pd.read_csv(full_path) 
    # browser data
    browser_demo = data[data["screen"] == "browser_info"].iloc[0]

    # Extract browser info
    df_row = {
        "Prolific_ID": browser_demo["prolific_id"],
        "Participant": file,  
        "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
        "Date": browser_demo["date"],
        "Time": browser_demo["time"],
        "Browser": browser_demo["browser"],
        "Mobile": browser_demo["mobile"],
        "Platform": browser_demo["os"],
        "Screen_Width": browser_demo["screen_width"],
        "Screen_Height": browser_demo["screen_height"],
        "Source": browser_demo["researcher"],
    }

    all_phase1_data.append(df_row)

demo_break_df = pd.DataFrame(all_phase1_data)

# ================================= COMPLETE DATASETS ================================================

# Loop through files ======================================================
# Initialize empty dataframes
data_demo = pd.DataFrame()
data_task = pd.DataFrame()
data_eye = pd.DataFrame()

#All other files
break_files = [file for file in files if file.endswith("_break.csv")] # only files ending in break
phase1_files = [file for file in files if file.endswith("_phase1.csv")] # only files ending in break
full_files = {f.replace("_Full.csv", "") for f in files if f.endswith("_Full.csv")}


for i, file in enumerate(files):
    #skip demo files
    if file in demo_files:
        print(f"Skipping demo file: {file}")
        continue
    if file in break_files:
        print(f"Skipping break file: {file}")
        continue
    if file in phase1_files:
        print(f"Skipping phase1 file: {file}")
        continue
    

    filename = file.replace(".csv", "")
    # Skip if the normal version exists but there's a _Full version
    if filename in full_files and not file.endswith("_Full.csv"):
        print(f"File N°{i+1}/{len(files)} - Skipping {filename}, using {filename}_Full instead.")
        continue
    
    # Process the file
    print(f"File N°{i+1}/{len(files)} - Processing: {filename}")

    # Skip if participant already in the dataset
    if (
        "Participant" in data_demo.columns
        and filename in data_demo["Participant"].values
    ):
        print(" - ERROR 1")
        continue

    data = pd.read_csv(path + file)

    # Participant ----------------------------------------------------------
    # data["screen"].unique()

    # Exclude files
    if filename in ("zy6g0vfnxm"): 
        # zy6g0vfnxm -> researcher = test
        # gyfbuzmnxs -> calibration none type (skip for now)
        continue

    # Browser info -------------------------------------------------------
    if "browser_info" not in data["screen"].values:
        print(" - ERROR 2")
        continue
    browser = data[data["screen"] == "browser_info"].iloc[0]

    # Skip
    if (
        isinstance(browser["researcher"], str) is False
        or browser["researcher"] == "test"
    ):
        print(" - ERROR 3")
        continue

    df = pd.DataFrame(
        {
            "Prolific_ID": browser["prolific_id"],
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
    if df["Datetime"].values[0] < pd.Timestamp("2025-01-16"):
        print("- ERROR 4")
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
    
    # BAIT ------------------------------------------------------------------
    bait = data[data["screen"] == "questionnaire_bait"].iloc[0]

    df["Bait_Duration"] = bait["rt"] / 1000 / 60
    bait = json.loads(bait["response"])
    for item in bait:
        df[item] = float(bait[item])

    # COPS ------------------------------------------------------------------
    cops = data[data["screen"] == "questionnaire_cops"].iloc[0]

    df["COPS_Duration"] = cops["rt"] / 1000 / 60
    cops = json.loads(cops["response"])

    sexactivity = cops["COPS_SexualActivity"].lower().rstrip()
    sexactivity = "1. Less than 24h ago" if "1." in sexactivity else sexactivity
    sexactivity = "2. Within the last 3 days" if "2." in sexactivity else sexactivity
    sexactivity = "3. Within the last week" if "3." in sexactivity else sexactivity
    sexactivity = "4. Within the last month" if "4." in sexactivity else sexactivity
    sexactivity = "5. Within the last year" if "5." in sexactivity else sexactivity
    sexactivity = "6. More than a year ago" if "6." in sexactivity else sexactivity
    sexactivity = np.nan if sexactivity in [""] else sexactivity
    df["SexualActivity"] = sexactivity

    copsfreq = cops["COPS_Frequency"].rstrip()
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
    dftask["Arousal"] = [r["Arousal"] for r in ratings1]
    dftask["Enticing"] = [r["Enticing"] for r in ratings1]
    dftask["Valence"] = [r["Valence"] for r in ratings1]

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
        lambda x: x.replace("stimuli/", "")
    )
    dftask["Stimulus"] = dftask["Stimulus"].apply(lambda x: x.replace(".jpg", ""))
    dftask = dftask.reset_index(drop=True)

    data_task = pd.concat([data_task, dftask], axis=0, ignore_index=True)

    # Eye-tracking data --------------------------------------------------
    if "eyetracking_validation_run" in data["screen"].values:
        eye = data[data["screen"] == "eyetracking_validation_run"]
        calib = [json.loads(k) for k in eye["percent_in_roi"]]
        dist = [json.loads(k) for k in eye["average_offset"]]

        #Convert None to Nan
        calib = [[np.nan if x is None else x for x in row] for row in calib]

        df["Eyetracking_Validation1_Mean"] = np.mean(calib[-2])
        df["Eyetracking_Validation1_Max"] = np.max(calib[-2])
        df["Eyetracking_Validation1_Min"] = np.min(calib[-2])
        # The average x and y distance from each validation point, plus the median
        # distance r of the points from this average offset.
        df["Eyetracking_Validation1_Distance"] = np.mean([g["r"] for g in dist[-2]])

        df["Eyetracking_Validation2_Mean"] = np.mean(calib[-1])
        df["Eyetracking_Validation2_Max"] = np.max(calib[-1])
        df["Eyetracking_Validation2_Min"] = np.min(calib[-1])

        ## Convert None to NaN 
        dist = [
            [{k: (np.nan if v is None else v) for k, v in d.items()} for d in row]
            for row in dist
            ]
        
        df["Eyetracking_Validation2_Distance"] = np.mean([g["r"] for g in dist[-1]])

        stims = data[data["screen"] == "fiction_image1"].copy().reset_index(drop=True)
        for j, row in stims.iterrows():
            item = row["stimulus"].replace("stimuli/", "")
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
# sona = data_demo.loc[data_demo["Source"] == "SONA"].sort_values("SONA_ID")
# sona[["SONA_ID"]].astype(int)
# data_demo = data_demo.drop(columns=["SONA_ID"])

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
data_demo = replace_value(data_demo, "Ethnicity", "Other_Black African", "Black")
data_demo = replace_value(data_demo, "Ethnicity", "Other_Maori", "Other")
data_demo = replace_value(data_demo, "Ethnicity", "Other_Romanian", "White")


# data_demo["Discipline"][data_demo["Discipline"].str.contains("Other_").values].values
data_demo = replace_value(data_demo, "Discipline", "Other_Architecture", "Otther")
data_demo = replace_value(data_demo, "Discipline", "Other_Film Production", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Marketing and Research", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Information Technology", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Finance", "Business, Economics")
data_demo = replace_value(data_demo, "Discipline", "Other_Data analyst", "Engineering, Computer Science")
data_demo = replace_value(data_demo, "Discipline", "Other_Human Genetics", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Agricultural foresty", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Sport science", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_nursing", "Medicine")
data_demo = replace_value(data_demo, "Discipline", "Other_Education", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Geography and Primary Education", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Communications", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_education", "Other")
data_demo = replace_value(data_demo, "Discipline", "Other_Veterinary medicine (behavioural)", "Other")


# data_demo["SexualOrientation"][data_demo["SexualOrientation"].str.contains("Other_").values].values
data_demo = replace_value(data_demo, "SexualOrientation", "Other_Straight", "Heterosexual")

# data_demo["SexualStatus"][data_demo["SexualStatus"].str.contains("Other_").values].values
data_demo = replace_value(data_demo, "SexualStatus", "Other_Separated", "Other")
data_demo = replace_value(data_demo, "SexualStatus", "Other_Married", "In a relationship and not open to dating")

# data_demo["Gender"][data_demo["Gender"].str.contains("Other_").values].values

# data_demo["Country"][data_demo["Country"].str.contains("Other_").values].values

# data_demo["Education"][data_demo["Education"].str.contains("Other_").values].values
# data_demo[data_demo["Education"].str.contains("Other_Nursing college")]["Country"] 
data_demo = replace_value(data_demo, "Education", "Other_College", "Other")
data_demo = replace_value(data_demo, "Education", "Other_some college, short courses(not diploma nor degree)", "High school")
data_demo = replace_value(data_demo, "Education", "Other_COLLEGE", "Other")
data_demo = replace_value(data_demo, "Education", "Other_College (diploma)", "Other")
data_demo = replace_value(data_demo, "Education", "Other_Technical college", "Other")
data_demo = replace_value(data_demo, "Education", "Other_College.", "Other")
data_demo = replace_value(data_demo, "Education", "Other_Nursing college", "Bachelor")


# Compute the correlation for each participant for arousal and valence 
correlations = {}

for participant, group in data_task.groupby("Participant"):
    if len(group) > 1: 
        corr = np.corrcoef(group["Arousal"], group["Valence"])[0, 1] # Pearson Correlation coefficient matrix
    else:
        corr = np.nan  # Not enough data to compute correlation
    correlations[participant] = corr

# Convert the results to a DataFrame
correlations_df = pd.DataFrame(list(correlations.items()), columns=["Participant", "Correlation"])

# Compute distirbution based on correlations 
correlations_df['Correlation'].hist()

# data_task[data_task["Participant"] == 'S060']

# Compute the average rating time for each participant for phase 1
rating_time = {}

for participant, group in data_task.groupby("Participant"):
    if len(group) > 1: 
        rat = group["Rating_RT_Phase1"].median()  # Take median per participant
    else:
        rat = np.nan  # Not enough data to compute a reliable median
    rating_time[participant] = rat

# Convert the results to a DataFrame
rating_time_df = pd.DataFrame(list(rating_time.items()), columns=["Participant", "Rating Time"])

# Compute distirbution based on correlations 
rating_time_df['Rating Time'].hist()

# Median time 
data_demo["Experiment_Duration"].median()

# Save data ==============================================================
data_demo = data_demo.drop(columns=["Prolific_ID"])

data_demo.to_csv("../data/rawdata_participants.csv", index=False)
data_task.to_csv("../data/rawdata_task.csv", index=False)
data_eye.to_csv("../data/rawdata_eyetracking.csv", index=False)


