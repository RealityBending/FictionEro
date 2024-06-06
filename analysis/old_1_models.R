# This script is an .R file as it is called from a High Performance Cluster.
# The models that are generated are then saved locally and used in the analysis.
# The compiled models are not shared due to repository size constraints.

# qsub -jc test.long /mnt/lustre/users/psych/dmm56/FictionEro/run.sh

# Options -----------------------------------------------------------------

# path <- "/mnt/lustre/users/psych/dmm56/FictionEro/models/"
path <- "./models/"
iter <- 1000
# cores <- parallel::detectCores(logical = FALSE)
cores <- 8

options(mc.cores = cores,
        brms.backend = "cmdstanr")

log <- c("Cores" = cores)
write.csv(as.data.frame(log), paste0(path, "log.csv"))


# Packages ----------------------------------------------------------------
library(tidyverse)
library(datawizard)
library(brms)

log <- c(log, "Packages" = TRUE)
write.csv(as.data.frame(log), paste0(path, "log.csv"))

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
write.csv(as.data.frame(log), paste0(path, "log.csv"))


# Baseline Models --------------------------------------------------------

# Arousal

t0 <- Sys.time()

f <- brms::bf(Arousal ~  0 + Intercept + Sex / Relevance +
                 (1|Participant),
              decomp = "QR")

m_baseline_arousal_linear <- brms::brm(
  f,
  data=df,
  algorithm="sampling",
  init = 0,
  seed=123,
  iter=iter,
  chains=cores,
  cores=cores,
  stan_model_args = list(stanc_options = list("O1")))

t1 <- Sys.time()
log <- c(log, "m1" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), paste0(path, "log.csv"))
save(m_baseline_arousal_linear, file=paste0(path, "m_baseline_arousal_linear.Rdata"))
rm(m_baseline_arousal_linear)



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
  algorithm="sampling",
  init = 0,
  seed=123,
  chains=0)

t1 <- Sys.time()
log <- c(log, "m2_compile" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), paste0(path, "log.csv"))

t0 <- Sys.time()

m_baseline_arousal_beta <- brms::brm(
    f,
    data=datawizard::rescale(df, select="Arousal", range=c(0, 1), to=c(0.001, 0.999)),
    algorithm="sampling",
    init = 0,
    seed=123,
    refresh=0,
    # iter=30000)
    iter=iter,
    chains=cores,
    cores=cores)

t1 <- Sys.time()
log <- c(log, "m2" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), paste0(path, "log.csv"))
save(m_baseline_arousal_beta, file=paste0(path, "m_baseline_arousal_beta.Rdata"))
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
  iter=iter,
  chains=cores,
  cores=cores)

t1 <- Sys.time()
log <- c(log, "m3" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), paste0(path, "log.csv"))
save(m_baseline_arousal_zoib, file=paste0(path, "m_baseline_arousal_zoib.Rdata"))
rm(m_baseline_arousal_zoib)



t0 <- Sys.time()

# m_baseline_arousal_ordbeta <- ordbetareg::ordbetareg(Arousal ~  0 + Intercept + Sex / Relevance +
#                                                        (Relevance|Participant) +
#                                                        (Relevance|Item),
#                                                      data=df,
#                                                      phi_reg = "both",
#                                                      algorithm="meanfield",
#                                                      init = 0)


ordbeta_mod <- ordbetareg:::.load_ordbetareg(formula=Arousal ~  0 + Intercept + Sex / Relevance,
                                             phi_reg="both")

f <- brms::bf(Arousal ~  0 + Intercept  + Sex / Relevance +
                (Relevance|Participant) +
                (Relevance|Item),
              phi ~ 0 + Intercept + Sex / Relevance +
                (Relevance|Participant) +
                (Relevance|Item),
              family=ordbeta_mod$family)

m_baseline_arousal_ordbeta <- brms::brm(formula=f,
                     data=df,
                     stanvars=ordbeta_mod$stanvars,
                     algorithm="sampling",
                     init = 0,
                     seed=123,
                     iter=iter,
                     chains=cores,
                     cores=cores)

# brms::get_prior(m_baseline_arousal_ordbeta)

t1 <- Sys.time()
log <- c(log, "m4" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), paste0(path, "log.csv"))
save(m_baseline_arousal_ordbeta, file=paste0(path, "m_baseline_arousal_ordbeta.Rdata"))
rm(m_baseline_arousal_ordbeta)




# Arousal -----------------------------------------------------------------

t0 <- Sys.time()

f <- brms::bf(Arousal ~  0 + Intercept + Sex / Relevance / Condition +
                (Relevance / Condition|Participant) +
                (Relevance / Condition|Item),
              phi ~ 0 + Intercept + Sex / Relevance +
                (Relevance|Participant) +
                (Relevance|Item),
              family=ordbeta_mod$family)

m_arousal <- brms::brm(formula=f,
                       data=df,
                       stanvars=ordbeta_mod$stanvars,
                       algorithm="sampling",
                       init = 0,
                       seed=123,
                       iter=iter,
                       chains=cores,
                       cores=cores)

t1 <- Sys.time()
log <- c(log, "m5" = as.numeric(difftime(t1, t0, units = "min")))
write.csv(as.data.frame(log), paste0(path, "log.csv"))
save(m_arousal, file=paste0(path, "m_arousal.Rdata"))
rm(m_arousal)
