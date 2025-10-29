# Fit models

library(brms)
library(cmdstanr)
library(tidyverse)

task_id <- as.numeric(Sys.getenv("SLURM_ARRAY_TASK_ID", unset = "1"))
chains_per_task <- as.numeric(Sys.getenv("SLURM_CPUS_PER_TASK", unset = "2"))
start_chain <- (task_id - 1) * chains_per_task + 1
iter <- 2000
warmup <- iter / 2
seed = 1234 + start_chain


path <- "/mnt/lustre/users/psych/asf25/fictionero/"
models_dir <- file.path(path, "models")
dir.create(models_dir, recursive = TRUE, showWarnings = FALSE)

# ----------------------------
# Study 1
# ----------------------------

df1 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/analysis/data/df1.csv")

# ----------------------------
# MODELS - Study 1
# ----------------------------

# Arousal
f_a1 <- brms::brmsformula(Arousal ~ Gender/Relevance/Condition * ConditionBelief + ((Relevance / Condition * ConditionBelief) | Participant) + (1 | Item))
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
f_e1 <- brms::brmsformula(Enticement ~ Gender/Relevance/Condition * ConditionBelief + ((Relevance / Condition * ConditionBelief) | Participant) + (1 | Item))

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
f_v1 <- brms::brmsformula(Valence ~ Gender/Relevance/Condition * ConditionBelief + ((Relevance / Condition * ConditionBelief) | Participant) + (1 | Item))

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

df2 <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/refs/heads/main/analysis/data/df2.csv")


# ----------------------------
# MODELS - Study 2
# ----------------------------

# Arousal
f_a2 <- brms::brmsformula(Arousal ~ Gender/Condition*ConditionBelief + ((Condition*ConditionBelief)|Participant) + (1|Item))

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
f_e2 <- brms::brmsformula(Enticement ~ Gender/Condition*ConditionBelief + ((Condition*ConditionBelief)|Participant) + (1|Item))

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
f_v2 <- brms::brmsformula(Valence ~ Gender/Condition*ConditionBelief + ((Condition*ConditionBelief)|Participant) + (1|Item))

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
