const CLUBS_PAR_DEPARTEMENT = {
  "31": [
    "EFCV Verfeil",
    "FC Girou",
    "L'Union Saint-Jean",
    "FC Lauragais",
    "Balma SC",
    "Castanet",
    "Saint-Orens FC",
    "US Colomiers"
  ],
  "81": [
    "FC Lavaur",
    "Albi Marssac",
    "Gaillac FC",
    "Graulhet FC",
    "Castres FC",
    "Mazamet FC"
  ],
  "82": [
    "Montauban FC",
    "Castelsarrasin",
    "Moissac FC",
    "Caussade",
    "Montech FC"
  ],
  "11": [
    "Narbonne",
    "Carcassonne",
    "Castelnaudary",
    "Limoux",
    "Trèbes FC"
  ],
  "09": [
    "Pamiers FC",
    "Foix FC",
    "Saint-Girons",
    "Lavelanet",
    "Luzenac"
  ],
  "34": [
    "Montpellier jeunes",
    "AS Béziers",
    "Sète",
    "Lunel",
    "Agde"
  ]
};

const CLUBS_CHAMPIONNAT = [
  "EFCV Verfeil",
  "FC Girou",
  "L'Union Saint-Jean",
  "FC Lauragais",
  "Balma SC",
  "Castanet",
  "Saint-Orens FC",
  "US Colomiers",
  "FC Lavaur",
  "Albi Marssac"
];

const BLESSURES = [
  { nom: "contracture", duree: 1 },
  { nom: "élongation", duree: 2 },
  { nom: "entorse de la cheville", duree: 3 },
  { nom: "lésion musculaire", duree: 4 }
];


const CLUBS_TRANSFERTS = [
  {
    nom: "FC Lavaur",
    niveau: 2,
    type: "club régional",
    reputationMin: 8,
    ageMin: 13
  },
  {
    nom: "Balma SC",
    niveau: 3,
    type: "club régional supérieur",
    reputationMin: 16,
    ageMin: 13
  },
  {
    nom: "US Colomiers",
    niveau: 4,
    type: "club régional élite",
    reputationMin: 28,
    ageMin: 14
  },
  {
    nom: "Toulouse FC - Centre de formation",
    niveau: 6,
    type: "centre de formation professionnel",
    reputationMin: 45,
    ageMin: 14
  },
  {
    nom: "Montpellier HSC - Centre de formation",
    niveau: 6,
    type: "centre de formation professionnel",
    reputationMin: 52,
    ageMin: 15
  }
];

const SELECTIONS_JEUNES = [
  {
    nom: "Sélection départementale",
    reputationMin: 22,
    ageMin: 13
  },
  {
    nom: "Sélection Occitanie",
    reputationMin: 48,
    ageMin: 14
  },
  {
    nom: "France U16",
    reputationMin: 78,
    ageMin: 15
  }
];


const TOURNOIS_FIN_SAISON = [
  {
    nom: "Tournoi du Lauragais",
    niveau: 1,
    reputationMin: 0
  },
  {
    nom: "Tournoi régional d'Occitanie",
    niveau: 2,
    reputationMin: 18
  },
  {
    nom: "Tournoi des centres de formation",
    niveau: 3,
    reputationMin: 42
  }
];

const POLES_DETECTION = [
  {
    nom: "Détection départementale Haute-Garonne",
    reputationMin: 16,
    age: 13
  },
  {
    nom: "Pôle Espoirs de Castelmaurou",
    reputationMin: 34,
    age: 13
  }
];


const EVENEMENTS_AVANT_ENTRAINEMENT = [
  {
    id: "fatigue_ecole",
    titre: "Fatigue après le sport à l'école",
    texte:
      "Tu as eu une séance de sport intense à l'école et tu n'as pas très envie d'aller à l'entraînement.",
    choixA: "J'y vais quand même",
    choixB: "Je reste à la maison"
  },
  {
    id: "pluie",
    titre: "Il pleut beaucoup",
    texte:
      "Il pleut fort et le terrain risque d'être lourd. Tu hésites à aller à l'entraînement.",
    choixA: "J'y vais",
    choixB: "Je n'y vais pas"
  },
  {
    id: "pere_retard",
    titre: "Ton père est en retard",
    texte:
      "Ton père est retenu au travail. Vous allez arriver en retard à l'entraînement.",
    choixA: "J'y vais malgré le retard",
    choixB: "Je renonce pour ce soir"
  }
];

