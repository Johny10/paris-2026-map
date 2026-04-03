(async function () {
  const SOURCE_URLS = {
    geometry:
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/secteurs-des-bureaux-de-vote-2026/exports/geojson?limit=-1",
    round1Page: "https://www.paris.fr/elections/municipales-2026-premier-tour",
    round2Page: "https://www.paris.fr/elections/municipales-2026-second-tour",
    round1Json:
      "https://cdn.paris.fr/paris/2026/03/18/dc6eb426c9a69721c40d845492d6046c.json",
    round2Json:
      "https://cdn.paris.fr/paris/2026/03/23/1c44370057138acd63333e945033e3a3.json",
  };
  const OFFICIAL_HISTORY = window.PARIS_OFFICIAL_HISTORY || { years: [], history: {}, geojson: null, familyMeta: {} };
  const LOCAL_2026 = window.PARIS_2026_LOCAL_DATA || null;
  const IS_LOCAL_CONTEXT =
    window.location.protocol === "file:" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";
  const POLITICAL_COLORS = Object.freeze({
    left: "#e14b5a",
    right: "#2f6fdf",
    greens: "#2b9348",
    lfiLike: "#d9487a",
    center: "#f08c00",
    centerRight: "#1098ad",
    farRight: "#6a4c93",
    farLeft: "#8b0000",
    other: "#7d776f",
    dissRight: "#6f7fb7",
  });

  const STATIC_HISTORY = [
    {
      year: "1995",
      label: "1995",
      firstDate: "11 juin 1995",
      secondDate: "18 juin 1995",
      turnout: { first: 49.69, second: 53.05 },
      winner: {
        name: "Jean Tiberi",
        partyLabel: { fr: "Droite parlementaire", en: "Parliamentary right" },
        shortLabel: { fr: "Droite", en: "Right" },
        color: POLITICAL_COLORS.right,
      },
      shares: [
        { id: "right", label: { fr: "Droite parlementaire", en: "Parliamentary right" }, color: POLITICAL_COLORS.right, first: 47.73, second: 47.9 },
        { id: "left", label: { fr: "Gauche parlementaire", en: "Parliamentary left" }, color: POLITICAL_COLORS.left, first: 34.58, second: 46.47 },
        { id: "ecology", label: { fr: "Écologie", en: "Ecology" }, color: POLITICAL_COLORS.greens, first: 7.12, second: 0 },
        { id: "farRight", label: { fr: "Extrême droite", en: "Far right" }, color: POLITICAL_COLORS.farRight, first: 10.04, second: 5.62 },
      ],
      notes: {
        fr: "Première municipale parisienne de la période demandée. Il n’existe pas d’élection municipale parisienne en 1990 ; la série électorale commence ici en juin 1995.",
        en: "This is the first Paris municipal election in the requested range. There was no Paris municipal election in 1990; the electoral series starts here in June 1995.",
      },
      source: "https://fr.wikipedia.org/wiki/%C3%89lections_municipales_de_1995_%C3%A0_Paris",
    },
    {
      year: "2001",
      label: "2001",
      firstDate: "11 mars 2001",
      secondDate: "18 mars 2001",
      turnout: { first: 62.45, second: 64.13 },
      winner: {
        name: "Bertrand Delanoë",
        partyLabel: { fr: "Gauche plurielle", en: "Plural left" },
        shortLabel: { fr: "Gauche", en: "Left" },
        color: POLITICAL_COLORS.left,
      },
      shares: [
        { id: "left", label: { fr: "Gauche plurielle", en: "Plural left" }, color: POLITICAL_COLORS.left, first: 31.31, second: 49.6 },
        { id: "right", label: { fr: "Droite classique", en: "Mainstream right" }, color: POLITICAL_COLORS.right, first: 25.74, second: 36.17 },
        { id: "dissRight", label: { fr: "Droite dissidente", en: "Dissident right" }, color: POLITICAL_COLORS.dissRight, first: 13.92, second: 12.31 },
        { id: "greens", label: { fr: "Écologistes", en: "Greens" }, color: POLITICAL_COLORS.greens, first: 12.35, second: 0 },
      ],
      notes: {
        fr: "Basculer à 2001 permet de voir la conquête de Paris par Bertrand Delanoë. Les écologistes sont ici séparés de la gauche socialiste, contrairement au raccourci fautif que tu signalais.",
        en: "Switching to 2001 shows Bertrand Delanoe’s takeover of Paris. Greens are kept separate from the socialist left here, instead of being folded into it.",
      },
      source: "https://fr.wikipedia.org/wiki/%C3%89lections_municipales_de_2001_%C3%A0_Paris",
    },
    {
      year: "2008",
      label: "2008",
      firstDate: "9 mars 2008",
      secondDate: "16 mars 2008",
      turnout: { first: 56.93, second: 56.67 },
      winner: {
        name: "Bertrand Delanoë",
        partyLabel: { fr: "Gauche municipale", en: "Municipal left" },
        shortLabel: { fr: "Gauche", en: "Left" },
        color: POLITICAL_COLORS.left,
      },
      shares: [
        { id: "left", label: { fr: "PS-PCF-PRG-MRC", en: "Social-democratic left" }, color: POLITICAL_COLORS.left, first: 41.6, second: 57.71 },
        { id: "right", label: { fr: "UMP et alliés", en: "UMP and allies" }, color: POLITICAL_COLORS.right, first: 27.92, second: 36.07 },
        { id: "center", label: { fr: "Centre (MoDem)", en: "Centre (MoDem)" }, color: POLITICAL_COLORS.center, first: 9.06, second: 2.36 },
        { id: "greens", label: { fr: "Écologistes", en: "Greens" }, color: POLITICAL_COLORS.greens, first: 6.78, second: 0 },
      ],
      notes: {
        fr: "Le centre pèse encore fortement en 2008, tandis que les écologistes restent autonomes au premier tour avant fusion.",
        en: "The centre still matters a lot in 2008, while Greens remain autonomous in the first round before merging.",
      },
      source: "https://fr.wikipedia.org/wiki/%C3%89lections_municipales_de_2008_%C3%A0_Paris",
    },
    {
      year: "2014",
      label: "2014",
      firstDate: "23 mars 2014",
      secondDate: "30 mars 2014",
      turnout: { first: 54.17, second: 58.03 },
      winner: {
        name: "Anne Hidalgo",
        partyLabel: { fr: "Gauche social-démocrate", en: "Social-democratic left" },
        shortLabel: { fr: "Gauche", en: "Left" },
        color: POLITICAL_COLORS.left,
      },
      shares: [
        { id: "right", label: { fr: "UMP-UDI-MoDem", en: "UMP-UDI-MoDem" }, color: POLITICAL_COLORS.right, first: 35.91, second: 44.06 },
        { id: "left", label: { fr: "PS-PCF-PRG", en: "Social-democratic left" }, color: POLITICAL_COLORS.left, first: 34.4, second: 53.33 },
        { id: "greens", label: { fr: "Écologistes", en: "Greens" }, color: POLITICAL_COLORS.greens, first: 8.86, second: 0 },
        { id: "lfiLike", label: { fr: "Gauche radicale", en: "Radical left" }, color: POLITICAL_COLORS.lfiLike, first: 4.94, second: 1.35 },
      ],
      notes: {
        fr: "Anne Hidalgo gagne Paris en 2014. La gauche radicale, ici portée par Danielle Simonnet, est distinguée des écologistes.",
        en: "Anne Hidalgo wins Paris in 2014. The radical left, led here by Danielle Simonnet, is kept separate from the Greens.",
      },
      source: "https://fr.wikipedia.org/wiki/%C3%89lections_municipales_de_2014_%C3%A0_Paris",
    },
    {
      year: "2020",
      label: "2020",
      firstDate: "15 mars 2020",
      secondDate: "28 juin 2020",
      turnout: { first: 42.3, second: 36.7 },
      winner: {
        name: "Anne Hidalgo",
        partyLabel: { fr: "Gauche municipale", en: "Municipal left" },
        shortLabel: { fr: "Gauche", en: "Left" },
        color: POLITICAL_COLORS.left,
      },
      shares: [
        { id: "left", label: { fr: "PS-PCF-alliés", en: "Social-democratic left" }, color: POLITICAL_COLORS.left, first: 29.33, second: 48.49 },
        { id: "right", label: { fr: "LR et alliés", en: "Republican right" }, color: POLITICAL_COLORS.right, first: 22.72, second: 34.31 },
        { id: "center", label: { fr: "Centre macroniste", en: "Macronist centre" }, color: POLITICAL_COLORS.center, first: 25.14, second: 13.98 },
        { id: "greens", label: { fr: "Écologistes", en: "Greens" }, color: POLITICAL_COLORS.greens, first: 10.79, second: 0 },
        { id: "lfiLike", label: { fr: "LFI et gauche radicale", en: "LFI and radical left" }, color: POLITICAL_COLORS.lfiLike, first: 4.57, second: 1.06 },
      ],
      notes: {
        fr: "2020 est la bonne comparaison pour rappeler que LFI n’est pas un parti écologiste. Ici, la liste Simonnet reste distincte de la liste Belliard.",
        en: "2020 is the right comparison point to show that LFI is not a Green party. Simonnet’s list stays distinct from Belliard’s Green list.",
      },
      source: "https://fr.wikipedia.org/wiki/%C3%89lections_municipales_de_2020_%C3%A0_Paris",
    },
  ];

  const DEMOGRAPHY = {
    population: [
      { year: 1990, value: 2152423 },
      { year: 1999, value: 2125246 },
      { year: 2009, value: 2234105 },
      { year: 2014, value: 2220445 },
      { year: 2020, value: 2145906 },
    ],
    tertiary: [
      { year: 2010, value: 55.0 },
      { year: 2015, value: 59.0 },
    ],
    sourcePopulation: "https://www.insee.fr/fr/statistiques/7633058?geo=COM-75056",
    sourceEducation: "https://www.insee.fr/fr/statistiques/3568823?geo=COM-75056",
  };

  const I18N = {
    fr: {
      eyebrow: "Paris municipales",
      heroTitle: "Paris, bureau par bureau et décennie par décennie.",
      heroText:
        "La carte reste centrée sur 2026 au niveau bureau, avec une vue simplifiée arrondissement. À côté, une chronologie remonte jusqu’aux municipales de 1995, et un volet démographie montre comment la capitale et son électorat ont évolué.",
      language: "Langue",
      section: "Section",
      election: "Élection",
      round: "Tour",
      granularity: "Granularité",
      observe: "Observer",
      partyOrList: "Parti ou liste",
      candidateHint: "Le parti passe en premier dans le menu, avec un point coloré pour rappeler la famille politique.",
      map: "Carte 2026",
      history: "Chronologie",
      demography: "Démographie",
      bureau: "Bureaux",
      arrondissement: "Arrondissements",
      firstRound: "Premier tour",
      secondRound: "Second tour",
      leader: "Tête",
      turnout: "Participation",
      voteShare: "Part des voix",
      currentWinner: "Gagnant courant",
      currentWinnerFootnote:
        "Le bloc gagnant suit le tour affiché. La carte détaillée est volontairement limitée à 2026, la série historique étant restituée à une maille plus simple.",
      no1990:
        "Pas d’élection municipale parisienne en 1990 : la série électorale parisienne affichée ici commence les 11 et 18 juin 1995.",
      mapKicker: "Carte mobile-first",
      historyKicker: "Chronologie",
      demographyKicker: "Démographie",
      reset: "Réinitialiser",
      turnoutAtBureau: "Participation au niveau bureau",
      historicalWindow: "Municipales 1995-2026",
      liveFeed: "Flux officiels Ville de Paris",
      mapSummary: "Résumé de la carte",
      selected: "Sélection",
      howToRead: "Comment lire la carte",
      hoverOrTap: "Survolez ou touchez un secteur",
      hoverText:
        "En mode arrondissement, chaque bureau reprend la couleur agrégée de son arrondissement. En mode bureaux, la carte montre la finesse maximale disponible pour 2026.",
      selectedBureau: "Bureau sélectionné",
      selectedArr: "Arrondissement sélectionné",
      leaderLabel: "Bloc en tête",
      expressedVotes: "Suffrages exprimés",
      registered: "Inscrits",
      turnoutLabel: "Participation",
      counted: "Dépouillé",
      stillCounting: "Toujours signalé en dépouillement",
      noDataYet: "Pas encore de votes remontés",
      noDataYetCopy:
        "Cette zone n’a pas encore de résultats exploitables dans le flux actuellement affiché.",
      countingProgress: "Bureaux consolidés",
      partialResults: "Résultats partiels",
      noResultsInSelection: "Aucun résultat détaillé à afficher pour cette sélection.",
      mapNoDataLegend: "Les zones grisées correspondent aux secteurs sans résultat consolidé.",
      winnerCard: "Tête à Paris",
      strongestArea: "Zone la plus favorable",
      topTurnout: "Mobilisation la plus forte",
      districtsLed: "Arrondissements dominés",
      sourceTitle: "Sources et méthode",
      mapTitleLive: "Paris 2026, carte vivante",
      liveOnly:
        "La maille bureau est disponible pour 2026. Les années 1995 à 2020 sont restituées dans l’onglet chronologie avec des séries plus synthétiques.",
      historyTitle: "Municipales parisiennes depuis 1995",
      demographyTitle: "Paris change, le vote aussi",
      historyChartTitle: "Rapports de force",
      historyEvolutionTitle: "Lecture politique",
      demoSummaryTitle: "Repères démographiques",
      populationTitle: "Population municipale",
      educationTitle: "Part de diplômés du supérieur",
      populationFootnote:
        "Source : Insee, population en historique depuis 1968 pour la commune de Paris (75056).",
      educationFootnote:
        "Série comparable de diplôme disponible ici à partir de 2010 dans cette version de l’app.",
      sourceFootnote:
        "2026 : Ville de Paris. Historique électoral : synthèses publiques des municipales parisiennes. Démographie : Insee.",
      tooltipTurnout: "Participation",
      tooltipLeader: "Tête",
      tooltipRegistered: "Inscrits",
      leadShare: "Score de tête",
      arrondissementSuffix: "e arrondissement",
      parisCentre: "Paris Centre",
      loading: "Chargement",
      loadingCopy: "Récupération de la géométrie 2026 et des résultats officiels.",
      loadError: "Erreur de chargement",
      historyNotesLabel: "Ce qu’il faut retenir",
      firstRoundShare: "1er tour",
      secondRoundShare: "2d tour",
      winnerByYear: "Vainqueur par cycle",
      population1990: "Population depuis 1990",
      tertiarySince2010: "Supérieur depuis 2010",
      mapDescription: "Vue locale 2026",
      sources: "Sources",
    },
    en: {
      eyebrow: "Paris mayoral elections",
      heroTitle: "Paris, from polling station detail to long-run change.",
      heroText:
        "The map stays focused on 2026 at polling-station level, with a simplified district view. Alongside it, a timeline goes back to the 1995 municipal election, and a demography section tracks how the capital and its electorate have changed.",
      language: "Language",
      section: "Section",
      election: "Election",
      round: "Round",
      granularity: "Granularity",
      observe: "Observe",
      partyOrList: "Party or list",
      candidateHint: "The dropdown leads with the political family, and the colored dot matches that family.",
      map: "2026 map",
      history: "Timeline",
      demography: "Demography",
      bureau: "Polling stations",
      arrondissement: "Districts",
      firstRound: "First round",
      secondRound: "Second round",
      leader: "Leader",
      turnout: "Turnout",
      voteShare: "Vote share",
      currentWinner: "Current winner",
      currentWinnerFootnote:
        "The winning bloc follows the round on screen. Detailed mapping is intentionally limited to 2026, while older elections are shown in a simpler historical layer.",
      no1990:
        "There was no Paris municipal election in 1990, so the electoral series shown here begins on June 11 and June 18, 1995.",
      mapKicker: "Mobile-first map",
      historyKicker: "Timeline",
      demographyKicker: "Demography",
      reset: "Reset",
      turnoutAtBureau: "Turnout at polling-station level",
      historicalWindow: "Municipal elections 1995-2026",
      liveFeed: "Live Ville de Paris feeds",
      mapSummary: "Map snapshot",
      selected: "Selection",
      howToRead: "How to read the map",
      hoverOrTap: "Hover or tap an area",
      hoverText:
        "In district mode, each polling station inherits the aggregate color of its district. In polling-station mode, the map uses the finest available 2026 geometry.",
      selectedBureau: "Selected polling station",
      selectedArr: "Selected district",
      leaderLabel: "Leading bloc",
      expressedVotes: "Expressed votes",
      registered: "Registered voters",
      turnoutLabel: "Turnout",
      counted: "Counted",
      stillCounting: "Still flagged as counting",
      noDataYet: "No reported votes yet",
      noDataYetCopy:
        "This area does not yet have usable vote results in the currently displayed feed.",
      countingProgress: "Polling stations counted",
      partialResults: "Partial results",
      noResultsInSelection: "No detailed results are available for this selection yet.",
      mapNoDataLegend: "Greyed areas indicate sectors without consolidated results.",
      winnerCard: "Citywide leader",
      strongestArea: "Strongest area",
      topTurnout: "Highest turnout",
      districtsLed: "Districts led",
      sourceTitle: "Sources and method",
      mapTitleLive: "Paris 2026, live map",
      liveOnly:
        "Polling-station geometry is available for 2026. The 1995-2020 cycles are shown in the timeline tab with more synthetic series.",
      historyTitle: "Paris municipal elections since 1995",
      demographyTitle: "Paris changes, so does the vote",
      historyChartTitle: "Balance of forces",
      historyEvolutionTitle: "Political reading",
      demoSummaryTitle: "Demographic anchors",
      populationTitle: "Municipal population",
      educationTitle: "Share with tertiary education",
      populationFootnote:
        "Source: Insee, historical population series for the commune of Paris (75056).",
      educationFootnote:
        "Comparable education data starts in 2010 in this version of the app.",
      sourceFootnote:
        "2026: Ville de Paris. Electoral history: public summaries of Paris municipal elections. Demography: Insee.",
      tooltipTurnout: "Turnout",
      tooltipLeader: "Leader",
      tooltipRegistered: "Registered",
      leadShare: "Lead share",
      arrondissementSuffix: "th arrondissement",
      parisCentre: "Paris Centre",
      loading: "Loading",
      loadingCopy: "Fetching 2026 geometry and official results.",
      loadError: "Load error",
      historyNotesLabel: "What stands out",
      firstRoundShare: "Round 1",
      secondRoundShare: "Round 2",
      winnerByYear: "Winner by cycle",
      population1990: "Population since 1990",
      tertiarySince2010: "Tertiary degree since 2010",
      mapDescription: "Local 2026 view",
      sources: "Sources",
    },
  };

  const state = {
    language: "fr",
    section: "map",
    year: "2026",
    round: "round2",
    granularity: "bureau",
    metric: "leader",
    candidate: null,
    dropdownOpen: false,
    hoveredKey: null,
    selectedKey: null,
  };

  const dom = {
    eyebrow: document.getElementById("eyebrow"),
    heroTitle: document.getElementById("hero-title"),
    heroText: document.getElementById("hero-text"),
    winnerBanner: document.getElementById("winner-banner"),
    heroMeta: document.getElementById("hero-meta"),
    languageLabel: document.getElementById("language-label"),
    languageToggle: document.getElementById("language-toggle"),
    sectionLabel: document.getElementById("section-label"),
    sectionToggle: document.getElementById("section-toggle"),
    yearGroup: document.getElementById("year-group"),
    yearLabel: document.getElementById("year-label"),
    yearToggle: document.getElementById("year-toggle"),
    roundGroup: document.getElementById("round-group"),
    roundLabel: document.getElementById("round-label"),
    roundToggle: document.getElementById("round-toggle"),
    granularityGroup: document.getElementById("granularity-group"),
    granularityLabel: document.getElementById("granularity-label"),
    granularityToggle: document.getElementById("granularity-toggle"),
    metricGroup: document.getElementById("metric-group"),
    metricLabel: document.getElementById("metric-label"),
    metricToggle: document.getElementById("metric-toggle"),
    candidateGroup: document.getElementById("candidate-group"),
    candidateLabel: document.getElementById("candidate-label"),
    candidateHint: document.getElementById("candidate-hint"),
    candidateShell: document.getElementById("candidate-shell"),
    candidateTrigger: document.getElementById("candidate-trigger"),
    candidateTriggerLabel: document.getElementById("candidate-trigger-label"),
    candidateDot: document.getElementById("candidate-dot"),
    candidateMenu: document.getElementById("candidate-menu"),
    candidateSelect: document.getElementById("candidate-select"),
    mapView: document.getElementById("map-view"),
    mapKicker: document.getElementById("map-kicker"),
    mapTitle: document.getElementById("map-title"),
    mapSummary: document.getElementById("map-summary"),
    detailCard: document.getElementById("detail-card"),
    legend: document.getElementById("legend"),
    resetView: document.getElementById("reset-view"),
    historyView: document.getElementById("history-view"),
    historyKicker: document.getElementById("history-kicker"),
    historyTitle: document.getElementById("history-title"),
    historySummary: document.getElementById("history-summary"),
    historyChart: document.getElementById("history-chart"),
    historyEvolution: document.getElementById("history-evolution"),
    demographyView: document.getElementById("demography-view"),
    demographyKicker: document.getElementById("demography-kicker"),
    demographyTitle: document.getElementById("demography-title"),
    demoSummary: document.getElementById("demo-summary"),
    demoPopulation: document.getElementById("demo-population"),
    demoEducation: document.getElementById("demo-education"),
    summaryCard: document.getElementById("summary-card"),
    sourceCard: document.getElementById("source-card"),
  };

  const SECTION_OPTIONS = [
    { id: "map", key: "map" },
    { id: "history", key: "history" },
    { id: "demography", key: "demography" },
  ];
  const ROUND_OPTIONS = [
    { id: "round1", key: "firstRound" },
    { id: "round2", key: "secondRound" },
  ];
  const METRIC_OPTIONS = [
    { id: "leader", key: "leader" },
    { id: "turnout", key: "turnout" },
    { id: "share", key: "voteShare" },
  ];
  const GRANULARITY_OPTIONS = [
    { id: "bureau", key: "bureau" },
    { id: "arrondissement", key: "arrondissement" },
  ];
  const LANGUAGE_OPTIONS = [
    { id: "fr", label: "FR" },
    { id: "en", label: "EN" },
  ];

  function t(key) {
    return I18N[state.language][key];
  }

  function cleanText(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function ordinal(n) {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
  }

  function districtLabel(arr) {
    return state.language === "fr"
      ? `${arr}${t("arrondissementSuffix")}`
      : `${ordinal(Number(arr))} ${t("arrondissementSuffix")}`;
  }

  function arrondissementGroupKey(arr) {
    return String(arr);
  }

  const PARTY_PROFILES = [
    {
      matches: ["grégoire", "gregoire", "paris est à vous"],
      familyId: "left",
      color: POLITICAL_COLORS.left,
      label: { fr: "Centre gauche social-démocrate", en: "Social-democratic centre-left" },
      shortLabel: { fr: "Centre gauche", en: "Centre-left" },
    },
    {
      matches: ["dati", "changer paris"],
      familyId: "right",
      color: POLITICAL_COLORS.right,
      label: { fr: "Droite républicaine", en: "Republican right" },
      shortLabel: { fr: "Droite", en: "Right" },
    },
    {
      matches: ["nouveau paris populaire", "simonnet", "décidons paris", "decidons paris"],
      familyId: "lfiLike",
      color: POLITICAL_COLORS.lfiLike,
      label: { fr: "Gauche radicale / LFI", en: "Radical left / LFI" },
      shortLabel: { fr: "LFI / gauche radicale", en: "LFI / radical left" },
    },
    {
      matches: ["belliard", "écologie", "ecologie pour paris", "eelv", "les verts"],
      familyId: "greens",
      color: POLITICAL_COLORS.greens,
      label: { fr: "Écologistes", en: "Greens" },
      shortLabel: { fr: "Écologistes", en: "Greens" },
    },
    {
      matches: ["bournazel", "apaisé", "apaise"],
      familyId: "center",
      color: POLITICAL_COLORS.center,
      label: { fr: "Centre libéral", en: "Liberal centre" },
      shortLabel: { fr: "Centre", en: "Centre" },
    },
    {
      matches: ["villani", "buzyn", "lrem", "ensemble pour paris", "nouveau paris"],
      familyId: "center",
      color: POLITICAL_COLORS.center,
      label: { fr: "Centre macroniste", en: "Macronist centre" },
      shortLabel: { fr: "Centre", en: "Centre" },
    },
    {
      matches: ["knafo", "rn", "federbusch"],
      familyId: "farRight",
      color: POLITICAL_COLORS.farRight,
      label: { fr: "Extrême droite", en: "Far right" },
      shortLabel: { fr: "Extrême droite", en: "Far right" },
    },
    {
      matches: ["retrouvons paris"],
      familyId: "centerRight",
      color: POLITICAL_COLORS.centerRight,
      label: { fr: "Divers centre-droit", en: "Independent centre-right" },
      shortLabel: { fr: "Centre-droit", en: "Centre-right" },
    },
    {
      matches: ["npa", "lutte ouvrière", "lutte ouvriere", "lo"],
      familyId: "farLeft",
      color: POLITICAL_COLORS.farLeft,
      label: { fr: "Extrême gauche", en: "Far left" },
      shortLabel: { fr: "Extrême gauche", en: "Far left" },
    },
  ];

  function getPartyProfile(name) {
    const lower = cleanText(name).toLowerCase();
    return (
      PARTY_PROFILES.find((profile) => profile.matches.some((match) => lower.includes(match))) || {
        familyId: "other",
        color: POLITICAL_COLORS.other,
        label: { fr: "Divers", en: "Other" },
        shortLabel: { fr: "Divers", en: "Other" },
      }
    );
  }

  const FAMILY_META = {
    left: { label: { fr: "Gauche sociale", en: "Social left" }, color: POLITICAL_COLORS.left },
    right: { label: { fr: "Droite républicaine", en: "Republican right" }, color: POLITICAL_COLORS.right },
    greens: { label: { fr: "Écologistes", en: "Greens" }, color: POLITICAL_COLORS.greens },
    lfiLike: { label: { fr: "LFI / gauche radicale", en: "LFI / radical left" }, color: POLITICAL_COLORS.lfiLike },
    center: { label: { fr: "Centre", en: "Centre" }, color: POLITICAL_COLORS.center },
    centerRight: { label: { fr: "Centre-droit", en: "Centre-right" }, color: POLITICAL_COLORS.centerRight },
    farRight: { label: { fr: "Extrême droite", en: "Far right" }, color: POLITICAL_COLORS.farRight },
    farLeft: { label: { fr: "Extrême gauche", en: "Far left" }, color: POLITICAL_COLORS.farLeft },
    other: { label: { fr: "Divers", en: "Other" }, color: POLITICAL_COLORS.other },
  };

  const PORTRAIT_BY_NAME = {
    "Emmanuel Grégoire":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Emmanuel_Gr%C3%A9goire_%2846632368425%29.jpg/250px-Emmanuel_Gr%C3%A9goire_%2846632368425%29.jpg",
    "Bertrand Delanoë":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bertrand_Delano%C3%AB%2C_Cohen-Solal_Mutualite_2008_03_03_n9.jpg/250px-Bertrand_Delano%C3%AB%2C_Cohen-Solal_Mutualite_2008_03_03_n9.jpg",
    "Anne Hidalgo":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Anne_Hidalgo%2C_f%C3%A9vrier_2014_%283x4_cropped%29.jpg/250px-Anne_Hidalgo%2C_f%C3%A9vrier_2014_%283x4_cropped%29.jpg",
    "Jean Tiberi":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Jean_Tiberi_2007_06_06.jpg/250px-Jean_Tiberi_2007_06_06.jpg",
  };

  function normalizeHistoryFamilyId(id) {
    if (id === "dissRight") return "right";
    if (id === "ecology") return "greens";
    return id;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(state.language === "fr" ? "fr-FR" : "en-GB").format(value);
  }

  function formatPct(value) {
    return `${Number(value).toFixed(1)}%`;
  }

  function partySymbol() {
    return "●";
  }

  function initialsFor(name) {
    const parts = cleanText(name).split(" ");
    return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function shortName(name) {
    const firstChunk = cleanText(name).split(" - ")[0];
    const marker = " avec ";
    return firstChunk.toLowerCase().includes(marker)
      ? cleanText(firstChunk.split(marker)[1] || firstChunk)
      : firstChunk;
  }

  function getPortraitUrl(name) {
    return PORTRAIT_BY_NAME[name] || null;
  }

  function isCompactViewport() {
    return window.innerWidth < 760;
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const normalized = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
    const parsed = Number.parseInt(normalized, 16);
    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255,
    };
  }

  function rgbToHex(color) {
    const toHex = (value) => value.toString(16).padStart(2, "0");
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }

  function mixColors(start, end, ratio) {
    const a = hexToRgb(start);
    const b = hexToRgb(end);
    return rgbToHex({
      r: Math.round(a.r + (b.r - a.r) * ratio),
      g: Math.round(a.g + (b.g - a.g) * ratio),
      b: Math.round(a.b + (b.b - a.b) * ratio),
    });
  }

  function getSharePalette(color) {
    return ["#f8f3ec", mixColors("#ffffff", color, 0.55), color];
  }

  function renderLoading() {
    dom.heroMeta.innerHTML = `<span class="meta-pill">${t("loading")}</span>`;
    dom.summaryCard.innerHTML = `<div class="detail-title">${t("loading")}</div><p class="empty-copy">${t("loadingCopy")}</p>`;
    dom.sourceCard.innerHTML = `<div class="detail-title">${t("sources")}</div><p class="source-copy">${t("sourceFootnote")}</p>`;
    dom.historySummary.innerHTML = `<div class="detail-title">${t("loading")}</div>`;
    dom.demoSummary.innerHTML = `<div class="detail-title">${t("loading")}</div>`;
  }

  function renderError(message) {
    dom.summaryCard.innerHTML = `<div class="detail-title">${t("loadError")}</div><p class="empty-copy">${message}</p>`;
    dom.detailCard.innerHTML = `<div class="detail-title">${t("loadError")}</div><p class="empty-copy">${message}</p>`;
  }

  renderLoading();

  function buildRoundPayload(raw, lastUpdated) {
    const lists = raw.cy.lists
      .map((item) => {
        const name = cleanText(raw._ln[item.ln]);
        const party = getPartyProfile(name);
        return {
          id: item.id,
          name,
          shortName: shortName(name),
          party,
          color: party.color,
          cityShare: item.votes.poc,
          cityVotes: item.votes.count,
        };
      })
      .sort((a, b) => b.cityShare - a.cityShare);

    return {
      countingComplete: Boolean(raw.cc),
      lastUpdated,
      city: {
        turnoutPct: raw.cy.p.p.pr,
        registeredVoters: raw.cy.rv,
        castVotes: raw.cy.cv,
        lists: raw.cy.lists
          .map((entry) => ({
            id: entry.id,
            shareCast: entry.votes.poc,
            votes: entry.votes.count,
          }))
          .sort((a, b) => b.shareCast - a.shareCast),
      },
      lists,
    };
  }

  function buildFeaturePayload(geojson, round1, round2) {
    const round1Stations = Object.values(round1.cy.ps).reduce((acc, station) => {
      acc[station.number] = station;
      return acc;
    }, {});
    const round2Stations = Object.values(round2.cy.ps).reduce((acc, station) => {
      acc[station.number] = station;
      return acc;
    }, {});

    return geojson.features.map((feature) => {
      const props = feature.properties;
      const arr = Number(props.arrondissement);
      const bureau = Number(props.num_bv);
      const stationNumber = `${String(arr).padStart(2, "0")}${String(bureau).padStart(2, "0")}`;

      function mapRound(station) {
        const lists = station.lists
          .map((item) => ({
            id: item.id,
            votes: item.votes.count,
            shareCast: item.votes.poc,
            shareRegistered: item.votes.por,
          }))
          .sort((a, b) => b.shareCast - a.shareCast);
        const lookup = lists.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        return {
          registeredVoters: station.rv,
          castVotes: lists.reduce((sum, item) => sum + item.votes, 0),
          turnoutPct: station.pp,
          countingComplete: Boolean(station.cc),
          leaderId: lists[0]?.id || null,
          leaderShare: lists[0]?.shareCast || 0,
          lists,
          listLookup: lookup,
        };
      }

      return {
        ...feature,
        properties: {
          id_bv: props.id_bv,
          arrondissement: arr,
          bureau,
          stationNumber,
          label: `Bureau ${stationNumber}`,
          rounds: {
            round1: mapRound(round1Stations[stationNumber]),
            round2: mapRound(round2Stations[stationNumber]),
          },
        },
      };
    });
  }

  let fetched;
  try {
    const [geojson, round1, round2] = LOCAL_2026
      ? [LOCAL_2026.geojson, LOCAL_2026.round1, LOCAL_2026.round2]
      : await Promise.all([
          fetch(SOURCE_URLS.geometry).then((response) => {
            if (!response.ok) throw new Error("2026 bureau geometry request failed.");
            return response.json();
          }),
          fetch(SOURCE_URLS.round1Json).then((response) => {
            if (!response.ok) throw new Error("First round request failed.");
            return response.json();
          }),
          fetch(SOURCE_URLS.round2Json).then((response) => {
            if (!response.ok) throw new Error("Second round request failed.");
            return response.json();
          }),
        ]);

    fetched = {
      rounds: {
        round1: buildRoundPayload(round1, "2026-03-16"),
        round2: buildRoundPayload(round2, "2026-03-23"),
      },
      features: buildFeaturePayload(geojson, round1, round2),
    };
  } catch (error) {
    renderError(error.message);
    return;
  }

  const liveData = fetched;
  const featureIndex = new Map(liveData.features.map((feature) => [feature.properties.id_bv, feature]));
  const bureauLayerIndex = new Map();
  const arrondissementLayerIndex = new Map();

  function getRoundMeta(roundId) {
    return liveData.rounds[roundId];
  }

  function getCandidateMeta(roundId, candidateId) {
    return getRoundMeta(roundId).lists.find((item) => item.id === candidateId);
  }

  function getFeatureRound(feature, roundId) {
    return feature.properties.rounds[roundId];
  }

  function buildArrondissementAggregates(roundId) {
    const groups = new Map();
    liveData.features.forEach((feature) => {
      const arrKey = arrondissementGroupKey(feature.properties.arrondissement);
      const round = getFeatureRound(feature, roundId);
      if (!groups.has(arrKey)) {
        groups.set(arrKey, {
          key: `arr-${arrKey}`,
          arrondissement: arrKey,
          label: districtLabel(arrKey),
          registeredVoters: 0,
          castVotes: 0,
          bureauCount: 0,
          countedCount: 0,
          listVotes: new Map(),
        });
      }
      const current = groups.get(arrKey);
      current.registeredVoters += round.registeredVoters;
      current.castVotes += round.castVotes;
      current.bureauCount += 1;
      if (round.countingComplete) current.countedCount += 1;
      round.lists.forEach((entry) => {
        current.listVotes.set(entry.id, (current.listVotes.get(entry.id) || 0) + entry.votes);
      });
    });

    return new Map(
      [...groups.entries()].map(([key, item]) => {
        const lists = [...item.listVotes.entries()]
          .map(([id, votes]) => ({
            id,
            votes,
            shareCast: item.castVotes ? (votes / item.castVotes) * 100 : 0,
          }))
          .sort((a, b) => b.shareCast - a.shareCast);
        const lookup = lists.reduce((acc, entry) => {
          acc[entry.id] = entry;
          return acc;
        }, {});
        return [
          key,
          {
            key: item.key,
            label: item.label,
            arrondissement: item.arrondissement,
            registeredVoters: item.registeredVoters,
            castVotes: item.castVotes,
            turnoutPct: item.registeredVoters ? (item.castVotes / item.registeredVoters) * 100 : 0,
            countingComplete: item.countedCount === item.bureauCount,
            leaderId: lists[0]?.id || null,
            leaderShare: lists[0]?.shareCast || 0,
            lists,
            listLookup: lookup,
            bureauCount: item.bureauCount,
            countedCount: item.countedCount,
          },
        ];
      }),
    );
  }

  const arrondissementData = {
    round1: buildArrondissementAggregates("round1"),
    round2: buildArrondissementAggregates("round2"),
  };

  function buildLiveHistoryEntry() {
    function normalize(roundId) {
      const round = getRoundMeta(roundId);
      const grouped = new Map();
      round.lists.forEach((list) => {
        const familyId = list.party.familyId || "other";
        const family = FAMILY_META[familyId] || FAMILY_META.other;
        const current = grouped.get(familyId) || {
          id: familyId,
          label: family.label,
          color: family.color,
          first: 0,
          second: 0,
        };
        if (roundId === "round1") current.first += list.cityShare;
        if (roundId === "round2") current.second += list.cityShare;
        grouped.set(familyId, current);
      });
      return [...grouped.values()];
    }

    const combined = new Map();
    normalize("round1").forEach((item) => {
      combined.set(item.id, { ...item });
    });
    normalize("round2").forEach((item) => {
      const existing = combined.get(item.id) || { id: item.id, label: item.label, color: item.color, first: 0, second: 0 };
      existing.second = item.second;
      existing.label = item.label;
      existing.color = item.color;
      combined.set(item.id, existing);
    });

    const cityLeader = getRoundMeta("round2").lists[0];
    return {
      year: "2026",
      label: "2026",
      firstDate: "15 mars 2026",
      secondDate: "22 mars 2026",
      turnout: {
        first: getRoundMeta("round1").city.turnoutPct,
        second: getRoundMeta("round2").city.turnoutPct,
      },
      winner: {
        name: cityLeader.shortName,
        partyLabel: cityLeader.party.label,
        shortLabel: cityLeader.party.shortLabel,
        color: cityLeader.color,
      },
      shares: [...combined.values()]
        .sort((a, b) => (b.second || b.first) - (a.second || a.first))
        .slice(0, 6)
        .map((item) => ({
          id: item.id,
          label: item.label,
          color: item.color,
          first: item.first,
          second: item.second,
        })),
      notes: {
        fr: "2026 garde la vue la plus fine au niveau bureau. La vue arrondissement sert ici de mode simplifié, mobile et comparatif.",
        en: "2026 keeps the finest polling-station detail. District mode acts as the simplified, mobile-friendly comparison layer.",
      },
      source: SOURCE_URLS.round2Page,
    };
  }

  const HISTORY = [...STATIC_HISTORY, buildLiveHistoryEntry()];
  const YEAR_OPTIONS = HISTORY.map((entry) => ({ id: entry.year, label: entry.label }));
  const MAP_YEAR_OPTIONS = [...(OFFICIAL_HISTORY.years || []).map((year) => ({ id: year, label: year })), { id: "2026", label: "2026" }];

  function getElection(year = state.year) {
    return HISTORY.find((entry) => entry.year === year);
  }

  function hasOfficialMapYear(year = state.year) {
    return year === "2026" || Boolean(OFFICIAL_HISTORY.history?.[year]);
  }

  function currentGeometryMode() {
    return state.year === "2026" && state.granularity === "bureau" ? "bureau" : "arrondissement";
  }

  function getHistoricalRoundData(year = state.year, roundId = state.round) {
    return OFFICIAL_HISTORY.history?.[year]?.rounds?.[roundId] || null;
  }

  function normalizeHistoricalList(list) {
    const historyMeta = OFFICIAL_HISTORY.familyMeta?.[list.id] || {};
    const family = FAMILY_META[list.id] || FAMILY_META.other;
    return {
      id: list.id,
      name: (historyMeta.label || family.label)[state.language],
      shortName: (historyMeta.label || family.label)[state.language],
      party: {
        familyId: list.id,
        label: historyMeta.label || family.label,
        shortLabel: historyMeta.label || family.label,
      },
      color: family.color,
      cityShare: list.shareCast,
      cityVotes: list.votes,
    };
  }

  function getDisplayedRoundMeta(roundId = state.round) {
    if (state.year === "2026") return getRoundMeta(roundId);
    const round = getHistoricalRoundData(state.year, roundId);
    if (!round) return { city: { turnoutPct: 0, registeredVoters: 0, castVotes: 0, ballotsCast: 0 }, lists: [] };
    return {
      city: round.city,
      lists: round.city.lists.map(normalizeHistoricalList),
    };
  }

  function getDisplayedCandidateMeta(roundId = state.round, candidateId = state.candidate) {
    return getDisplayedRoundMeta(roundId).lists.find((item) => item.id === candidateId) || null;
  }

  function candidateDisplay(candidate) {
    if (!candidate) return "";
    return state.year === "2026"
      ? `${candidate.party.shortLabel[state.language]} · ${candidate.shortName}`
      : candidate.party.shortLabel[state.language];
  }

  function getArrondissementRow(arrondissement, roundId = state.round, year = state.year) {
    if (year === "2026") {
      return arrondissementData[roundId].get(String(arrondissement)) || null;
    }
    return getHistoricalRoundData(year, roundId)?.arrondissements?.[String(arrondissement)] || null;
  }

  function winnerForElection(entry) {
    if (state.round === "round1" && entry.shares.some((item) => item.first)) {
      return [...entry.shares].sort((a, b) => (b.first || 0) - (a.first || 0))[0];
    }
    if (entry.shares.some((item) => item.second)) {
      return [...entry.shares].sort((a, b) => (b.second || 0) - (a.second || 0))[0];
    }
    return [...entry.shares].sort((a, b) => (b.first || 0) - (a.first || 0))[0];
  }

  function getCurrentMapRange() {
    const values = currentMapRows()
      .filter((row) => row.castVotes > 0)
      .map((row) => {
        if (state.metric === "turnout") return row.turnoutPct;
        if (state.metric === "share") return getListLookup(row)[state.candidate]?.shareCast ?? 0;
        return row.leaderShare;
      })
      .sort((a, b) => a - b);
    if (!values.length) {
      return { min: 0, mid: 0, max: 0 };
    }
    return { min: values[0], mid: values[Math.floor(values.length / 2)], max: values[values.length - 1] };
  }

  function ensureCandidate() {
    const round = getDisplayedRoundMeta(state.round);
    if (!round.lists.some((list) => list.id === state.candidate)) {
      state.candidate = round.lists[0]?.id || null;
    }
  }

  function currentMapSelection() {
    if (currentGeometryMode() === "arrondissement") {
      const key = state.selectedKey || state.hoveredKey;
      if (!key) return null;
      const arrondissement = Number(String(key).replace("arr-", ""));
      const row = getArrondissementRow(arrondissement);
      return row
        ? {
            key,
            label: districtLabel(arrondissement),
            arrondissement,
            ...row,
          }
        : null;
    }
    const feature = featureIndex.get(state.selectedKey) || featureIndex.get(state.hoveredKey);
    if (!feature) return null;
    return {
      key: feature.properties.id_bv,
      label: feature.properties.label,
      arrondissement: feature.properties.arrondissement,
      ...getFeatureRound(feature, state.round),
      isBureau: true,
    };
  }

  function currentMapRows() {
    return currentGeometryMode() === "bureau"
      ? liveData.features.map((feature) => getFeatureRound(feature, state.round))
      : OFFICIAL_HISTORY.history?.[state.year]
        ? Object.values(getHistoricalRoundData(state.year, state.round)?.arrondissements || {})
        : [...arrondissementData[state.round].values()];
  }

  function getListLookup(row) {
    if (row.listLookup) return row.listLookup;
    return (row.lists || []).reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }

  function countAvailableRows() {
    return currentMapRows().filter((row) => row.castVotes > 0).length;
  }

  function renderToggle(container, options, activeValue, onChange) {
    container.innerHTML = "";
    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = option.id === activeValue ? "active" : "";
      button.setAttribute("aria-pressed", option.id === activeValue ? "true" : "false");
      button.textContent = option.label || t(option.key);
      button.addEventListener("click", () => onChange(option.id));
      container.appendChild(button);
    });
  }

  function renderStaticChrome() {
    document.documentElement.lang = state.language;
    dom.eyebrow.textContent = t("eyebrow");
    dom.heroTitle.textContent = t("heroTitle");
    dom.heroText.textContent = t("heroText");
    dom.languageLabel.textContent = t("language");
    dom.sectionLabel.textContent = t("section");
    dom.yearLabel.textContent = t("election");
    dom.roundLabel.textContent = t("round");
    dom.granularityLabel.textContent = t("granularity");
    dom.metricLabel.textContent = t("observe");
    dom.candidateLabel.textContent = t("partyOrList");
    dom.candidateHint.textContent = t("candidateHint");
    dom.mapKicker.textContent = t("mapKicker");
    dom.historyKicker.textContent = t("historyKicker");
    dom.demographyKicker.textContent = t("demographyKicker");
    dom.historyTitle.textContent = t("historyTitle");
    dom.demographyTitle.textContent = t("demographyTitle");
    dom.resetView.textContent = t("reset");
  }

  function renderWinnerBanner() {
    const election = getElection();
    const winner = winnerForElection(election);
    const displayedLeader = getDisplayedRoundMeta(state.round).lists[0] || null;
    const bannerColor = displayedLeader?.color || winner.color || election.winner.color;
    const winnerName = state.year === "2026" ? displayedLeader?.shortName || election.winner.name : election.winner.name;
    const partyLabel = displayedLeader?.party?.label?.[state.language] || election.winner.partyLabel[state.language];
    const share = displayedLeader?.cityShare || (state.round === "round1" ? winner.first || 0 : winner.second || winner.first || 0);
    const portraitUrl = getPortraitUrl(winnerName);

    dom.winnerBanner.innerHTML = `
      <div class="portrait-frame">
        ${
          portraitUrl
            ? `<img class="portrait-image" src="${portraitUrl}" alt="${winnerName}" loading="lazy" />`
            : `<div class="portrait-badge" style="background:${bannerColor}">${initialsFor(winnerName)}</div>`
        }
      </div>
      <div class="winner-meta">
        <div class="winner-overline">${t("currentWinner")} · ${election.label} · ${t(state.round === "round1" ? "firstRound" : "secondRound")}</div>
        <div class="winner-name">${winnerName}</div>
        <div class="winner-subline"><span class="inline-party-dot" style="background:${bannerColor}"></span>${partyLabel} · ${formatPct(share)}</div>
        <div class="winner-footnote">${t("currentWinnerFootnote")}</div>
      </div>
    `;
    dom.heroMeta.innerHTML = `
      <span class="meta-pill">${state.year === "2026" ? t("turnoutAtBureau") : `${state.year} · ${t("arrondissement")}`}</span>
      <span class="meta-pill">${t("historicalWindow")}</span>
      <span class="meta-pill">${t("liveFeed")}</span>
    `;
  }

  function renderCandidateSelect() {
    ensureCandidate();
    dom.candidateGroup.style.display = state.section === "map" && state.metric === "share" ? "grid" : "none";
    dom.candidateSelect.innerHTML = "";
    dom.candidateMenu.innerHTML = "";
    const grouped = new Map();
    getDisplayedRoundMeta(state.round).lists.forEach((candidate) => {
      const key = candidate.party.shortLabel[state.language];
      const bucket = grouped.get(key) || [];
      bucket.push(candidate);
      grouped.set(key, bucket);
    });

    grouped.forEach((candidates, groupLabel) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = groupLabel;
      const groupTitle = document.createElement("div");
      groupTitle.className = "select-group-label";
      groupTitle.textContent = groupLabel;
      dom.candidateMenu.appendChild(groupTitle);
      candidates.forEach((candidate) => {
        const option = document.createElement("option");
        option.value = candidate.id;
        option.selected = candidate.id === state.candidate;
        option.textContent = `${partySymbol()} ${candidateDisplay(candidate)}`;
        optgroup.appendChild(option);

        const button = document.createElement("button");
        button.type = "button";
        button.className = `select-option${candidate.id === state.candidate ? " is-active" : ""}`;
        button.innerHTML = `
          <span class="select-color-dot" style="background:${candidate.color}"></span>
          <span class="select-option-copy">
            <span class="select-option-title">${candidate.party.shortLabel[state.language]}</span>
            <span class="select-option-subtitle">${candidate.shortName}</span>
          </span>
          <span class="select-check">${candidate.id === state.candidate ? "✓" : ""}</span>
        `;
        button.addEventListener("click", () => {
          state.candidate = candidate.id;
          state.dropdownOpen = false;
          renderAll();
        });
        dom.candidateMenu.appendChild(button);
      });
      dom.candidateSelect.appendChild(optgroup);
    });
    const selected = getDisplayedCandidateMeta(state.round, state.candidate);
    dom.candidateTriggerLabel.textContent = selected
      ? candidateDisplay(selected)
      : "";
    dom.candidateDot.style.background = selected?.color || "#7d776f";
    dom.candidateShell.style.setProperty("--candidate-accent", selected?.color || "#7d776f");
    dom.candidateMenu.hidden = !state.dropdownOpen;
    dom.candidateTrigger.setAttribute("aria-expanded", state.dropdownOpen ? "true" : "false");
  }

  function renderControlVisibility() {
    const showMap = state.section === "map";
    const showHistory = state.section === "history";
    dom.yearGroup.style.display = showMap || showHistory ? "grid" : "none";
    dom.roundGroup.style.display = showMap || showHistory ? "grid" : "none";
    dom.granularityGroup.style.display = showMap ? "grid" : "none";
    dom.metricGroup.style.display = showMap ? "grid" : "none";
  }

  function getMapStyle(feature) {
    const isBureauMode = currentGeometryMode() === "bureau";
    const dataRow = isBureauMode ? getFeatureRound(feature, state.round) : getArrondissementRow(feature.properties.arrondissement);
    const activeKey = isBureauMode
      ? feature.properties.id_bv
      : `arr-${arrondissementGroupKey(feature.properties.arrondissement)}`;
    const isActive = activeKey === state.selectedKey || activeKey === state.hoveredKey;

    if (!dataRow.castVotes || !dataRow.lists.length) {
      return {
        fillColor: "#d9d2c8",
        fillOpacity: 0.42,
        color: isActive ? "#1f1a17" : "rgba(35, 25, 18, 0.14)",
        weight: isActive ? 2 : isBureauMode ? 0.45 : 0.18,
        opacity: 1,
      };
    }

    if (state.metric === "leader") {
      const leader = getDisplayedCandidateMeta(state.round, dataRow.leaderId);
      return {
        fillColor: leader?.color || "#999999",
        fillOpacity: Math.max(0.48, Math.min(0.92, dataRow.leaderShare / 100)),
        color: isActive ? "#1f1a17" : "rgba(35, 25, 18, 0.22)",
        weight: isActive ? 2 : isBureauMode ? 0.5 : 0.25,
        opacity: 1,
      };
    }

    const range = getMapStyle.rangeCache || getCurrentMapRange();
    getMapStyle.rangeCache = range;
    const candidate = getDisplayedCandidateMeta(state.round, state.candidate);
    const palette =
      state.metric === "turnout"
        ? ["#fff4d6", "#f29c52", "#ae2f23"]
        : getSharePalette(candidate?.color || "#0f4a5c");
    const value =
      state.metric === "turnout"
        ? dataRow.turnoutPct
        : getListLookup(dataRow)[state.candidate]?.shareCast ?? 0;
    const span = Math.max(range.max - range.min, 0.0001);
    const progress = Math.min(1, Math.max(0, (value - range.min) / span));
    const fillColor =
      progress < 0.5
        ? mixColors(palette[0], palette[1], progress * 2)
        : mixColors(palette[1], palette[2], (progress - 0.5) * 2);

    return {
      fillColor,
      fillOpacity: 0.92,
      color: isActive ? "#1f1a17" : "rgba(35, 25, 18, 0.18)",
      weight: isActive ? 2 : isBureauMode ? 0.45 : 0.18,
      opacity: 1,
    };
  }

  function renderLegend() {
    if (state.section !== "map") {
      dom.legend.innerHTML = "";
      return;
    }

    const round = getDisplayedRoundMeta(state.round);
    if (state.metric === "leader") {
      dom.legend.innerHTML = `
        <div class="legend-title">${t("leader")}</div>
        ${round.lists
          .slice(0, 7)
          .map(
            (candidate) => `
              <div class="legend-item">
                <span class="legend-swatch" style="background:${candidate.color}"></span>
                <span>${candidateDisplay(candidate)}</span>
                <span>${formatPct(candidate.cityShare)}</span>
              </div>
            `,
          )
          .join("")}
        <p class="legend-note">${t("mapNoDataLegend")}</p>
      `;
      return;
    }

    const range = getCurrentMapRange();
    const candidate = getDisplayedCandidateMeta(state.round, state.candidate);
    const palette =
      state.metric === "turnout"
        ? ["#fff4d6", "#f29c52", "#ae2f23"]
        : getSharePalette(candidate?.color || "#0f4a5c");
    dom.legend.innerHTML = `
      <div class="legend-title">${
        state.metric === "turnout"
          ? t("turnout")
          : `${t("voteShare")} · ${candidate?.party.shortLabel[state.language] || ""}`
      }</div>
      <div class="gradient-scale" style="background: linear-gradient(90deg, ${palette.join(", ")});"></div>
      <div class="scale-labels">
        <span>${formatPct(range.min)}</span>
        <span>${formatPct(range.mid)}</span>
        <span>${formatPct(range.max)}</span>
      </div>
      <p class="legend-note">${t("mapNoDataLegend")}</p>
    `;
  }

  function currentCityLeader() {
    return getDisplayedRoundMeta(state.round).lists[0];
  }

  function renderMapSummaryCards() {
    if (state.section !== "map") {
      dom.mapSummary.innerHTML = "";
      return;
    }
    const round = getDisplayedRoundMeta(state.round);
    const leader = currentCityLeader();
    const arrondissementRows = currentGeometryMode() === "bureau" ? [...arrondissementData[state.round].values()] : currentMapRows();
    const arrWins = new Set(arrondissementRows.filter((item) => item.leaderId === leader?.id).map((item) => item.arrondissement || item.key)).size;
    const strongest = [...arrondissementRows].sort((a, b) => b.turnoutPct - a.turnoutPct)[0];
    const target = state.metric === "share"
      ? [...arrondissementRows].sort(
          (a, b) => (getListLookup(b)[state.candidate]?.shareCast || 0) - (getListLookup(a)[state.candidate]?.shareCast || 0),
        )[0]
      : [...arrondissementRows].sort((a, b) => b.leaderShare - a.leaderShare)[0];

    const cards = [
      {
        title: t("winnerCard"),
        value: leader ? candidateDisplay(leader) : "N/A",
        sub: leader ? `${formatPct(leader.cityShare)} · ${leader.party.label[state.language]}` : "N/A",
      },
      {
        title: t("turnout"),
        value: formatPct(round.city.turnoutPct),
        sub: `${formatNumber(round.city.registeredVoters)} ${t("registered")}`,
      },
      {
        title: t("districtsLed"),
        value: `${arrWins} / ${arrondissementRows.length}`,
        sub: currentGeometryMode() === "bureau" ? t("bureau") : t("arrondissement"),
      },
      {
        title: t("topTurnout"),
        value: strongest?.label || districtLabel(strongest?.arrondissement || ""),
        sub: strongest ? formatPct(strongest.turnoutPct) : "N/A",
      },
      {
        title: t("strongestArea"),
        value: target?.label || districtLabel(target?.arrondissement || ""),
        sub:
          state.metric === "share"
            ? formatPct(getListLookup(target || {})[state.candidate]?.shareCast || 0)
            : formatPct(target?.leaderShare || 0),
      },
      {
        title: t("countingProgress"),
        value: `${countAvailableRows()} / ${currentMapRows().length}`,
        sub: currentGeometryMode() === "bureau" ? t("bureau") : t("arrondissement"),
      },
    ];

    const markup = cards
      .map(
        (card) => `
          <div class="summary-stat">
            <strong>${card.title}</strong>
            <span>${card.value}</span>
            <div class="footnote">${card.sub}</div>
          </div>
        `,
      )
      .join("");
    dom.mapSummary.innerHTML = markup;
    dom.summaryCard.innerHTML = `
      <div class="detail-title">${t("mapSummary")}</div>
      <div class="summary-grid">${markup}</div>
      <p class="footnote">${
        state.year === "2026"
          ? t("liveOnly")
          : state.language === "fr"
            ? "2014 et 2020 utilisent des classeurs officiels Paris Open Data agrégés à l’arrondissement."
            : "2014 and 2020 use official Paris Open Data arrondissement workbooks aggregated locally."
      }</p>
    `;
  }

  function buildResultBars(record) {
    if (!record.lists.length) {
      return `<p class="empty-copy">${t("noResultsInSelection")}</p>`;
    }
    return record.lists
      .slice(0, 6)
      .map((entry) => {
        const meta = getDisplayedCandidateMeta(state.round, entry.id);
        return `
          <div class="result-row">
            <div class="result-line">
              <span>${meta ? candidateDisplay(meta) : entry.id}</span>
              <strong>${formatPct(entry.shareCast)}</strong>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${entry.shareCast}%;background:${meta?.color || "#999"}"></div></div>
          </div>
        `;
      })
      .join("");
  }

  function renderDetail() {
    if (state.section !== "map") {
      dom.detailCard.innerHTML = "";
      return;
    }

    const selection = currentMapSelection();
    if (!selection) {
      dom.detailCard.innerHTML = `
        <div class="detail-title">${t("howToRead")}</div>
        <div class="detail-headline">${t("hoverOrTap")}</div>
        <p class="empty-copy">${t("hoverText")}</p>
      `;
      return;
    }

    const leader = getDisplayedCandidateMeta(state.round, selection.leaderId);
    const isArr = !selection.isBureau;
    const countingSubline = isArr
      ? selection.bureauCount
        ? `${selection.countedCount} / ${selection.bureauCount} ${t("countingProgress").toLowerCase()}`
        : selection.wonInRound1
          ? state.language === "fr"
            ? "Élu dès le premier tour"
            : "Won in the first round"
          : t("counted")
      : selection.countingComplete
        ? t("counted")
        : t("partialResults");

    if (!selection.castVotes || !selection.lists.length) {
      dom.detailCard.innerHTML = `
        <div class="detail-title">${isArr ? t("selectedArr") : t("selectedBureau")}</div>
        <div class="detail-headline">${selection.label}</div>
        <p class="detail-meta">
          ${isArr && selection.bureauCount ? `${selection.bureauCount} ${t("bureau")}` : districtLabel(selection.arrondissement)} ·
          ${formatNumber(selection.registeredVoters)} ${t("registered")}
        </p>
        <div class="status-pill">${t("noDataYet")}</div>
        <p class="empty-copy">${t("noDataYetCopy")}</p>
      `;
      return;
    }

    dom.detailCard.innerHTML = `
      <div class="detail-title">${isArr ? t("selectedArr") : t("selectedBureau")}</div>
      <div class="detail-headline">${selection.label}</div>
      <p class="detail-meta">
        ${isArr && selection.bureauCount ? `${selection.bureauCount} ${t("bureau")}` : districtLabel(selection.arrondissement)} ·
        ${formatNumber(selection.registeredVoters)} ${t("registered")} ·
        ${t("turnoutLabel")} ${formatPct(selection.turnoutPct)}
      </p>
      <div class="summary-grid">
        <div class="summary-stat">
          <strong>${t("leaderLabel")}</strong>
          <span>${leader?.party.shortLabel[state.language] || "N/A"}</span>
          <div class="footnote">${leader?.shortName || "N/A"} · ${formatPct(selection.leaderShare)}</div>
        </div>
        <div class="summary-stat">
          <strong>${t("expressedVotes")}</strong>
          <span>${formatNumber(selection.castVotes)}</span>
          <div class="footnote">${countingSubline}</div>
        </div>
      </div>
      <div class="detail-bars">${buildResultBars(selection)}</div>
    `;
  }

  function focusDetailCard() {
    window.requestAnimationFrame(() => {
      dom.detailCard.scrollIntoView({ behavior: "smooth", block: isCompactViewport() ? "start" : "nearest" });
    });
  }

  function renderMapTitle() {
    const candidate = getDisplayedCandidateMeta(state.round, state.candidate);
    const geometryLabel = currentGeometryMode() === "bureau" ? t("bureau") : t("arrondissement");
    dom.mapTitle.textContent =
      state.metric === "leader"
        ? `${state.year === "2026" ? t("mapTitleLive") : state.year} · ${geometryLabel}`
        : state.metric === "turnout"
          ? `${state.year === "2026" ? t("mapTitleLive") : state.year} · ${t("turnout")}`
          : `${state.year === "2026" ? t("mapTitleLive") : state.year} · ${candidate?.party.shortLabel[state.language] || ""}`;
  }

  function tooltipHtml(feature) {
    const record =
      currentGeometryMode() === "bureau"
        ? { label: feature.properties.label, arrondissement: feature.properties.arrondissement, ...getFeatureRound(feature, state.round) }
        : {
            label: districtLabel(feature.properties.arrondissement),
            arrondissement: feature.properties.arrondissement,
            ...getArrondissementRow(feature.properties.arrondissement),
          };
    const leader = getDisplayedCandidateMeta(state.round, record.leaderId);
    const leaderLabel = record.castVotes ? leader?.party.shortLabel[state.language] || "N/A" : t("noDataYet");
    const leadShare = record.castVotes ? formatPct(record.leaderShare) : "…";
    return `
      <div class="tooltip-body">
        <div class="tooltip-title">${record.label}</div>
        <div class="tooltip-subtitle">${districtLabel(record.arrondissement || feature.properties.arrondissement)}</div>
        <div class="tooltip-grid">
          <div><strong>${t("tooltipTurnout")}</strong><span>${formatPct(record.turnoutPct)}</span></div>
          <div><strong>${t("tooltipLeader")}</strong><span>${leaderLabel}</span></div>
          <div><strong>${t("leadShare")}</strong><span>${leadShare}</span></div>
          <div><strong>${t("tooltipRegistered")}</strong><span>${formatNumber(record.registeredVoters)}</span></div>
        </div>
      </div>
    `;
  }

  function lineChart(points, formatter, colors) {
    const width = 680;
    const height = 260;
    const left = 48;
    const right = 18;
    const top = 18;
    const bottom = 34;
    const allValues = points.flatMap((series) => series.values.map((entry) => entry.value));
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const xCount = Math.max(1, points[0]?.values.length - 1);
    const xPos = (index) => left + ((width - left - right) / xCount) * index;
    const yPos = (value) =>
      top + (1 - (value - min) / Math.max(max - min, 0.0001)) * (height - top - bottom);

    const axes = points[0].values
      .map(
        (entry, index) =>
          `<text x="${xPos(index)}" y="${height - 8}" text-anchor="middle" fill="#6f655e" font-size="11">${entry.label}</text>`,
      )
      .join("");

    const seriesMarkup = points
      .map((series, seriesIndex) => {
        const color = colors[seriesIndex % colors.length];
        const path = series.values
          .map((entry, index) => `${index === 0 ? "M" : "L"} ${xPos(index)} ${yPos(entry.value)}`)
          .join(" ");
        const dots = series.values
          .map(
            (entry, index) =>
              `<circle cx="${xPos(index)}" cy="${yPos(entry.value)}" r="4" fill="${color}"><title>${series.label}: ${formatter(entry.value)}</title></circle>`,
          )
          .join("");
        return `<path d="${path}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>${dots}`;
      })
      .join("");

    const ticks = [0, 0.5, 1]
      .map((ratio) => {
        const value = min + (max - min) * (1 - ratio);
        const y = top + ratio * (height - top - bottom);
        return `
          <line x1="${left}" x2="${width - right}" y1="${y}" y2="${y}" stroke="rgba(31,26,23,0.09)" />
          <text x="0" y="${y + 4}" fill="#6f655e" font-size="11">${formatter(value)}</text>
        `;
      })
      .join("");

    return `
      <div class="chart-shell">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="chart">
          ${ticks}
          ${seriesMarkup}
          ${axes}
        </svg>
        <div class="chart-legend">
          ${points
            .map(
              (series, index) => `
                <div class="chart-legend-item"><span class="dot" style="background:${colors[index % colors.length]}"></span>${series.label}</div>
              `,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function barChart(entries, valueKey) {
    const width = 680;
    const rowHeight = 34;
    const height = 24 + entries.length * rowHeight;
    return `
      <div class="chart-shell">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="bar chart">
          ${entries
            .map((entry, index) => {
              const y = 18 + index * rowHeight;
              const value = entry[valueKey] || 0;
              return `
                <text x="0" y="${y + 11}" fill="#1f1a17" font-size="12">${entry.label[state.language] || entry.label}</text>
                <rect x="200" y="${y - 2}" width="${value * 4}" height="14" rx="7" fill="${entry.color}"></rect>
                <text x="${210 + value * 4}" y="${y + 10}" fill="#6f655e" font-size="12">${formatPct(value)}</text>
              `;
            })
            .join("")}
        </svg>
      </div>
    `;
  }

  function renderHistory() {
    const election = getElection();
    const winner = winnerForElection(election);
    const turnoutValue = state.round === "round1" ? election.turnout.first : election.turnout.second || election.turnout.first;
    const effectiveRound =
      state.round === "round2" && !election.shares.some((entry) => entry.second) ? "round1" : state.round;

    dom.historySummary.innerHTML = `
      <div class="detail-title">${t("historyTitle")}</div>
      <div class="detail-headline">${election.label}</div>
      <p class="empty-copy">${election.notes[state.language]}</p>
      <div class="summary-grid">
        <div class="summary-stat">
          <strong>${t("winnerByYear")}</strong>
          <span>${election.winner.name}</span>
          <div class="footnote">${election.winner.partyLabel[state.language]}</div>
        </div>
        <div class="summary-stat">
          <strong>${t("turnout")}</strong>
          <span>${formatPct(turnoutValue)}</span>
          <div class="footnote">${effectiveRound === "round1" ? election.firstDate : election.secondDate}</div>
        </div>
        <div class="summary-stat">
          <strong>${t("leader")}</strong>
          <span>${winner.label[state.language]}</span>
          <div class="footnote">${formatPct(effectiveRound === "round1" ? winner.first : winner.second || winner.first)}</div>
        </div>
      </div>
      <p class="footnote">${t("no1990")}</p>
    `;

    dom.historyChart.innerHTML = `
      <div class="chart-title">${t("historyChartTitle")}</div>
      <p class="chart-copy">${election.firstDate}${election.secondDate ? ` · ${election.secondDate}` : ""}</p>
      ${barChart(
        election.shares
          .filter((entry) => (effectiveRound === "round1" ? entry.first : entry.second || entry.first))
          .map((entry) => ({
            ...entry,
            round1: entry.first,
            round2: entry.second || entry.first,
          }))
          .sort((a, b) => (effectiveRound === "round1" ? b.first - a.first : (b.second || b.first) - (a.second || a.first)))
          .slice(0, 6),
        effectiveRound === "round1" ? "first" : "second",
      )}
    `;

    const evolutionSeries = ["left", "right", "greens", "lfiLike", "center", "farRight"].map((seriesId) => {
      const sample = HISTORY.map((entry) => {
        const total = entry.shares.reduce(
          (acc, share) => {
            if (normalizeHistoryFamilyId(share.id) !== seriesId) return acc;
            return acc + (share.second || share.first || 0);
          },
          0,
        );
        return { label: entry.label, value: total };
      });
      return { label: FAMILY_META[seriesId].label[state.language], values: sample };
    });

    dom.historyEvolution.innerHTML = `
      <div class="chart-title">${t("historyEvolutionTitle")}</div>
      <p class="chart-copy">${t("historyNotesLabel")}</p>
      ${lineChart(evolutionSeries, formatPct, ["#e14b5a", "#2f6fdf", "#2b9348", "#d9487a", "#f08c00", "#6a4c93"])}
      <p class="footnote"><a href="${election.source}" target="_blank" rel="noreferrer">${t("sources")}</a></p>
    `;
  }

  function renderDemography() {
    dom.demoSummary.innerHTML = `
      <div class="detail-title">${t("demoSummaryTitle")}</div>
      <div class="summary-grid">
        <div class="summary-stat">
          <strong>${t("population1990")}</strong>
          <span>${formatNumber(DEMOGRAPHY.population[0].value)}</span>
          <div class="footnote">1990</div>
        </div>
        <div class="summary-stat">
          <strong>${t("populationTitle")}</strong>
          <span>${formatNumber(DEMOGRAPHY.population[DEMOGRAPHY.population.length - 1].value)}</span>
          <div class="footnote">2020</div>
        </div>
        <div class="summary-stat">
          <strong>${t("tertiarySince2010")}</strong>
          <span>${formatPct(DEMOGRAPHY.tertiary[DEMOGRAPHY.tertiary.length - 1].value)}</span>
          <div class="footnote">2015</div>
        </div>
      </div>
      <p class="empty-copy">
        ${
          state.language === "fr"
            ? "La population parisienne remonte légèrement dans les années 2000 avant de repartir à la baisse. Dans le même temps, le poids des diplômés du supérieur progresse nettement."
            : "Paris’ population briefly rebounds in the 2000s before resuming its decline. At the same time, the share of residents with tertiary degrees rises sharply."
        }
      </p>
    `;

    dom.demoPopulation.innerHTML = `
      <div class="chart-title">${t("populationTitle")}</div>
      ${lineChart(
        [
          {
            label: t("populationTitle"),
            values: DEMOGRAPHY.population.map((entry) => ({ label: String(entry.year), value: entry.value })),
          },
        ],
        formatNumber,
        ["#1f1a17"],
      )}
      <p class="footnote"><a href="${DEMOGRAPHY.sourcePopulation}" target="_blank" rel="noreferrer">${t("populationFootnote")}</a></p>
    `;

    dom.demoEducation.innerHTML = `
      <div class="chart-title">${t("educationTitle")}</div>
      ${lineChart(
        [
          {
            label: t("educationTitle"),
            values: DEMOGRAPHY.tertiary.map((entry) => ({ label: String(entry.year), value: entry.value })),
          },
        ],
        formatPct,
        ["#2b9348"],
      )}
      <p class="footnote"><a href="${DEMOGRAPHY.sourceEducation}" target="_blank" rel="noreferrer">${t("educationFootnote")}</a></p>
    `;
  }

  function renderSources() {
    dom.sourceCard.innerHTML = `
      <div class="detail-title">${t("sourceTitle")}</div>
      <p class="source-copy">${t("sourceFootnote")}</p>
      <p class="source-copy">
        <a href="${SOURCE_URLS.round1Page}" target="_blank" rel="noreferrer">Paris 2026 · ${t("firstRound")}</a><br />
        <a href="${SOURCE_URLS.round2Page}" target="_blank" rel="noreferrer">Paris 2026 · ${t("secondRound")}</a><br />
        <a href="https://www.data.gouv.fr/datasets/elections-municipales-2014-1ertour/" target="_blank" rel="noreferrer">Paris Open Data · 2014</a><br />
        <a href="https://www.data.gouv.fr/datasets/elections-municipales-2020-1ertour/" target="_blank" rel="noreferrer">Paris Open Data · 2020</a><br />
        <a href="${DEMOGRAPHY.sourcePopulation}" target="_blank" rel="noreferrer">Insee · Population</a><br />
        <a href="${DEMOGRAPHY.sourceEducation}" target="_blank" rel="noreferrer">Insee · Diplômes</a>
      </p>
    `;
  }

  function ensureMapLayerVisibility() {
    const showMap = state.section === "map";
    const useBureauLayer = showMap && currentGeometryMode() === "bureau";
    const useArrondissementLayer = showMap && currentGeometryMode() === "arrondissement";
    if (useBureauLayer) {
      if (!map.hasLayer(geoLayer)) geoLayer.addTo(map);
      if (map.hasLayer(arrondissementLayer)) map.removeLayer(arrondissementLayer);
    } else if (useArrondissementLayer) {
      if (!map.hasLayer(arrondissementLayer)) arrondissementLayer.addTo(map);
      if (map.hasLayer(geoLayer)) map.removeLayer(geoLayer);
    }
  }

  function switchVisibleView() {
    dom.mapView.classList.toggle("is-visible", state.section === "map");
    dom.historyView.classList.toggle("is-visible", state.section === "history");
    dom.demographyView.classList.toggle("is-visible", state.section === "demography");
    if (state.section === "map") {
      ensureMapLayerVisibility();
      setTimeout(() => map.invalidateSize(), 60);
    }
  }

  function refreshMap() {
    getMapStyle.rangeCache = null;
    bureauLayerIndex.forEach((layer, id) => {
      layer.setStyle(getMapStyle(featureIndex.get(id)));
    });
    arrondissementLayerIndex.forEach((layer) => {
      layer.setStyle(getMapStyle(layer.feature));
    });
  }

  function renderAll() {
    if (state.section === "map" && !hasOfficialMapYear(state.year)) {
      state.year = "2026";
    }
    if (state.year !== "2026") {
      state.granularity = "arrondissement";
    }
    renderStaticChrome();
    renderWinnerBanner();
    renderControlVisibility();
    renderToggle(dom.languageToggle, LANGUAGE_OPTIONS, state.language, (value) => {
      state.language = value;
      renderAll();
    });
    renderToggle(dom.sectionToggle, SECTION_OPTIONS, state.section, (value) => {
      state.section = value;
      if (value === "map" && !hasOfficialMapYear(state.year)) {
        state.year = "2026";
      }
      renderAll();
    });
    renderToggle(dom.yearToggle, state.section === "map" ? MAP_YEAR_OPTIONS : YEAR_OPTIONS, state.year, (value) => {
      state.year = value;
      if (value !== "2026") {
        state.granularity = "arrondissement";
      }
      state.selectedKey = null;
      state.hoveredKey = null;
      ensureCandidate();
      renderAll();
    });
    renderToggle(dom.roundToggle, ROUND_OPTIONS, state.round, (value) => {
      state.round = value;
      ensureCandidate();
      renderAll();
    });
    renderToggle(dom.granularityToggle, state.year === "2026" ? GRANULARITY_OPTIONS : [GRANULARITY_OPTIONS[1]], state.granularity, (value) => {
      state.granularity = value;
      state.selectedKey = null;
      state.hoveredKey = null;
      renderAll();
    });
    renderToggle(dom.metricToggle, METRIC_OPTIONS, state.metric, (value) => {
      state.metric = value;
      renderAll();
    });
    renderCandidateSelect();
    renderMapTitle();
    renderMapSummaryCards();
    renderLegend();
    renderDetail();
    renderHistory();
    renderDemography();
    renderSources();
    switchVisibleView();
    refreshMap();
  }

  const map = L.map("map", {
    zoomControl: false,
    minZoom: 11,
    maxZoom: 16,
  }).setView([48.8566, 2.3522], 12.2);

  L.control.zoom({ position: "topright" }).addTo(map);

  if (!IS_LOCAL_CONTEXT) {
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
      attribution: "",
      subdomains: "abcd",
      pane: "overlayPane",
      maxZoom: 20,
    }).addTo(map);
  }

  const geoLayer = L.geoJSON(liveData.features, {
    style: getMapStyle,
    onEachFeature(feature, layer) {
      bureauLayerIndex.set(feature.properties.id_bv, layer);

      layer.on("mouseover", () => {
        if (isCompactViewport()) return;
        state.hoveredKey =
          currentGeometryMode() === "bureau"
            ? feature.properties.id_bv
            : `arr-${arrondissementGroupKey(feature.properties.arrondissement)}`;
        layer
          .bindTooltip(tooltipHtml(feature), {
            sticky: true,
            direction: "top",
            className: "custom-tooltip",
          })
          .openTooltip();
        renderDetail();
        refreshMap();
      });

      layer.on("mouseout", () => {
        if (isCompactViewport()) return;
        state.hoveredKey = null;
        renderDetail();
        refreshMap();
      });

      layer.on("click", () => {
        const nextKey =
          currentGeometryMode() === "bureau"
            ? feature.properties.id_bv
            : `arr-${arrondissementGroupKey(feature.properties.arrondissement)}`;
        state.selectedKey = state.selectedKey === nextKey ? null : nextKey;
        renderDetail();
        refreshMap();
        map.panTo(layer.getBounds().getCenter(), { animate: true, duration: 0.45 });
        focusDetailCard();
      });
    },
  });

  const arrondissementLayer = L.geoJSON(OFFICIAL_HISTORY.geojson, {
    style: getMapStyle,
    onEachFeature(feature, layer) {
      arrondissementLayerIndex.set(String(feature.properties.arrondissement), layer);

      layer.on("mouseover", () => {
        if (isCompactViewport()) return;
        state.hoveredKey = `arr-${feature.properties.arrondissement}`;
        layer
          .bindTooltip(tooltipHtml(feature), {
            sticky: true,
            direction: "top",
            className: "custom-tooltip",
          })
          .openTooltip();
        renderDetail();
        refreshMap();
      });

      layer.on("mouseout", () => {
        if (isCompactViewport()) return;
        state.hoveredKey = null;
        renderDetail();
        refreshMap();
      });

      layer.on("click", () => {
        const nextKey = `arr-${feature.properties.arrondissement}`;
        state.selectedKey = state.selectedKey === nextKey ? null : nextKey;
        renderDetail();
        refreshMap();
        map.panTo(layer.getBounds().getCenter(), { animate: true, duration: 0.45 });
        focusDetailCard();
      });
    },
  }).addTo(map);

  map.fitBounds(arrondissementLayer.getBounds(), { padding: [22, 22] });

  dom.candidateSelect.addEventListener("change", (event) => {
    state.candidate = event.target.value;
    renderAll();
  });

  dom.candidateTrigger.addEventListener("click", () => {
    state.dropdownOpen = !state.dropdownOpen;
    renderAll();
  });

  document.addEventListener("click", (event) => {
    if (!dom.candidateGroup.contains(event.target) && state.dropdownOpen) {
      state.dropdownOpen = false;
      renderAll();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.dropdownOpen) {
      state.dropdownOpen = false;
      renderAll();
    }
  });

  dom.resetView.addEventListener("click", () => {
    state.selectedKey = null;
    state.hoveredKey = null;
    map.fitBounds((currentGeometryMode() === "bureau" ? geoLayer : arrondissementLayer).getBounds(), { padding: [22, 22] });
    renderAll();
  });

  ensureCandidate();
  renderAll();
})();
