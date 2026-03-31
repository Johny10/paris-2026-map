library(rio)
library(dplyr)
library(quanteda)
library(quanteda.textstats)
library(ggplot2)

data_path <- "/Users/marcbokobza/Downloads/dataverse_files/1_identities_data_bornschieretal.RData"
output_dir <- "/Users/marcbokobza/Documents/Playground/output"

dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

translations <- c(
  "sozial" = "social",
  "links" = "left-wing",
  "linke" = "leftists",
  "politisch" = "political",
  "interessiert" = "interested",
  "umweltbewusst" = "environmentally conscious",
  "denken" = "think",
  "tolerant" = "tolerant",
  "umwelt" = "environment",
  "offen" = "open",
  "politik" = "politics",
  "eher" = "rather",
  "familie" = "family",
  "kinder" = "children",
  "menschen" = "people",
  "alternativ" = "alternative",
  "personen" = "people",
  "arbeiten" = "work",
  "dass" = "that",
  "bodenständige" = "down-to-earth people",
  "rechts" = "right-wing",
  "bürger" = "citizens",
  "gerne" = "gladly",
  "hilfsbereit" = "helpful",
  "bürgerlich" = "bourgeois",
  "direkt" = "direct",
  "staat" = "state",
  "weiss" = "white",
  "gut" = "good",
  "schweizer" = "Swiss",
  "bodenständig" = "down-to-earth",
  "denen" = "them",
  "ausländerfeindlich" = "xenophobic",
  "innen" = "within",
  "intolerant" = "intolerant",
  "verschlossen" = "closed-off",
  "egal" = "indifferent",
  "eigene" = "own",
  "rassistisch" = "racist",
  "stur" = "stubborn",
  "asozial" = "antisocial",
  "fremdenfeindlich" = "anti-immigrant",
  "svp" = "SVP",
  "wichtig" = "important",
  "gleichberechtigung" = "equal rights",
  "interessieren" = "interest",
  "lustig" = "fun",
  "ahnung" = "clue",
  "grün" = "green",
  "grüne" = "greens",
  "langweilig" = "boring",
  "stadt" = "city",
  "städter" = "city dwellers",
  "tag" = "day",
  "sehen" = "see",
  "gesellschaft" = "society",
  "kommt" = "comes",
  "ungebildet" = "uneducated",
  "hinterfragen" = "question things",
  "kulturell" = "cultural",
  "daran" = "about it",
  "gerechtigkeit" = "justice",
  "finden" = "find",
  "ländlich" = "rural",
  "negativ" = "negative"
  ,
  "linke" = "leftists",
  "unglücklich" = "unhappy",
  "vorurteile" = "prejudices",
  "ändern" = "change",
  "person" = "person",
  "progressive" = "progressive"
)

make_votelrc <- function(dat) {
  dat$votelrc <- NA_character_
  dat$votelrc[dat$party %in% c("sp", "gps", "al, solidarites etc", "pda")] <- "left-leaning"
  dat$votelrc[dat$party %in% c("cvp", "fdp", "glp", "bdp", "evp", "svp", "sd", "edu")] <- "right-leaning"
  dat$votelrc
}

make_keyness_plot <- function(dat, text_field, stem, top_n = 15L) {
  dat_subset <- dat %>%
    mutate(votelrc = make_votelrc(.)) %>%
    filter(edugrp == "high", votelrc %in% c("left-leaning", "right-leaning"))

  corp <- corpus(dat_subset, text_field = text_field)

  dfm_docs <- corp %>%
    tokens(remove_punct = TRUE) %>%
    tokens_remove(pattern = stopwords(language = "de")) %>%
    tokens_tolower() %>%
    dfm() %>%
    dfm_trim(min_termfreq = 3)

  doc_token_counts <- ntoken(dfm_docs)
  kept <- doc_token_counts > 0
  dfm_docs <- dfm_docs[kept, ]

  counts <- table(docvars(dfm_docs, "votelrc"))
  dfm_grouped <- dfm_group(dfm_docs, groups = docvars(dfm_docs, "votelrc"))

  tstat <- textstat_keyness(dfm_grouped, target = "left-leaning") %>%
    as_tibble() %>%
    mutate(direction = if_else(n_target >= n_reference, "Left-leaning", "Right-leaning"))

  plot_dat <- bind_rows(
    tstat %>% filter(direction == "Left-leaning") %>% slice_max(order_by = chi2, n = top_n, with_ties = FALSE),
    tstat %>% filter(direction == "Right-leaning") %>% slice_min(order_by = chi2, n = top_n, with_ties = FALSE)
  ) %>%
    mutate(
      signed_chi2 = if_else(direction == "Left-leaning", chi2, chi2),
      feature_en = dplyr::recode(feature, !!!translations, .default = feature),
      feature_en = reorder(feature_en, signed_chi2)
    )

  plot_title <- if (text_field == "text_ingroup") {
    "High-Education Ingroup Keyness"
  } else {
    "High-Education Outgroup Keyness"
  }

  subtitle_text <- paste0(
    "High education only. n = ", counts[["left-leaning"]], " left-leaning, ",
    counts[["right-leaning"]], " right-leaning non-empty responses."
  )

  plot_obj <- ggplot(plot_dat, aes(x = signed_chi2, y = feature_en, fill = direction)) +
    geom_col(width = 0.8) +
    scale_fill_manual(values = c("Left-leaning" = "black", "Right-leaning" = "gray70")) +
    labs(
      title = plot_title,
      subtitle = subtitle_text,
      x = expression(paste(chi^2, " keyness statistic")),
      y = NULL,
      fill = NULL
    ) +
    theme_minimal(base_size = 12) +
    theme(legend.position = "bottom")

  png_path <- file.path(output_dir, paste0(stem, ".png"))
  pdf_path <- file.path(output_dir, paste0(stem, ".pdf"))
  csv_path <- file.path(output_dir, paste0(stem, "_stats.csv"))
  plot_csv_path <- file.path(output_dir, paste0(stem, "_plot_terms_english.csv"))

  ggsave(png_path, plot_obj, width = 8, height = 8, dpi = 300)
  ggsave(pdf_path, plot_obj, width = 8, height = 8)
  write.csv(tstat, csv_path, row.names = FALSE)
  write.csv(plot_dat, plot_csv_path, row.names = FALSE)

  print(plot_dat %>% arrange(desc(abs(chi2))) %>% select(feature, feature_en, chi2, n_target, n_reference, direction))
  invisible(list(counts = counts, png = png_path, pdf = pdf_path))
}

dat_b <- import(data_path)

ingroup_res <- make_keyness_plot(dat_b, "text_ingroup", "keyness_high_education_ingroup")
outgroup_res <- make_keyness_plot(dat_b, "text_outgroup", "keyness_high_education_outgroup")

print(ingroup_res$counts)
print(outgroup_res$counts)