const INTERACTIONS_COACH = [
  {
    id: "bavardage",
    texte:
      "Le coach te reproche de trop parler avec tes coéquipiers pendant les consignes.",
    confiance: -3,
    reputation: -1
  },
  {
    id: "vestiaire_sale",
    texte:
      "Le vestiaire a été laissé sale. Le coach impose une punition collective.",
    confiance: -2,
    fatigue: 5
  },
  {
    id: "retard",
    texte:
      "Tu arrives en retard. Le coach te fait commencer sur le banc.",
    confiance: -4,
    forceBanc: true
  },
  {
    id: "manque_implication",
    texte:
      "Le coach estime que tu manques d'implication à l'entraînement.",
    confiance: -3,
    forme: -2
  },
  {
    id: "felicitations",
    texte:
      "Le coach te félicite pour ton sérieux et ton comportement.",
    confiance: 3,
    reputation: 1
  }
];

const TOURNOIS_DETECTION = [
  {
    id: "violettes",
    nom: "Tournoi des Violettes au Stadium",
    age: 14,
    condition: "non_retenu_castelmaurou",
    reputationMin: 10,
    recruteurs: [
      "Toulouse FC",
      "US Colomiers",
      "Balma SC"
    ]
  },
  {
    id: "blanes",
    nom: "Tournoi international de Blanes",
    age: 15,
    condition: "tous",
    reputationMin: 18,
    recruteurs: [
      "Toulouse FC",
      "Montpellier HSC",
      "Girona FC",
      "Espanyol Barcelone"
    ]
  },
  {
    id: "cahors",
    nom: "Tournoi national de Cahors",
    age: 15,
    condition: "tous",
    reputationMin: 15,
    recruteurs: [
      "Toulouse FC",
      "Bordeaux",
      "Montpellier HSC",
      "Rodez AF"
    ]
  }
];


const EVENEMENTS_SEMAINE = [
  {
    id: "devoirs",
    titre: "Contrôle important demain",
    texte: "Tu dois choisir entre réviser sérieusement ou rester plus longtemps au city avec les copains.",
    choix: [
      { texte: "Je révise", moral: -1, mental: 2, fatigue: -4, scolaire: 2 },
      { texte: "Je vais jouer", moral: 3, technique: 1, fatigue: 5, scolaire: -2 }
    ]
  },
  {
    id: "pere_coups_francs",
    titre: "Séance supplémentaire avec ton père",
    texte: "Ton père te propose d'aller travailler les coups francs après le repas.",
    choix: [
      { texte: "J'accepte", technique: 2, fatigue: 7, relationParents: 2 },
      { texte: "Je préfère récupérer", fatigue: -8, forme: 2 }
    ]
  },
  {
    id: "copain_play",
    titre: "Invitation d'un coéquipier",
    texte: "Un copain te propose de sécher une séance pour jouer à la console.",
    choix: [
      { texte: "Je refuse", mental: 2, confiance: 1, relationVestiaire: -1 },
      { texte: "J'accepte", moral: 4, confiance: -5, reputation: -2, absence: true }
    ]
  },
  {
    id: "repas_famille",
    titre: "Repas de famille",
    texte: "Un repas important tombe le même soir que l'entraînement.",
    choix: [
      { texte: "Je vais au repas", moral: 3, relationParents: 3, confiance: -2, absence: true },
      { texte: "Je vais à l'entraînement", mental: 2, confiance: 2, relationParents: -1 }
    ]
  }
];

const INTERACTIONS_AVANT_MATCH = [
  {
    id: "banc",
    titre: "Tu débutes sur le banc",
    texte: "Le coach t'annonce que tu ne commenceras pas le match.",
    choix: [
      { texte: "Je respecte son choix", confiance: 1, mental: 1 },
      { texte: "Je lui demande pourquoi", confiance: 0, mental: 0 },
      { texte: "Je râle", confiance: -4, relationCoach: -3, forceBanc: true }
    ]
  },
  {
    id: "capitaine",
    titre: "Le brassard est disponible",
    texte: "Le capitaine habituel est absent. Le coach hésite entre toi et un autre joueur.",
    choix: [
      { texte: "Je me propose", confiance: 2, mental: 2, candidatCapitaine: true },
      { texte: "Je préfère rester concentré", forme: 1 }
    ]
  },
  {
    id: "douleur",
    titre: "Douleur à l'échauffement",
    texte: "Tu ressens une petite douleur musculaire avant le coup d'envoi.",
    choix: [
      { texte: "Je joue quand même", fatigue: 5, risqueBlessure: 0.12 },
      { texte: "Je préviens le coach", confiance: 1, forceBanc: true, fatigue: -4 }
    ]
  }
];

