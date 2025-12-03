
library(tidyverse)

# cleaned data study 1

dfsub <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study1/data/data_participants.csv")
df1 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study1/data/data.csv") |>
  right_join(
    select(dfsub, Participant, Sample, Language, Mobile, starts_with("Feedback_"),
           BAIT_Visual, BAIT_Text, AI_Knowledge, SexualActivity,
           GAAIS_Negative, GAAIS_Positive, Porn, COPS_Frequency_2,
           Screen_Size,
           -Feedback_Comments),
    by = "Participant"
  ) |>
  rename(Gender = Sex) |>
  datawizard::rescale(select=c("Valence"), range=c(-1, 1), to=c(0, 1)) |>
  

# |>
#   mutate(Condition = fct_relevel(Condition, "Photograph", "AIGenerated"),
#          Relevance =  fct_relevel(Relevance, "Relevant", "Irrelevant", "NonErotic"),
#          Gender =  fct_relevel(Gender, "Male", "Female"),
#          PornFrequency = as.numeric(as.factor(COPS_Frequency_2)),
#          SexualActivity_num = as.numeric(as.factor(SexualActivity)),
#          ConditionBelief = case_when(
#            Condition == "Photograph" & Realness > 0.5 ~ "True",
#            Condition == "AIGenerated" & Realness < 0.5 ~ "True",
#            .default = "False"
#          ),
#          ConditionBelief = as.factor(ConditionBelief),
#          ConditionBelief = fct_relevel(ConditionBelief, "True", "False")) |>
#   mutate(across(starts_with("Feedback_"), function(x) {fct_relevel(x, "False", "True")}))


write.csv(df1, "../data/df1.csv", row.names = FALSE)

# cleaned data study 2


dfsub2 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study2/data/data_participants.csv")
df2 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study2/data/data.csv") |>
  right_join(
    select(dfsub2, Participant, Mobile, starts_with(c("Feedback_","BAIT")), COPS_Frequency, SexualActivity,- Feedback_Text),
    by = "Participant"
  ) |>
  datawizard::rescale(select= c("Arousal", "Enticing", "Valence"), range=c(0, 6), to=c(0,1)) |>
  datawizard::rescale(select= c("Realness"), range=c(-3,3), to=c(0,1)) |>
  mutate(Condition = case_when(
    Condition == "Fiction" ~ "AIGenerated",
    Condition == "Reality" ~ "Photograph"
  )) |>
  mutate(ConditionBelief = case_when(
               Condition == "Photograph" & Realness > 0.5 ~ "True", Condition
               == "AIGenerated" & Realness < 0.5 ~ "True", .default =
               "False"))
  
      

# |>
#   mutate(Condition = fct_relevel(Condition, "Photograph", "AIGenerated"),
#          Gender =  fct_relevel(Gender, "Male", "Female"),
#          SexualOrientation = fct_relevel(SexualOrientation, "Heterosexual", "Homosexual", "Bisexual"),
#          PornFrequency = as.numeric(as.factor(COPS_Frequency)),
#          SexualActivity_num = as.numeric(as.factor(SexualActivity)),
#          ConditionBelief = as.factor(ConditionBelief),
#          ConditionBelief = fct_relevel(ConditionBelief, "True", "False")) |>
#   mutate(across(starts_with("Feedback_"), as.factor)) |>
#   mutate(ConditionBelief = as.factor(ConditionBelief)) |>
#   mutate(StimuliType = case_when(
#     grepl("couple", Item, ignore.case = TRUE) ~ "Couple",
#     TRUE ~ "Individual")) |>
#   mutate(StimuliType = fct_relevel(StimuliType, "Individual", "Couple")) |>


write.csv(df2, "../data/df2.csv", row.names = FALSE)



############## DATA VIsUALISATION
library(easystats)

describe_distribution(df1, range = TRUE)

df1 |>
  group_by(Gender, Condition, Relevance, ConditionBelief, ) |>
  summarise(n = n(),  perc = n() / nrow(df1) * 100, .groups = "drop")


describe_distribution(df2, range = TRUE)

df2 |>
  group_by(Gender, Condition, ConditionBelief, ) |>
  summarise(n = n(),  perc = n() / nrow(df1) * 100, .groups = "drop")

