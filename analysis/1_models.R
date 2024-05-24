# This script is an .R file as it is called from a High Performance Cluster.
# The models that are generated are then saved locally and used in the analysis.
# The compiled models are not shared due to repository size constraints.



# Packages ----------------------------------------------------------------
library(tidyverse)
library(datawizard)
library(brms)


options(mc.cores = parallel::detectCores(),
        brms.backend = "cmdstanr",
        width = 300)

log <- c("Packages" = TRUE)
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