const ACTIONS_MATCH = {
  Gardien: [
    {
      minute: "18e",
      texte: "L'attaquant part seul face à toi.",
      choix: [
        { texte: "Je sors vite", stat: "physique" },
        { texte: "Je reste debout", stat: "mental" },
        { texte: "Je plonge dans ses pieds", stat: "vitesse", risqueCarton: 0.08 }
      ]
    },
    {
      minute: "64e",
      texte: "Penalty pour l'adversaire.",
      choix: [
        { texte: "Je plonge à gauche", hasard: true },
        { texte: "Je plonge à droite", hasard: true },
        { texte: "Je reste au centre", hasard: true }
      ]
    }
  ],
  Défenseur: [
    {
      minute: "31e",
      texte: "L'attaquant te provoque en un contre un.",
      choix: [
        { texte: "Je temporise", stat: "mental" },
        { texte: "Je tacle", stat: "physique", risqueCarton: 0.12 },
        { texte: "Je l'oriente vers la ligne", stat: "vitesse" }
      ]
    }
  ],
  Milieu: [
    {
      minute: "42e",
      texte: "Tu récupères le ballon dans l'axe.",
      choix: [
        { texte: "Passe verticale", stat: "technique", passePossible: true },
        { texte: "Je conserve", stat: "mental" },
        { texte: "Frappe de loin", stat: "technique", butPossible: true }
      ]
    }
  ],
  Attaquant: [
    {
      minute: "67e",
      texte: "Tu te retrouves face au gardien.",
      choix: [
        { texte: "Frappe croisée", stat: "technique", butPossible: true },
        { texte: "Piqué", stat: "mental", butPossible: true },
        { texte: "Je dribble", stat: "vitesse", butPossible: true },
        { texte: "Je passe", stat: "mental", passePossible: true }
      ]
    }
  ]
};

const EVENEMENTS_SENIORS_REGIONAUX = [
  {
    titre: "Le derby aux poteaux disparus",
    texte: "Le matin du derby, les poteaux ont mystérieusement disparu. Le match risque d'être reporté.",
    choix: [
      { texte: "On aide à installer des buts provisoires", reputation: 3, moral: 2 },
      { texte: "On rentre à la maison", moral: 1, reputation: -1, matchReporte: true }
    ]
  },
  {
    titre: "Synthétique disponible, terrain en herbe choisi",
    texte: "Il pleut depuis trois jours. Le synthétique est libre, mais le coach veut absolument jouer sur l'herbe.",
    choix: [
      { texte: "Je ne dis rien", fatigue: 4 },
      { texte: "Je propose le synthétique", relationCoach: -1, mental: 1 },
      { texte: "Je me plains devant tout le monde", relationCoach: -4, forceBanc: true }
    ]
  },
  {
    titre: "Nouveau coach et fils titulaire",
    texte: "Un nouveau coach arrive avec son fils, systématiquement annoncé titulaire malgré des performances discutables.",
    choix: [
      { texte: "Je travaille encore plus", mental: 3, fatigue: 5 },
      { texte: "Je simule une petite blessure", confiance: -2, moral: 2, forceBanc: true },
      { texte: "Je confronte le coach", relationCoach: -5, reputation: 1 }
    ]
  },
  {
    titre: "Les maillots sont restés au local",
    texte: "À trente minutes du coup d'envoi, personne n'a pris le sac de maillots.",
    choix: [
      { texte: "Je retourne les chercher", reputation: 2, fatigue: 4 },
      { texte: "Je laisse les dirigeants gérer", moral: -1 }
    ]
  },
  {
    titre: "Prime de victoire surprise",
    texte: "Le président annonce une prime exceptionnelle : un repas saucisse-frites à la buvette.",
    choix: [
      { texte: "Je joue le jeu", moral: 4, relationVestiaire: 3 },
      { texte: "Je demande une vraie prime", reputation: -2, relationPresident: -3 }
    ]
  }
];


const CLUBS_CHAMPIONNAT_NATIONAL_JEUNES = [
  "Pôle Espoirs de Castelmaurou",
  "INF Clairefontaine",
  "Toulouse FC Réserve Jeunes",
  "Montpellier HSC Réserve Jeunes",
  "Bordeaux Réserve Jeunes",
  "Rodez AF Réserve Jeunes",
  "Nîmes Olympique Réserve Jeunes",
  "Pau FC Réserve Jeunes",
  "Clermont Foot Réserve Jeunes",
  "AS Monaco Réserve Jeunes"
];

const CENTRES_FORMATION_PRO = [
  {
    niveau: "National / Ligue 3",
    reputationMin: 28,
    clubs: [
      "Nîmes Olympique",
      "Châteauroux",
      "Dijon FCO",
      "Le Mans FC",
      "Sochaux"
    ]
  },
  {
    niveau: "Ligue 2",
    reputationMin: 45,
    clubs: [
      "Rodez AF",
      "Pau FC",
      "Grenoble Foot 38",
      "Amiens SC",
      "Guingamp"
    ]
  },
  {
    niveau: "Ligue 1",
    reputationMin: 65,
    clubs: [
      "Toulouse FC",
      "Montpellier HSC",
      "Olympique Lyonnais",
      "AS Monaco",
      "Lille OSC"
    ]
  }
];
