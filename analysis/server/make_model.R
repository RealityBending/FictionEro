# Fit models

library(brms)
library(cmdstanr)
library(tidyverse)

task_id <- as.numeric(Sys.getenv("SLURM_ARRAY_TASK_ID", unset = "1"))
chains_per_task <- as.numeric(Sys.getenv("SLURM_CPUS_PER_TASK", unset = "2"))
start_chain <- (task_id - 1) * chains_per_task + 1
iter <- 1200
warmup <- iter / 2
seed = 1234 + start_chain


path <- "/mnt/lustre/users/psych/asf25/fictionero/"
models_dir <- file.path(path, "models")
dir.create(models_dir, recursive = TRUE, showWarnings = FALSE)

# ----------------------------
# Study 1
# ----------------------------

df1 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/analysis/data/df1.csv") |>
  mutate(Condition = fct_recode(Condition, "Photograph" = "Photograph", "AIGenerated" = "AI-Generated"),
         Condition = fct_relevel(Condition, "Photograph", "AIGenerated"),
         Relevance = fct_recode(Relevance,  "Relevant" = "Relevant",  "Irrelevant"= "Irrelevant", "NonErotic" = "Non-erotic"),
         Relevance =  fct_relevel(Relevance, "Relevant", "Irrelevant", "NonErotic"),
         Gender =  fct_relevel(Gender, "Male", "Female"),
         ConditionBelief = case_when(
           Condition == "Photograph" & Realness > 0.5 ~ "True",
           Condition == "AIGenerated" & Realness < 0.5 ~ "True",
           .default = "False"
         ),
         ConditionBelief = as.factor(ConditionBelief),
         ConditionBelief = fct_relevel(ConditionBelief, "True", "False")) 

# ----------------------------
# MODELS - Study 1
# ----------------------------

# Arousal
f_a1 <- brms::brmsformula(Arousal ~ Gender / Relevance / Condition * ConditionBelief + (1  + Condition  | Participant) + (1|Item))

# brms::get_prior(f_a1, data=df1)

priors <- set_prior("normal(0, 0.5)", class = "b")

validate_prior(priors, f_a1, data = df1)


m_a1 <-  brms::brm(
  formula = f_a1,
  data = df1,
  family = gaussian(),,
  prior = priors,
  chains = chains_per_task,
  cores = chains_per_task,
  iter = iter,
  warmup = warmup,
  seed = 1234 + start_chain,
  backend = "cmdstanr",
  file = file.path(models_dir, paste0("ModelArousal_1_task_", task_id))
)

# Enticement (FIXED: use f_e1 and set chains)
# f_e1 <- brms::brmsformula(Enticement ~ Gender / Relevance / (Condition * ConditionBelief) + (1  + Relevance / (Condition * ConditionBelief) | Participant) + (Relevance|Item))

# m_e1 <-  brms::brm(
#   formula = f_e1,
#   data = df1,
#   family = gaussian(),
#   chains = chains_per_task,
#   cores = chains_per_task,
#   iter = iter,
#   warmup = warmup,
#   seed = 1234 + start_chain,
#   backend = "cmdstanr",
#   file = file.path(models_dir, paste0("ModelEnticement_1_task_", task_id))
# )

# Valence
# f_v1 <- brms::brmsformula(Valence ~ Gender / Relevance / (Condition * ConditionBelief) + (1  + Relevance / (Condition * ConditionBelief) | Participant) + (Relevance|Item))

# m_v1 <-  brms::brm(
#   formula = f_v1,
#   data = df1,
#   family = gaussian(),
#   chains = chains_per_task,
#   cores = chains_per_task,
#   iter = iter,
#   warmup = warmup,
#   seed = 1234 + start_chain,
#   backend = "cmdstanr",
#   file = file.path(models_dir, paste0("ModelValence_1_task_", task_id))
# )


# Study 2 ----------------------------------------------------------------------

# df2 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/analysis/data/df2.csv") |>
#   mutate(Condition = fct_relevel(Condition, "Photograph", "AIGenerated"),
#          Gender =  fct_relevel(Gender, "Male", "Female"),
#          SexualOrientation = fct_relevel(SexualOrientation, "Heterosexual", "Homosexual", "Bisexual"),
#          ConditionBelief = case_when(
#            Condition == "Photograph" & Realness > 0.5 ~ "True",
#            Condition == "AIGenerated" & Realness < 0.5 ~ "True",
#            .default = "False"),
#          ConditionBelief = as.factor(ConditionBelief),
#          ConditionBelief = fct_relevel(ConditionBelief, "True", "False")) |>
#     rename(Item = Stimulus,
              # Enticement = Enticing)|>
#     mutate() |>
#     mutate(StimuliType = case_when(
#       grepl("couple", Item, ignore.case = TRUE) ~ "Couple", TRUE ~ "Individual")) |>
#     mutate(StimuliType = fct_relevel(StimuliType, "Individual", "Couple"))


# ----------------------------
# MODELS - Study 2
# ----------------------------

# Arousal
# f_a2 <- brms::brmsformula(Arousal ~ Gender / (Condition * ConditionBelief) + (1 + Condition|Participant) + (1|Item))
# 
# m_a2 <-  brms::brm(
#   formula = f_a2,
#   data = df2,
#   family = gaussian(),
#   chains = chains_per_task,
#   cores = chains_per_task,
#   iter = iter,
#   warmup = warmup,
#   seed = 1234 + start_chain,
#   backend = "cmdstanr",
#   file = file.path(models_dir, paste0("ModelArousal_2_task_", task_id))
# )

# Enticement
# f_e2 <- brms::brmsformula(Enticement ~ Gender / (Condition * ConditionBelief) + (1 + Condition* ConditionBelief|Participant) + (1|Item))

# m_e2 <-  brms::brm(
#   formula = f_e2,
#   data = df2,
#   family = gaussian(),
#   chains = chains_per_task,
#   cores = chains_per_task,
#   iter = iter,
#   warmup = warmup,
#   seed = 1234 + start_chain,
#   backend = "cmdstanr",
#   file = file.path(models_dir, paste0("ModelEnticement_2_task_", task_id))
# )

# Valence
# f_v2 <- brms::brmsformula(Valence ~ Gender / (Condition * ConditionBelief) + (1 + Condition * ConditionBelief)|Participant) + (1|Item))

# m_v2 <-  brms::brm(
#   formula = f_v2,
#   data = df2,
#   family = gaussian(),
#   chains = chains_per_task,
#   cores = chains_per_task,
#   iter = iter,
#   warmup = warmup,
#   seed = 1234 + start_chain,
#   backend = "cmdstanr",
#   file = file.path(models_dir, paste0("ModelValence_2_task_", task_id))
# )
