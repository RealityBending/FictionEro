library(tidyverse)
library(easystats)
# ID: picture category and number
# V/H: vertical / horizontal
# Av/Ap: avoidance - approach dimension
# M: mean
# SD: standard deviation
# JPEG_size80:index of overall complexity
# LABL: luminance in CIE L*a*b color space
# LABA: the amount of red color  CIE L*a*b color space
# LABB: the amount of the green color CIE L*a*b color space



# Combine and Tidyup Norms ------------------------------------------------


naps <- readxl::read_excel("13428_2013_379_MOESM1_ESM.xls",  skip = 3,
                           col_names = c("ID", "Category", "Nr", "VerticalHorizontal", "Description",
                                         "Women_Valence", "Women_Valence_SD", "Women_AvAp",
                                         "Women_AvAp_SD", "Women_Arousal", "Women_Arousal_SD",
                                         "Men_Valence", "Men_Valence_SD", "Men_AvAp", "Men_AvAp_SD",
                                         "Men_Arousal", "Men_Arousal_SD", "All_Valence",
                                         "All_Valence_SD", "All_AvAp", "All_AvAp_SD",
                                         "All_Arousal", "All_Arousal_SD", "Width",
                                         "Height", "Luminance", "Contrast",
                                         "JPEG_size80", "LABL", "LABA", "LABB", "Entropy",
                                         "Acronym", "X", "X2")) |>
  select(-X, -X2, -Acronym, -ends_with("_SD")) |>
  mutate(ID = paste0(ID, ".jpg"))

napsero <- readxl::read_excel("Data Sheet 1.XLSX", sheet = "Ratings") |>
  full_join(read_excel("Data Sheet 1.XLSX", sheet = "Image parameters"), by = join_by("ID", "Category")) |>
  select(-contains("_SD"), -contains("HoF"), -contains("HoM")) |>
  rename(VerticalHorizontal = `V/H`,
         Men_Valence = val_M_HeM,
         Women_Valence = val_M_HeF,
         Men_Arousal = aro_M_HeM,
         Women_Arousal = aro_M_HeF) |>
  mutate(across(c("Luminance", "Contrast", "JPEG_size80", "LABL", "LABA", "LABB", "Entropy"), as.numeric),
         Description = NA)


# Join
naps <- filter(naps, ID %in% filter(napsero, Category == "Non-erotic")$ID)
naps[c("Men_Arousal", "Men_Valence", "Women_Valence", "Women_Arousal", "Nr", "VerticalHorizontal")] <- NA
napsero[napsero$Category== "Non-erotic", "Category"] <- NA

# naps2 <- left_join(napsero, naps)
ids <- napsero[is.na(napsero$Category), ]$ID
for(c in c("Category", "Height", "Width", "Luminance", "Contrast",
           "JPEG_size80", "LABL", "LABA", "LABB", "Entropy", "Description")) {
  napsero[napsero$ID == ids, c] <- naps[naps$ID == ids, c]
}


# Selection ---------------------------------------------------------------
# Remove couples
df <- napsero |>
  filter(Category %in% c("Male", "Female", "Faces", "People")) |>
  mutate(Condition = ifelse(Category %in% c("Female", "Male"), "Erotic", "Non-erotic"))






# Manual filtering




men <- df |>
  filter(Condition == "Erotic") |>
  group_by(Category) |>
  slice_max(Men_Arousal, n=4) |>
  pull(ID)

women <- df |>
  filter(Condition == "Erotic", !ID %in% men) |>
  group_by(Category) |>
  slice_max(Women_Arousal, n=4) |>
  pull(ID)

neutral <- df |>
  filter(Condition == "Non-erotic", !ID %in% c(men, women)) |>
  mutate(Arousal = (Men_Arousal + Women_Arousal) / 2) |>
  slice_min(Arousal, n=8) |>
  pull(ID)

pos_arousing <- df |>
  filter(Condition == "Non-erotic", !ID %in% c(men, women, neutral)) |>
  mutate(Arousal = (Men_Arousal + Women_Arousal) / 2,
         Valence = (Men_Valence + Women_Valence) / 2) |>
  filter(Valence > 5) |>
  slice_max(Arousal, n=8) |>
  pull(ID)

selected <- unique(c(men, women, neutral, pos_arousing))

cat(
  paste0("N (men) = ", length(men), "\nN (women) = ", length(women),
       "\nN (neutral) = ", length(neutral),  "\nN (arousing-positive) = ", length(pos_arousing),
       "\nTotal = ", length(selected))
)

# Visualization -----------------------------------------------------------


df |>
  mutate(Selected = ifelse(ID %in% selected, TRUE, FALSE)) |>
  pivot_longer(cols = c("Men_Valence", "Men_Arousal", "Women_Valence", "Women_Arousal")) |>
  separate(name, into=c("Target", "Variable")) |>
  pivot_wider(names_from=Variable, values_from=value) |>
  ggplot(aes(x=Valence, y=Arousal, color=Category)) +
  geom_point(aes(shape=Selected), size=8) +
  scale_shape_manual(values=c("TRUE"=19, "FALSE"=4)) +
  guides(shape = guide_legend(override.aes = list(color="white"))) +
  facet_grid(~Target) +
  theme_abyss()

