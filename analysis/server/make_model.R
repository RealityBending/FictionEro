# Fit models

library(brms)
library(cmdstanr)
library(tidyverse)

task_id <- as.numeric(Sys.getenv("SLURM_ARRAY_TASK_ID", unset = "1"))
chains_per_task <- as.numeric(Sys.getenv("SLURM_CPUS_PER_TASK", unset = "2"))
start_chain <- (task_id - 1) * chains_per_task + 1
iter <- 4000 
warmup <- iter / 2
seed = 1234 + start_chain


path <- "/mnt/lustre/users/psych/asf25/fictionero/"
models_dir <- file.path(path, "models")
dir.create(models_dir, recursive = TRUE, showWarnings = FALSE)

# ----------------------------
# Study 1
# ----------------------------

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
  rename(Gender = Sex) |>
  datawizard::rescale(select=c("Valence"), range=c(-1, 1), to=c(0, 1)) |> 
  mutate(Condition = fct_relevel(Condition, "Photograph", "AI-Generated"),
         Relevance =  fct_relevel(Relevance, "Relevant", "Irrelevant", "Non-erotic"),
         Gender =  fct_relevel(Gender, "Male", "Female"),
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


# ----------------------------
# MODELS - Study 1
# ----------------------------

# Arousal
f_a1 <- brms::brmsformula(Arousal ~ Gender / Relevance/ Condition*ConditionBelief + (1|Participant) + (1|Item))

m_a1 <-  brms::brm(
  formula = f_a1,
  data = df1, 
  family = zero_one_inflated_beta(),
  chains = chains_per_task,   
  cores = chains_per_task,    
  iter = iter, 
  warmup = warmup,
  seed = 1234 + start_chain,
  backend = "cmdstanr",
  file = file.path(models_dir, paste0("ModelArousal_1_task_", task_id))
)

# Enticement (FIXED: use f_e1 and set chains)
f_e1 <- brms::brmsformula(Enticement ~ Gender / Relevance/ Condition*ConditionBelief + (1|Participant) + (1|Item))

m_e1 <-  brms::brm(
  formula = f_e1,
  data = df1, 
  family = zero_one_inflated_beta(),
  chains = chains_per_task,   
  cores = chains_per_task,    
  iter = iter, 
  warmup = warmup,
  seed = 1234 + start_chain,
  backend = "cmdstanr",
  file = file.path(models_dir, paste0("ModelEnticement_1_task_", task_id))
)

# Valence
f_v1 <- brms::brmsformula(Valence ~ Gender / Relevance/ Condition*ConditionBelief + (1|Participant) + (1|Item))

m_v1 <-  brms::brm(
  formula = f_v1,
  data = df1, 
  family = zero_one_inflated_beta(),
  chains = chains_per_task,   
  cores = chains_per_task,    
  iter = iter, 
  warmup = warmup,
  seed = 1234 + start_chain,
  backend = "cmdstanr",
  file = file.path(models_dir, paste0("ModelValence_1_task_", task_id))
)


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
         Enjoyment = "Feedback_Enjoyment",
         Item = Stimulus
  )|>
  mutate(across(starts_with("Feedback_"), as.factor)) |>
  mutate(ConditionBelief = as.factor(ConditionBelief)) |>
  mutate(StimuliType = case_when(
    grepl("couple", Item, ignore.case = TRUE) ~ "Couple",
    TRUE ~ "Individual")) |>
  mutate(StimuliType = fct_relevel(StimuliType, "Individual", "Couple"))

# ----------------------------
# MODELS - Study 2
# ----------------------------

# Arousal
f_a2 <- brms::brmsformula(Arousal ~ Gender / Condition*ConditionBelief + (1|Participant) + (1|Item))

m_a2 <-  brms::brm(
  formula = f_a2,
  data = df2, 
  family = zero_one_inflated_beta(),
  chains = chains_per_task,   
  cores = chains_per_task,    
  iter = iter, 
  warmup = warmup,
  seed = 1234 + start_chain,
  backend = "cmdstanr",
  file = file.path(models_dir, paste0("ModelArousal_2_task_", task_id))
)

# Enticement
f_e2 <- brms::brmsformula(Enticing ~ Gender / Condition*ConditionBelief + (1|Participant) + (1|Item))

m_e2 <-  brms::brm(
  formula = f_e2,
  data = df2, 
  family = zero_one_inflated_beta(),
  chains = chains_per_task,   
  cores = chains_per_task,    
  iter = iter, 
  warmup = warmup,
  seed = 1234 + start_chain,
  backend = "cmdstanr",
  file = file.path(models_dir, paste0("ModelEnticement_2_task_", task_id))
)

# Valence
f_v2 <- brms::brmsformula(Valence ~ Gender / Condition*ConditionBelief + (1|Participant) + (1|Item))

m_v2 <-  brms::brm(
  formula = f_v2,
  data = df2, 
  family = zero_one_inflated_beta(),
  chains = chains_per_task,   
  cores = chains_per_task,    
  iter = iter, 
  warmup = warmup,
  seed = 1234 + start_chain,
  backend = "cmdstanr",
  file = file.path(models_dir, paste0("ModelValence_2_task_", task_id))
)