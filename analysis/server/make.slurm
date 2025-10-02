#!/bin/bash
#SBATCH --job-name=fictionero_models
#SBATCH --array=1-6
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=16
#SBATCH --mem=16G
#SBATCH --output=/mnt/lustre/scratch/psych/asf25/FictionEro/models_%A_%a.out
#SBATCH --error=/mnt/lustre/scratch/psych/asf25/FictionEro/models_%A_%a.err
#SBATCH --partition=long

# Set working directory
# cd /mnt/lustre/users/psych/asf25/FictionEro || exit 1

echo "Running on $(hostname)"
echo "Current directory: $(/bin/pwd)"
echo "Job started at: $(date '+%Y-%m-%d %H:%M:%S')"

module load R/4.4.1-gfbf-2023b
Rscript make_models.R $SLURM_ARRAY_TASK_ID

echo "COMPLETED at: $(date '+%Y-%m-%d %H:%M:%S')"