# This script is an .R file as it is called from a High Performance Cluster.
# The models that are generated are then saved locally and used in the analysis.
# The compiled models are not shared due to repository size constraints.

# qsub -jc test.long /mnt/lustre/users/psych/dmm56/FictionEro/run.sh

# Options -----------------------------------------------------------------

iter <- 600
cores <- parallel::detectCores(logical = FALSE)

options(mc.cores = cores,
        brms.backend = "cmdstanr")

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
    by = dplyr::join_by(Participant)
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

# Arousal

# t0 <- Sys.time()
#
# f <- brms::bf(Arousal ~  0 + Intercept + Sex / Relevance +
#                  (0 + Intercept + Relevance|Participant) +
#                  (0 + Intercept + Relevance|Item))
#
# m_baseline_arousal_linear <- brms::brm(
#   f,
#   data=df,
#   algorithm="sampling",
#   init = 0,
#   seed=123,
#   refresh=0,
#   iter=iter,
#   chains=cores,
#   cores=cores)
#
# t1 <- Sys.time()
# log <- c(log, "m1" = as.numeric(difftime(t1, t0, units = "min")))
# write.csv(as.data.frame(log), '/mnt/lustre/users/psych/dmm56/FictionEro/log.csv')
# save(m_baseline_arousal_linear, file="/mnt/lustre/users/psych/dmm56/FictionEro/m_baseline_arousal_linear.Rdata")
# rm(m_baseline_arousal_linear)



t0 <- Sys.time()

f <- brms::bf(Arousal ~  0 + Intercept + Sex / Relevance +
                 (0 + Intercept + Relevance|Participant) +
                 (0 + Intercept + Relevance|Item),
               phi ~ 0 + Intercept + Sex / Relevance +
                 (1|Participant) +
                 (1|Item),
               family=brms::Beta)

m_baseline_arousal_beta <- brms::brm(
    f,
    data=datawizard::rescale(df, select="Arousal", range=c(0, 1), to=c(0.001, 0.999)),
    algorithm="meanfield",
    init = 0,
    seed=123,
    refresh=0,
    iter=30000)
    # iter=iter,
    # chains=cores,
    # cores=cores)

t1 <- Sys.time()
log <- c(log, "m2" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), '/mnt/lustre/users/psych/dmm56/FictionEro/log.csv')
save(m_baseline_arousal_beta, file="/mnt/lustre/users/psych/dmm56/FictionEro/m_baseline_arousal_beta.Rdata")
rm(m_baseline_arousal_beta)



t0 <- Sys.time()

f <- brms::bf(Arousal ~  0 + Intercept + Sex / Relevance +
                 (Relevance|Participant) +
                 (Relevance|Item),
               # Precision (spread) of the 0-1 values
               phi ~ 0 + Intercept + Sex / Relevance +
                 (Relevance|Participant) +
                 (Relevance|Item),
               # Zero and one inflation (probability of extreme response)
               zoi ~ 0 + Intercept + Sex / Relevance +
                 (1|Participant),
               # Conditional one inflation (when extreme, probability of 1)
               coi ~ 0 + Intercept + Sex / Relevance,
               family=brms::zero_one_inflated_beta)

m_baseline_arousal_zoib <- brms::brm(
  f,
  data=df,
  algorithm="sampling",
  init = 0,
  seed=123,
  refresh=0,
  iter=iter,
  chains=cores,
  cores=cores)

t1 <- Sys.time()
log <- c(log, "m3" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), '/mnt/lustre/users/psych/dmm56/FictionEro/log.csv')
save(m_baseline_arousal_zoib, file="/mnt/lustre/users/psych/dmm56/FictionEro/m_baseline_arousal_zoib.Rdata")
rm(m_baseline_arousal_zoib)
