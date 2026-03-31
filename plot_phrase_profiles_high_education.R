library(rio)
library(dplyr)
library(quanteda)
library(ggplot2)

data_path <- "/Users/marcbokobza/Downloads/dataverse_files/1_identities_data_bornschieretal.RData"
output_dir <- "/Users/marcbokobza/Documents/Playground/output"

dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

token_translations <- c(
  "offen" = "open",
  "neues" = "new things",
  "politisch" = "politically",
  "links" = "left-wing",
  "eher" = "rather",
  "interessiert" = "interested",
  "kulturell" = "culturally",
  "freundlich" = "friendly",
  "sozial" = "social",
  "eigene" = "own",
  "meinung" = "opinion",
  "tolerant" = "tolerant",
  "engagiert" = "engaged",
  "umweltbewusst" = "environmentally conscious",
  "menschen" = "people",
  "guter" = "good",
  "gut" = "well",
  "ausgebildet" = "educated",
  "mitte" = "center",
  "normale" = "ordinary",
  "leute" = "people",
  "bürger" = "citizens",
  "vielseitig" = "versatile",
  "weltoffen" = "cosmopolitan",
  "gegenüber" = "toward others",
  "bodenständige" = "down-to-earth",
  "gerne" = "likes",
  "natur" = "nature",
  "gehobener" = "upper",
  "mittelstand" = "middle class",
  "rechts" = "right-wing",
  "orientiert" = "oriented",
  "stur" = "stubborn",
  "egoistisch" = "selfish",
  "arrogant" = "arrogant",
  "eingebildet" = "conceited",
  "geld" = "money",
  "svp" = "SVP",
  "fdp" = "FDP",
  "ändern" = "change",
  "rechtsextreme" = "far-right extremists",
  "stark" = "strongly",
  "denen" = "them",
  "leben" = "live",
  "selber" = "for themselves",
  "denken" = "think",
  "uninteressiert" = "uninterested",
  "gleichgültig" = "indifferent",
  "tag" = "day",
  "hinein" = "by the day",
  "konservativ" = "conservative",
  "ängstlich" = "fearful",
  "festgefahrenen" = "rigid",
  "meinungen" = "opinions"
)

translate_phrase <- function(x) {
  parts <- strsplit(x, "_", fixed = TRUE)[[1]]
  translated <- vapply(parts, function(part) {
    if (part %in% names(token_translations)) {
      token_translations[[part]]
    } else {
      part
    }
  }, character(1))
  paste(translated, collapse = " ")
}

make_votelrc <- function(dat) {
  dat$votelrc <- NA_character_
  dat$votelrc[dat$party %in% c("sp", "gps", "al, solidarites etc", "pda")] <- "Left-leaning"
  dat$votelrc[dat$party %in% c("cvp", "fdp", "glp", "bdp", "evp", "svp", "sd", "edu")] <- "Right-leaning"
  dat$votelrc
}

compute_phrase_table <- function(dat, text_field, top_n = 12L, min_doc_count = 2L) {
  dat_subset <- dat %>%
    mutate(votelrc = make_votelrc(.)) %>%
    filter(edugrp == "high", votelrc %in% c("Left-leaning", "Right-leaning"))

  phrase_dfm <- corpus(dat_subset, text_field = text_field) %>%
    tokens(remove_punct = TRUE, remove_symbols = TRUE, remove_numbers = TRUE) %>%
    tokens_remove(stopwords(language = "de")) %>%
    tokens_tolower() %>%
    tokens_ngrams(n = 2:3) %>%
    dfm()

  keep_docs <- ntoken(phrase_dfm) > 0
  phrase_dfm <- phrase_dfm[keep_docs, ]
  group_vec <- docvars(phrase_dfm, "votelrc")
  bool_mat <- as.matrix(dfm_weight(phrase_dfm, scheme = "boolean"))
  counts <- table(group_vec)

  group_tables <- lapply(c("Left-leaning", "Right-leaning"), function(grp) {
    idx <- which(group_vec == grp)
    freq <- sort(colSums(bool_mat[idx, , drop = FALSE]), decreasing = TRUE)
    freq <- freq[freq >= min_doc_count]
    tibble(
      group = grp,
      phrase = names(freq),
      doc_count = as.integer(freq),
      doc_share = as.numeric(freq) / length(idx) * 100
    ) %>%
      slice_head(n = top_n)
  })

  bind_rows(group_tables) %>%
    mutate(
      phrase_en = vapply(phrase, translate_phrase, character(1)),
      group = factor(group, levels = c("Left-leaning", "Right-leaning"))
    ) %>%
    group_by(group) %>%
    arrange(doc_share, .by_group = TRUE) %>%
    mutate(phrase_plot = factor(phrase_en, levels = unique(phrase_en))) %>%
    ungroup() %>%
    arrange(group, desc(doc_share)) %>%
    mutate(n_left = unname(counts["Left-leaning"]), n_right = unname(counts["Right-leaning"]))
}

make_phrase_plot <- function(dat, text_field, stem) {
  phrase_table <- compute_phrase_table(dat, text_field)
  n_left <- phrase_table$n_left[[1]]
  n_right <- phrase_table$n_right[[1]]

  plot_title <- if (text_field == "text_ingroup") {
    "High-Education Ingroup Phrase Profiles"
  } else {
    "High-Education Outgroup Phrase Profiles"
  }

  plot_obj <- ggplot(phrase_table, aes(x = doc_share, y = phrase_plot, fill = group)) +
    geom_col(width = 0.8, show.legend = FALSE) +
    facet_wrap(~ group, scales = "free_y") +
    scale_fill_manual(values = c("Left-leaning" = "black", "Right-leaning" = "gray70")) +
    labs(
      title = plot_title,
      subtitle = paste0(
        "High education only. Share of responses containing each translated phrase. ",
        "n = ", n_left, " left-leaning, ", n_right, " right-leaning."
      ),
      x = "Share of responses (%)",
      y = NULL
    ) +
    theme_minimal(base_size = 12)

  png_path <- file.path(output_dir, paste0(stem, ".png"))
  pdf_path <- file.path(output_dir, paste0(stem, ".pdf"))
  csv_path <- file.path(output_dir, paste0(stem, ".csv"))

  ggsave(png_path, plot_obj, width = 11, height = 8, dpi = 300)
  ggsave(pdf_path, plot_obj, width = 11, height = 8)
  write.csv(phrase_table, csv_path, row.names = FALSE)

  print(phrase_table %>% select(group, phrase, phrase_en, doc_count, doc_share))
}

dat_b <- import(data_path)

make_phrase_plot(dat_b, "text_ingroup", "phrase_profiles_high_education_ingroup")
make_phrase_plot(dat_b, "text_outgroup", "phrase_profiles_high_education_outgroup")
