library(rio)
library(dplyr)
library(quanteda)
library(quanteda.textstats)
library(ggplot2)

data_path <- "/Users/marcbokobza/Downloads/dataverse_files/1_identities_data_bornschieretal.RData"
output_dir <- "/Users/marcbokobza/Documents/Playground/output"

dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

dat_b <- import(data_path)

dat_b$votelrc <- "other or none"
dat_b$votelrc[dat_b$party %in% c("sp", "gps", "al, solidarites etc", "pda")] <- "new left"
dat_b$votelrc[dat_b$party %in% c("cvp", "fdp", "glp", "bdp", "evp")] <- "center-right"
dat_b$votelrc[dat_b$party %in% c("svp", "sd", "edu")] <- "far right"
dat_b$votelrc <- factor(dat_b$votelrc)

translations <- c(
  "links" = "left-wing",
  "sozial" = "social",
  "interessiert" = "interested",
  "offen" = "open",
  "weltoffen" = "cosmopolitan",
  "umweltbewusst" = "environmentally conscious",
  "interessieren" = "interested in politics",
  "umwelt" = "environment",
  "politisch" = "political",
  "studenten" = "students",
  "alternativ" = "alternative",
  "jung" = "young",
  "aktiv" = "active",
  "tolerant" = "tolerant",
  "politik" = "politics",
  "grün" = "green",
  "linke" = "leftists",
  "nachhaltigkeit" = "sustainability",
  "eingestellt" = "minded",
  "wichtig" = "important",
  "kulturell" = "cultural",
  "eigene" = "own",
  "kulturen" = "cultures",
  "mittelklasse" = "middle class",
  "ökologisch" = "ecological",
  "eher" = "rather",
  "vegan" = "vegan",
  "vegetarisch" = "vegetarian",
  "denken" = "think",
  "engagiert" = "engaged",
  "schweizer" = "Swiss",
  "bodenständige" = "down-to-earth people",
  "bodenständig" = "down-to-earth",
  "land" = "countryside",
  "rechts" = "right-wing",
  "konservativ" = "conservative",
  "bürgerlich" = "bourgeois",
  "direkt" = "direct",
  "eidgenossen" = "Swiss compatriots",
  "normale" = "ordinary",
  "ehrlich" = "honest",
  "arbeiter" = "workers",
  "ländlich" = "rural",
  "stehen" = "stand firm",
  "arbeiten" = "work",
  "einfache" = "simple",
  "zufrieden" = "content",
  "arbeitsam" = "hardworking",
  "boden" = "grounded",
  "heimatverbunden" = "attached to homeland"
)

corp_lr <- corpus(dat_b, text_field = "text_ingroup") %>%
  corpus_subset(votelrc == "far right" | votelrc == "new left")

dmat_id_lr <- corp_lr %>%
  tokens(remove_punct = TRUE) %>%
  tokens_remove(pattern = stopwords(language = "de")) %>%
  tokens_tolower() %>%
  dfm() %>%
  dfm_trim(min_termfreq = 3)

dmat_id_lr <- dfm_group(dmat_id_lr, groups = docvars(dmat_id_lr, "votelrc"))

tstat3 <- textstat_keyness(dmat_id_lr, target = "new left") %>%
  as_tibble() %>%
  mutate(direction = if_else(n_target >= n_reference, "new left", "far right"))

top_n <- 20L
plot_dat <- bind_rows(
  tstat3 %>% filter(direction == "new left") %>% slice_max(order_by = chi2, n = top_n, with_ties = FALSE),
  tstat3 %>% filter(direction == "far right") %>% slice_max(order_by = chi2, n = top_n, with_ties = FALSE)
) %>%
  mutate(
    signed_chi2 = if_else(direction == "new left", chi2, -chi2),
    feature_en = dplyr::recode(feature, !!!translations, .default = feature),
    feature_en = reorder(feature_en, signed_chi2),
    direction = recode(direction, "new left" = "New Left", "far right" = "Far Right")
  )

plot_obj <- ggplot(plot_dat, aes(x = signed_chi2, y = feature_en, fill = direction)) +
  geom_col(width = 0.8, show.legend = TRUE) +
  scale_fill_manual(values = c("Far Right" = "gray70", "New Left" = "black")) +
  labs(
    title = "Keyness statistics for ingroup descriptions",
    subtitle = "Comparison of new left and far right voters in Zollinger (2022) replication data",
    x = expression(paste("Signed ", chi^2, " keyness statistic")),
    y = NULL,
    fill = NULL
  ) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "bottom")

ggsave(file.path(output_dir, "keyness_new_left_ingroup_english.png"), plot_obj, width = 8, height = 8, dpi = 300)
ggsave(file.path(output_dir, "keyness_new_left_ingroup_english.pdf"), plot_obj, width = 8, height = 8)

write.csv(tstat3, file.path(output_dir, "keyness_new_left_ingroup_stats.csv"), row.names = FALSE)
write.csv(plot_dat, file.path(output_dir, "keyness_new_left_ingroup_plot_terms_english.csv"), row.names = FALSE)

print(
  plot_dat %>%
    arrange(desc(abs(signed_chi2))) %>%
    select(feature, feature_en, chi2, n_target, n_reference, direction)
)
