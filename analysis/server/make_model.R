# Fit models

library(tidyverse)
library(easystats)
library(patchwork)
library(ggside)
library(glmmTMB)

options(mc.cores = parallel::detectCores(),
        brms.backend = "cmdstanr",
        width = 300)

# Study 1 ===================================================================================================================================

dfsub1 <- dfsub <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study1/data/data_participants.csv")
df1 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study1/data/data.csv") |> 
  right_join(
    select(dfsub, Participant, Sample, Language, Mobile, starts_with("Feedback_"), 
           BAIT_Visual, BAIT_Text, AI_Knowledge, SexualActivity, 
           GAAIS_Negative, GAAIS_Positive, Porn, COPS_Frequency_2,
           Screen_Size,
           -Feedback_Comments),
    by = "Participant"
  ) |> 
  datawizard::rescale(select=c("Valence"), range=c(-1, 1), to=c(0, 1)) |> 
  mutate(Condition = fct_relevel(Condition, "Photograph", "AI-Generated"),
         Relevance =  fct_relevel(Relevance, "Relevant", "Irrelevant", "Non-erotic"),
         Sex =  fct_relevel(Sex, "Male", "Female"),
         PornFrequency = as.numeric(as.factor(COPS_Frequency_2)),
         SexualActivity_num = as.numeric(as.factor(SexualActivity)),
         ConditionBelief = case_when(
           Condition == "Photograph" & Realness > 0.5 ~ "True",
           Condition == "AI-Generated" & Realness < 0.5 ~ "True",
           .default = "False"
         ),
         ConditionBelief = as.factor(ConditionBelief),
         ConditionBelief = fct_relevel(ConditionBelief, "True", "False")) |> 
  mutate(across(starts_with("Feedback_"), function(x) {fct_relevel(x, "False", "True")}))


# MODELS --------

# Arousal
m_a1 <-  glmmTMB::glmmTMB(Arousal ~ Sex / Relevance/ Condition*ConditionBelief + (1|Participant) + (1|Item),
                          data=df1,
                          family=glmmTMB::ordbeta(),
                          control = glmmTMB::glmmTMBControl(parallel = 8))

# Enticement
m_e1 <-  glmmTMB::glmmTMB(Enticement ~ Sex /Relevance/Condition*ConditionBelief + (1|Participant) + (1|Item),
                          data=df1,
                          family=glmmTMB::ordbeta(),
                          control = glmmTMB::glmmTMBControl(parallel = 8))


# Valence
m_v1 <-  glmmTMB::glmmTMB(Valence ~ Sex / Relevance/ Condition*ConditionBelief + (1|Participant) + (1|Item),
                          data=df1,
                          family=glmmTMB::ordbeta(),
                          control = glmmTMB::glmmTMBControl(parallel = 8))

# Save models
saveRDS(m_a1, file = "../models/ModelArousal_1.rds")
saveRDS(m_e1, file = "../models/ModelEnticement_1.rds")
saveRDS(m_v1, file = "../models/ModelValence_1.rds")


# Study 2 ----------------------------------------------------------------------

dfsub2 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study2/data/data_participants.csv")
df2 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/study2/data/data.csv") |> 
  right_join(
    select(dfsub2, Participant, Mobile, starts_with(c("Feedback_","BAIT")), COPS_Frequency, SexualActivity,- Feedback_Text),
    by = "Participant"
  ) |> 
  datawizard::rescale(select= c("Arousal", "Enticing", "Valence"), range=c(0, 6), to=c(0,1)) |> 
  datawizard::rescale(select= c("Realness"), range=c(-3,3), to=c(0,1)) |>
  mutate(Condition = case_when(
    Condition == "Fiction" ~ "AI-Generated",
    Condition == "Reality" ~ "Photograph"
  )) |>
  mutate(Condition = fct_relevel(Condition, "Photograph", "AI-Generated"),
         Gender =  fct_relevel(Gender, "Male", "Female"),
         SexualOrientation = fct_relevel(SexualOrientation, "Heterosexual", "Homosexual", "Bisexual"),
         PornFrequency = as.numeric(as.factor(COPS_Frequency)),
         SexualActivity_num = as.numeric(as.factor(SexualActivity)),
         ConditionBelief = case_when(
           Condition == "Photograph" & Realness > 0.5 ~ "True",
           Condition == "AI-Generated" & Realness < 0.5 ~ "True",
           .default = "False"),
         ConditionBelief = as.factor(ConditionBelief),
         ConditionBelief = fct_relevel(ConditionBelief, "True", "False")) |>
  rename(AllRealConfidence = "Feedback_AllRealConfidence",
         AllFakeConfidence = "Feedback_AllFakeConfidence",
         Enjoyment = "Feedback_Enjoyment"
  )|>
  mutate(across(starts_with("Feedback_"), as.factor)) |>
  mutate(ConditionBelief = as.factor(ConditionBelief)) |>
  mutate(StimuliType = case_when(
    grepl("couple", Stimulus, ignore.case = TRUE) ~ "Couple",
    TRUE ~ "Individual")) |>
  mutate(StimuliType = fct_relevel(StimuliType, "Individual", "Couple"))


# MODELS --------

# Arousal
m_a2<-  glmmTMB::glmmTMB(Arousal ~ Gender / Condition*ConditionBelief + (1|Participant) + (1|Stimulus),
                          data=df2,
                          family=glmmTMB::ordbeta(),
                          control = glmmTMB::glmmTMBControl(parallel = 8))
# Enticement
m_e2 <-  glmmTMB::glmmTMB(Enticing ~ Gender / Condition*ConditionBelief + (1|Participant) + (1|Stimulus),
                          data=df2,
                          family=glmmTMB::ordbeta(),
                          control = glmmTMB::glmmTMBControl(parallel = 8))
# Valence
m_v2 <-  glmmTMB::glmmTMB(Valence ~ Gender / Condition*ConditionBelief + (1|Participant) + (1|Stimulus),
                          data=df2,
                          family=glmmTMB::ordbeta(),
                          control = glmmTMB::glmmTMBControl(parallel = 8))

# Save models
saveRDS(m_a2, file = "../models/ModelArousal_2.rds")
saveRDS(m_e2, file = "../models/ModelEnticement_2.rds")
saveRDS(m_v2, file = "../models/ModelValence_2.rds")


