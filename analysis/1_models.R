# This script is an .R file as it is called from a High Performance Cluster.
# The models that are generated are then saved locally and used in the analysis.
# The compiled models are not shared due to repository size constraints.


# Options -----------------------------------------------------------------

iter <- 1000
cores <- parallel::detectCores(logical = FALSE)

options(mc.cores = cores,
        brms.backend = "cmdstanr",
        width = 300)

log <- c("Cores" = cores)
write.csv(as.data.frame(log), '/mnt/lustre/users/psych/dmm56/FictionEro/log.csv')


# Packages ----------------------------------------------------------------
library(tidyverse)
library(datawizard)
library(brms)

log <- c(log, "Packages" = TRUE)
write.csv(as.data.frame(log), '/mnt/lustre/users/psych/dmm56/FictionEro/log.csv')

# Data --------------------------------------------------------------------

dfsub <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/main/data/data_participants.csv")
df <- read.csv("https://raw.githubusercontent.com/RealityBending/FictionEro/main/data/data.csv") |>
  dplyr::full_join(
    dfsub[c("Participant", "Experimenter", "Language", "Feedback_LabelsIncorrect")],
    by = join_by(Participant)
  ) |>
  # datawizard::rescale(select=c("Arousal", "Enticement", "Realness"), range=c(0, 1), to=c(0.001, 0.999)) |>
  # datawizard::rescale(select=c("Valence"), range=c(-1, 1), to=c(0.001, 0.999)) |>
  datawizard::rescale(select=c("Valence"), range=c(-1, 1), to=c(0, 1)) |>
  dplyr::mutate(Condition = forcats::fct_relevel(Condition, "Photograph", "AI-Generated"),
         Relevance =  forcats::fct_relevel(Relevance, "Relevant", "Irrelevant", "Non-erotic"),
         Sex =  forcats::fct_relevel(Sex, "Male", "Female"),
         Feedback_LabelsIncorrect =  forcats::fct_relevel(Feedback_LabelsIncorrect, "False", "True"))

log <- c(log, "Data" = TRUE)
write.csv(as.data.frame(log), '/mnt/lustre/users/psych/dmm56/FictionEro/log.csv')



# Baseline Models --------------------------------------------------------

t0 <- Sys.time()

f <- brms::bf(Arousal ~  0 + Intercept + Sex / Relevance +
                 (0 + Intercept + Relevance|Participant) +
                 (0 + Intercept + Relevance|Item))

m_baseline_arousal_linear <- brms::brm(
  f,
  data=df,
  algorithm="sampling",
  init = 0,
  seed=123,
  refresh=0,
  iter=200,
  chains=cores)

t1 <- Sys.time()

log <- c(log, "m1" = TRUE)
write.csv(as.data.frame(log), '/mnt/lustre/users/psych/dmm56/FictionEro/log.csv')
save(m_baseline_arousal_linear, file="/mnt/lustre/users/psych/dmm56/FictionEro/m_baseline_arousal_linear.Rdata")
rm(m_baseline_arousal_linear)
