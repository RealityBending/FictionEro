library(brms)
library(cmdstanr)
library(rstan)
library(loo)

# Get the number of cores and task ID from the environment variables
options(mc.cores = as.numeric(Sys.getenv("SLURM_CPUS_PER_TASK")))
task_id <- as.numeric(Sys.getenv("SLURM_ARRAY_TASK_ID"))

# Folder where your model .rds files are saved
setwd("/mnt/lustre/users/psych/asf25/fictionero/models/")

# List of models
# model_names <- c("ModelArousal_1", "ModelEnticement_1", "ModelValence_1",
#                  "ModelArousal_2", "ModelEnticement_2", "ModelValence_2")

# model_names <- c("ModelArousal_1","ModelArousal_2")

model_names <- c("ModelArousal_1")


# Pick model based on array ID
model_name <- model_names[task_id]

combine_and_save <- function(name) {
  print(paste0("Starting: ", name, " at ", Sys.time()))
  
  # Find all files for this model (e.g., ModelArousal_1_1.rds, ModelArousal_1_2.rds, …)
  files <- list.files(".", pattern = paste0("^", name, "_task_.*\\.rds$"), full.names = TRUE)
  
  if (length(files) == 0) stop("No .rds files found for ", name)
  
  # Combine model objects
  m <- brms::combine_models(mlist = lapply(files, readRDS))
  
  # Add WAIC criterion
  m <- brms::add_criterion(m, "waic", ndraws = 1500, file = name)
  
  # Save combined model
  saveRDS(m, paste0(name, ".rds"))
  
  print(paste0("Finished: ", name, " at ", Sys.time()))
}

combine_and_save(model_name)
