#!/bin/bash
#SBATCH --job-name=fictionero_combine
#SBATCH --array=1-6
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=32
#SBATCH --mem=32G
#SBATCH --output=/mnt/lustre/scratch/psych/asf25/fictionero/combine_%A_%a.out
#SBATCH --error=/mnt/lustre/scratch/psych/asf25/fictionero/combine_%A_%a.err
#SBATCH --partition=long

# Have slurm email your SUSSEX email
#SBATCH --mail-user=asf25@sussex.ac.uk
#SBATCH --mail-type=BEGIN,END,FAIL


# Set working directory
# cd /mnt/lustre/users/psych/asf25/fictionero  || exit 1

echo "Running on $(hostname)"
echo "Current directory: $(/bin/pwd)"
echo "Job started at: $(date '+%Y-%m-%d %H:%M:%S')"

module load R/4.4.1-gfbf-2023b
Rscript combine_models.R $SLURM_ARRAY_TASK_ID

echo "COMPLETED at: $(date '+%Y-%m-%d %H:%M:%S')"