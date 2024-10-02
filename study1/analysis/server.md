
# Exploring Cluster Files

- WinSCP
- Host: `apollo2.hpc.sussex.ac.uk`
- Username (e.g., `dmm56`) is the IT username

# Connecting to Cluster

- Open Terminal
- `ssh -Y dmm56@apollo2.hpc.sussex.ac.uk`
- Enter password
- We are in `mnt/nfs2/psych/dmm56/`

# Using bash script

- `qsub ...` 
    - `qsub -jc test.long -l h="node076&node069&node071&node078&node079&node066&node067&node068" /mnt/lustre/users/psych/dmm56/FictionEro/run.sh`
    - `qsub -q parallel.q -pe openmpi 4 /mnt/lustre/users/psych/dmm56/benchmark/run.sh`
- Options
    `-jc test.short (2h); test (8h); test.long (1 week); verylong (30 days)`
    `-l h_vmem=4G` virtual memory (max 5G)
    `-q smp.q -pe openmp 4`  4 OpenMP nodes
    `-q parallel.q -pe openmpi 4`  4 MPI nodes
    `-l h="node076&node069&node071&node078&node079&node066&node067&node068"` (**node076** - 2.50GHz 80 cores; **node069** - 2.60GHz 56 cores; **node071** - 3.00GHz 36 cores; **node078&node079** - 2.90GHz 32 cores; **node066&node067&node068** - 2.60GHz 24 cores)
    `-l m_core>16` (doesn't work)
- `qstat` (check on process)
- `top -u dmm56` (check usage, press `q` to quit)
- `qdel -j jobid` (kill process) 

# Interactive mode

- `qlogin` (login to a node)
- Then `R` to enter R

# Storage Locations

- `/mnt/lustre/scratch/psych/dmm56/`  (fast storage)
- `/mnt/lustre/users/psych/dmm56/`  (long-term storage)
- `/mnt/nfs2/psych/dmm56/` (home directory)




