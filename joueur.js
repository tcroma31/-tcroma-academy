function valeurInitiale() {
  return 40 + Math.floor(Math.random() * 16);
}

function creerEtatInitial() {
  const clubJoueur = localStorage.getItem("club") || "EFCV Verfeil";

  return {
    joueur: {
      prenom: localStorage.getItem("prenom") || "Joueur",
      nom: localStorage.getItem("nom") || "",
      poste: localStorage.getItem("poste") || "Non défini",
      club: clubJoueur,
      age: 13,
      technique: valeurInitiale(),
      vitesse: valeurInitiale(),
      physique: valeurInitiale(),
      mental: valeurInitiale(),
      fatigue: 10,
      forme: 65,
      confiance: 50,
      semainesBlessure: 0,
      nomBlessure: "",
      matchs: 0,
      buts: 0,
      passes: 0,
      hommesDuMatch: 0,
      sommeNotes: 0,
      arrets: 0,
      cleanSheets: 0,
      penaltiesArretes: 0,
      butsEncaisses: 0,
      reputation: 0,
      potentiel: 70 + Math.floor(Math.random() * 21),
      selection: "Aucune",
      titres: [],
      cartonsBlancs: 0,
      cartonsJaunes: 0,
      cartonsRouges: 0,
      suspensions: 0,
      matchsSuspendu: 0,
      auPoleCastelmaurou: false,
      refuseCastelmaurou: false,
      niveauNational: false,
      centreFormation: "Aucun",
      niveauChampionnat: "Régional jeunes",
      tournoisJoues: [],
      moral: 60,
      scolaire: 50,
      relationCoach: 50,
      relationParents: 60,
      relationVestiaire: 50,
      relationPresident: 50,
      capitaine: false,
      historiqueChoix: []
    },
    saison: {
      journee: 1,
      phase: "entrainement",
      dernierScore: null,
      dernierTexte: "",
      dernierEntrainement: "",
      journal: [
        {
          titre: "Début de carrière",
          texte: "Arrivée au " + clubJoueur + " à 13 ans."
        }
      ],
      offreTransfert: null,
      selectionProposee: null,
      detectionPole: null,
      resultatTournoi: null,
      tournoiSpecial: null,
      evenementAvantEntrainement: null,
      decisionEntrainementPrise: false,
      interactionCoach: null,
      forceBanc: false,
      evenementSemaine: null,
      choixSemaineFait: false,
      interactionAvantMatch: null,
      choixAvantMatchFait: false,
      actionMatch: null,
      choixActionMatchFait: false,
      bonusActionMatch: 0,
      seniorEvent: null,
      demandeReposMatch: false,
      motifAbsence: "",
      dernierMatchAbsent: null,
      bilanCalcule: false
    },
    championnat: null
  };

  etat.championnat = creerChampionnat(
    clubJoueur,
    etat.joueur
  );

  return etat;
}

function limiter(valeur, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, valeur));
}

function noteMoyenne(joueur) {
  if (joueur.matchs === 0) {
    return 0;
  }

  return joueur.sommeNotes / joueur.matchs;
}

function ajouterJournal(etat, titre, texte) {
  etat.saison.journal.unshift({ titre, texte });

  if (etat.saison.journal.length > 40) {
    etat.saison.journal.pop();
  }
}


function calculerReputationSaison(etat) {
  const joueur = etat.joueur;
  const moyenne = noteMoyenne(joueur);
  const place = positionClub(etat);

  let gain = 2;

  gain += Math.floor(joueur.buts * 1.5);
  gain += joueur.passes;
  gain += joueur.hommesDuMatch * 3;
  gain += Math.max(0, Math.floor((moyenne - 6) * 7));

  if (place <= 3) {
    gain += 6;
  }

  joueur.reputation = limiter(
    joueur.reputation + gain,
    0,
    100
  );

  return gain;
}

function genererOffreTransfert(etat) {
  const joueur = etat.joueur;

  const eligibles = CLUBS_TRANSFERTS.filter(club =>
    club.nom !== joueur.club &&
    joueur.age >= club.ageMin &&
    joueur.reputation >= club.reputationMin
  );

  if (eligibles.length === 0) {
    etat.saison.offreTransfert = null;
    return null;
  }

  const offre =
    eligibles[Math.floor(Math.random() * eligibles.length)];

  etat.saison.offreTransfert = {
    nom: offre.nom,
    niveau: offre.niveau,
    type: offre.type,
    message:
      offre.nom +
      " souhaite recruter " +
      joueur.prenom +
      " " +
      joueur.nom +
      "."
  };

  return etat.saison.offreTransfert;
}

function verifierSelection(etat) {
  const joueur = etat.joueur;

  const eligibles = SELECTIONS_JEUNES.filter(selection =>
    joueur.age >= selection.ageMin &&
    joueur.reputation >= selection.reputationMin
  );

  if (eligibles.length === 0) {
    etat.saison.selectionProposee = null;
    return null;
  }

  const meilleure = eligibles[eligibles.length - 1];

  if (joueur.selection === meilleure.nom) {
    etat.saison.selectionProposee = null;
    return null;
  }

  etat.saison.selectionProposee = meilleure.nom;
  return meilleure.nom;
}


function estGardien(joueur) {
  return joueur.poste === "Gardien";
}

function verifierDetectionPole(etat) {
  const joueur = etat.joueur;

  // La détection n'a lieu qu'à la fin de la saison des 13 ans.
  if (joueur.age !== 13) {
    etat.saison.detectionPole = null;
    return null;
  }

  // La convocation à la journée de détection est automatique.
  const moyenne = noteMoyenne(joueur);

  const niveauMoyen =
    (
      joueur.technique +
      joueur.vitesse +
      joueur.physique +
      joueur.mental
    ) / 4;

  const comportement =
    joueur.confiance * 0.20 +
    joueur.mental * 0.25 +
    joueur.reputation * 0.20 +
    joueur.relationCoach * 0.10;

  const performance =
    niveauMoyen * 0.55 +
    moyenne * 4 +
    comportement * 0.35 +
    Math.random() * 22;

  let message;
  let retenu = false;
  let niveau = "Détection au Pôle Espoirs de Castelmaurou";

  if (performance >= 82) {
    retenu = true;

    message =
      "Félicitations ! Tu es retenu au Pôle Espoirs de Castelmaurou. " +
      "Tu entres dans un parcours de niveau national et tu seras suivi " +
      "par plusieurs centres de formation professionnels.";

    joueur.auPoleCastelmaurou = true;
    joueur.refuseCastelmaurou = false;
    joueur.niveauNational = true;
    joueur.club = "Pôle Espoirs de Castelmaurou";
    joueur.niveauChampionnat = "National jeunes";

    joueur.reputation = limiter(
      joueur.reputation + 12,
      0,
      100
    );
  } else if (performance >= 68) {
    message =
      "Tu réalises une bonne détection au Pôle Espoirs de Castelmaurou, " +
      "mais tu n'es pas retenu dans le groupe final. Ton nom reste cependant " +
      "dans les rapports des recruteurs.";

    joueur.auPoleCastelmaurou = false;
    joueur.refuseCastelmaurou = true;

    joueur.reputation = limiter(
      joueur.reputation + 4,
      0,
      100
    );
  } else {
    message =
      "La détection au Pôle Espoirs de Castelmaurou est difficile. " +
      "Tu n'es pas retenu cette saison. Tu devras rebondir à 14 ans, " +
      "notamment au Tournoi des Violettes au Stadium.";

    joueur.auPoleCastelmaurou = false;
    joueur.refuseCastelmaurou = true;

    joueur.reputation = limiter(
      joueur.reputation + 1,
      0,
      100
    );
  }

  etat.saison.detectionPole = {
    nom: niveau,
    retenu,
    performance: Math.round(performance),
    message
  };

  ajouterJournal(
    etat,
    "Détection à Castelmaurou",
    message
  );

  return etat.saison.detectionPole;
}

function jouerTournoiFinSaison(etat) {
  const joueur = etat.joueur;

  const eligibles = TOURNOIS_FIN_SAISON.filter(tournoi =>
    joueur.reputation >= tournoi.reputationMin
  );

  const tournoi = eligibles[eligibles.length - 1];
  const niveau =
    (joueur.technique +
      joueur.vitesse +
      joueur.physique +
      joueur.mental) / 4;

  const performance =
    niveau +
    joueur.forme * 0.20 +
    joueur.confiance * 0.20 -
    joueur.fatigue * 0.15 +
    Math.random() * 35;

  let resultat;
  let gainReputation = 0;

  if (performance < 62) {
    resultat = "Élimination en phase de poules.";
    gainReputation = 1;
  } else if (performance < 76) {
    resultat = "Qualification jusqu'en quart de finale.";
    gainReputation = 3;
  } else if (performance < 90) {
    resultat = "Très beau parcours jusqu'en demi-finale.";
    gainReputation = 6;
  } else {
    resultat = "Victoire dans le tournoi !";
    gainReputation = 10;

    if (!joueur.titres.includes(tournoi.nom)) {
      joueur.titres.push(tournoi.nom);
    }
  }

  joueur.reputation = limiter(
    joueur.reputation + gainReputation,
    0,
    100
  );

  etat.saison.resultatTournoi = {
    nom: tournoi.nom,
    resultat,
    gainReputation
  };

  ajouterJournal(
    etat,
    tournoi.nom,
    resultat + " Réputation : +" + gainReputation + "."
  );

  return etat.saison.resultatTournoi;
}


function genererEvenementAvantEntrainement(etat) {
  if (etat.saison.decisionEntrainementPrise) {
    return etat.saison.evenementAvantEntrainement;
  }

  if (Math.random() >= 0.45) {
    etat.saison.evenementAvantEntrainement = null;
    return null;
  }

  const evenement =
    EVENEMENTS_AVANT_ENTRAINEMENT[
      Math.floor(Math.random() * EVENEMENTS_AVANT_ENTRAINEMENT.length)
    ];

  etat.saison.evenementAvantEntrainement = evenement;
  return evenement;
}

function traiterChoixEvenement(etat, aller) {
  const joueur = etat.joueur;
  const evenement = etat.saison.evenementAvantEntrainement;

  if (!evenement) {
    etat.saison.decisionEntrainementPrise = true;
    return "";
  }

  let message = "";

  if (aller) {
    if (evenement.id === "fatigue_ecole") {
      joueur.fatigue = limiter(joueur.fatigue + 10, 0, 100);
      joueur.mental = limiter(joueur.mental + 1, 0, 100);
      message =
        "Tu fais l'effort d'y aller malgré la fatigue. +1 en mental, mais la fatigue augmente.";
    }

    if (evenement.id === "pluie") {
      joueur.physique = limiter(joueur.physique + 1, 0, 100);
      joueur.fatigue = limiter(joueur.fatigue + 6, 0, 100);
      message =
        "Tu t'entraînes sous la pluie. +1 en physique, mais la séance est éprouvante.";
    }

    if (evenement.id === "pere_retard") {
      joueur.confiance = limiter(joueur.confiance - 2, 0, 100);
      etat.saison.forceBanc = true;
      message =
        "Tu arrives en retard. Le coach apprécie que tu sois venu, mais tu risques de commencer sur le banc.";
    }

    ajouterJournal(etat, evenement.titre, message);
  } else {
    joueur.confiance = limiter(joueur.confiance - 4, 0, 100);
    joueur.reputation = limiter(joueur.reputation - 1, 0, 100);
    joueur.forme = limiter(joueur.forme - 2, 0, 100);

    message =
      "Tu ne vas pas à l'entraînement. Le coach est déçu et ta confiance baisse.";

    etat.saison.phase = "match";

    ajouterJournal(
      etat,
      "Entraînement manqué",
      evenement.titre + " : " + message
    );
  }

  etat.saison.decisionEntrainementPrise = true;
  return message;
}

function genererInteractionCoach(etat) {
  if (Math.random() >= 0.35) {
    etat.saison.interactionCoach = null;
    return null;
  }

  const interaction =
    INTERACTIONS_COACH[
      Math.floor(Math.random() * INTERACTIONS_COACH.length)
    ];

  etat.saison.interactionCoach = interaction;
  const joueur = etat.joueur;

  if (interaction.confiance) {
    joueur.confiance = limiter(
      joueur.confiance + interaction.confiance,
      0,
      100
    );
  }

  if (interaction.reputation) {
    joueur.reputation = limiter(
      joueur.reputation + interaction.reputation,
      0,
      100
    );
  }

  if (interaction.fatigue) {
    joueur.fatigue = limiter(
      joueur.fatigue + interaction.fatigue,
      0,
      100
    );
  }

  if (interaction.forme) {
    joueur.forme = limiter(
      joueur.forme + interaction.forme,
      0,
      100
    );
  }

  if (interaction.forceBanc) {
    etat.saison.forceBanc = true;
  }

  ajouterJournal(
    etat,
    "Interaction avec le coach",
    interaction.texte
  );

  return interaction;
}

function verifierAccesCentreFormation(etat) {
  const joueur = etat.joueur;

  if (!joueur.auPoleCastelmaurou) {
    return null;
  }

  if (joueur.age < 14 || joueur.reputation < 45) {
    return null;
  }

  const centres = [
    "Toulouse FC - Centre de formation",
    "Montpellier HSC - Centre de formation",
    "Bordeaux - Centre de formation"
  ];

  const centre =
    centres[Math.floor(Math.random() * centres.length)];

  joueur.centreFormation = centre;

  ajouterJournal(
    etat,
    "Centre de formation",
    "Grâce à ton passage au Pôle Espoirs de Castelmaurou, " +
      centre +
      " te propose d'intégrer son parcours national."
  );

  return centre;
}

function jouerTournoiSpecial(etat) {
  const joueur = etat.joueur;

  const tournoi = TOURNOIS_DETECTION.find(item => {
    if (item.age !== joueur.age) {
      return false;
    }

    if (
      item.condition === "non_retenu_castelmaurou" &&
      !joueur.refuseCastelmaurou
    ) {
      return false;
    }

    return joueur.reputation >= item.reputationMin;
  });

  if (!tournoi || joueur.tournoisJoues.includes(tournoi.id)) {
    etat.saison.tournoiSpecial = null;
    return null;
  }

  const niveau =
    (joueur.technique +
      joueur.vitesse +
      joueur.physique +
      joueur.mental) / 4;

  const performance =
    niveau +
    joueur.forme * 0.25 +
    joueur.confiance * 0.20 -
    joueur.fatigue * 0.15 +
    Math.random() * 35;

  let resultat;
  let gainReputation;
  let recruteur = null;

  if (performance < 65) {
    resultat = "Tu ne parviens pas à sortir de la phase de poules.";
    gainReputation = 1;
  } else if (performance < 78) {
    resultat = "Tu réalises un tournoi sérieux jusqu'en quart de finale.";
    gainReputation = 4;
  } else if (performance < 91) {
    resultat = "Très gros tournoi : tu atteins la demi-finale.";
    gainReputation = 8;

    recruteur =
      tournoi.recruteurs[
        Math.floor(Math.random() * tournoi.recruteurs.length)
      ];
  } else {
    resultat =
      "Tournoi exceptionnel : ton équipe atteint la finale et tu fais partie des révélations.";
    gainReputation = 12;

    recruteur =
      tournoi.recruteurs[
        Math.floor(Math.random() * tournoi.recruteurs.length)
      ];
  }

  joueur.reputation = limiter(
    joueur.reputation + gainReputation,
    0,
    100
  );

  joueur.tournoisJoues.push(tournoi.id);

  etat.saison.tournoiSpecial = {
    nom: tournoi.nom,
    resultat,
    gainReputation,
    recruteur
  };

  let texteJournal =
    resultat + " Réputation : +" + gainReputation + ".";

  if (recruteur) {
    texteJournal +=
      " Un recruteur de " +
      recruteur +
      " demande à suivre ton évolution.";

    etat.saison.offreTransfert = {
      nom: recruteur,
      niveau: 6,
      type: "recrutement après tournoi",
      message:
        recruteur +
        " t'a repéré pendant le " +
        tournoi.nom +
        " et souhaite te faire venir."
    };
  }

  ajouterJournal(
    etat,
    tournoi.nom,
    texteJournal
  );

  return etat.saison.tournoiSpecial;
}


function appliquerEffets(joueur, effets) {
  const champsBornes = [
    "technique", "vitesse", "physique", "mental",
    "fatigue", "forme", "confiance", "reputation",
    "moral", "scolaire", "relationCoach",
    "relationParents", "relationVestiaire", "relationPresident"
  ];

  for (const [cle, valeur] of Object.entries(effets)) {
    if (champsBornes.includes(cle)) {
      joueur[cle] = limiter((joueur[cle] || 0) + valeur, 0, 100);
    }
  }
}

function genererEvenementSemaine(etat) {
  if (etat.saison.choixSemaineFait) {
    return null;
  }

  if (etat.joueur.age >= 18 && Math.random() < 0.40) {
    const evt = EVENEMENTS_SENIORS_REGIONAUX[
      Math.floor(Math.random() * EVENEMENTS_SENIORS_REGIONAUX.length)
    ];
    etat.saison.seniorEvent = evt;
    return evt;
  }

  if (Math.random() < 0.45) {
    const evt = EVENEMENTS_SEMAINE[
      Math.floor(Math.random() * EVENEMENTS_SEMAINE.length)
    ];
    etat.saison.evenementSemaine = evt;
    return evt;
  }

  return null;
}

function traiterChoixSemaine(etat, indexChoix) {
  const evt =
    etat.saison.seniorEvent ||
    etat.saison.evenementSemaine;

  if (!evt) {
    etat.saison.choixSemaineFait = true;
    return "";
  }

  const choix = evt.choix[indexChoix];
  appliquerEffets(etat.joueur, choix);

  if (choix.forceBanc) {
    etat.saison.forceBanc = true;
  }

  if (choix.absence) {
    etat.saison.phase = "match";
  }

  etat.joueur.historiqueChoix.push({
    age: etat.joueur.age,
    titre: evt.titre,
    choix: choix.texte
  });

  ajouterJournal(
    etat,
    evt.titre,
    "Choix : " + choix.texte
  );

  etat.saison.choixSemaineFait = true;
  return choix.texte;
}

function genererInteractionAvantMatch(etat) {
  if (etat.saison.choixAvantMatchFait) {
    return null;
  }

  if (Math.random() >= 0.50) {
    return null;
  }

  const interaction = INTERACTIONS_AVANT_MATCH[
    Math.floor(Math.random() * INTERACTIONS_AVANT_MATCH.length)
  ];

  etat.saison.interactionAvantMatch = interaction;
  return interaction;
}

function traiterChoixAvantMatch(etat, indexChoix) {
  const interaction = etat.saison.interactionAvantMatch;

  if (!interaction) {
    etat.saison.choixAvantMatchFait = true;
    return;
  }

  const choix = interaction.choix[indexChoix];
  appliquerEffets(etat.joueur, choix);

  if (choix.forceBanc) {
    etat.saison.forceBanc = true;
  }

  if (choix.candidatCapitaine && etat.joueur.mental > 65) {
    etat.joueur.capitaine = true;
  }

  if (choix.risqueBlessure && Math.random() < choix.risqueBlessure) {
    provoquerBlessure(etat, "match");
  }

  ajouterJournal(
    etat,
    interaction.titre,
    "Choix : " + choix.texte
  );

  etat.saison.choixAvantMatchFait = true;
}

function categoriePoste(poste) {
  if (poste === "Gardien") return "Gardien";
  if (poste.includes("Défenseur") || poste.includes("Latéral")) return "Défenseur";
  if (poste.includes("Milieu") || poste === "Meneur de jeu") return "Milieu";
  return "Attaquant";
}

function genererActionMatch(etat) {
  const categorie = categoriePoste(etat.joueur.poste);
  const actions = ACTIONS_MATCH[categorie] || ACTIONS_MATCH.Attaquant;

  const modele =
    actions[Math.floor(Math.random() * actions.length)];

  // On crée une copie pour ne pas modifier les données originales.
  const action = {
    ...modele,
    choix: modele.choix.map(choix => ({ ...choix }))
  };

  // L'action peut arriver à n'importe quel moment crédible du match.
  let minute = 6 + Math.floor(Math.random() * 83);

  // On évite les minutes trop proches de la mi-temps.
  if (minute >= 44 && minute <= 47) {
    minute = Math.random() < 0.5 ? 43 : 48;
  }

  action.minute = minute + "e";

  etat.saison.actionMatch = action;
  etat.saison.choixActionMatchFait = false;

  return action;
}

function traiterActionMatch(etat, indexChoix) {
  const action = etat.saison.actionMatch;
  if (!action) return "";

  const choix = action.choix[indexChoix];
  const joueur = etat.joueur;

  let reussite = 0.50;

  if (choix.stat) {
    reussite += (joueur[choix.stat] - 50) / 120;
  }

  if (choix.hasard) {
    reussite = 0.33;
  }

  const succes = Math.random() < limiter(reussite, 0.15, 0.88);
  let message;

  if (succes) {
    etat.saison.bonusActionMatch += 8;
    message = "Action réussie : " + choix.texte + ".";

    if (choix.butPossible && Math.random() < 0.55) {
      etat.saison.bonusActionMatch += 7;
      etat.saison.butInteraction = 1;
      message += " Tu marques !";
    }

    if (choix.passePossible && Math.random() < 0.55) {
      etat.saison.bonusActionMatch += 5;
      etat.saison.passeInteraction = 1;
      message += " Ta passe devient décisive !";
    }
  } else {
    etat.saison.bonusActionMatch -= 4;
    message = "Action ratée : " + choix.texte + ".";

    if (choix.risqueCarton && Math.random() < choix.risqueCarton) {
      joueur.cartonsJaunes++;
      message += " Tu prends un carton jaune.";
    }
  }

  ajouterJournal(
    etat,
    action.minute + " minute",
    message
  );

  etat.saison.choixActionMatchFait = true;
  return message;
}


function proposerCentreFormationPro(etat) {
  const joueur = etat.joueur;

  const niveauxEligibles = CENTRES_FORMATION_PRO.filter(niveau =>
    joueur.reputation >= niveau.reputationMin
  );

  if (niveauxEligibles.length === 0) {
    return null;
  }

  const meilleurNiveau =
    niveauxEligibles[niveauxEligibles.length - 1];

  const club =
    meilleurNiveau.clubs[
      Math.floor(Math.random() * meilleurNiveau.clubs.length)
    ];

  joueur.centreFormation =
    club + " - Centre de formation";

  joueur.club = joueur.centreFormation;
  joueur.niveauNational = true;
  joueur.niveauChampionnat =
    "Centre de formation professionnel - " +
    meilleurNiveau.niveau;

  ajouterJournal(
    etat,
    "Centre de formation professionnel",
    club +
      " te recrute après avoir suivi tes performances. " +
      "Tu intègres un centre de formation de niveau " +
      meilleurNiveau.niveau +
      "."
  );

  return joueur.centreFormation;
}

function peutDemanderRepos(joueur) {
  return joueur.fatigue >= 70;
}

function demanderReposMatch(etat) {
  const joueur = etat.joueur;

  if (!peutDemanderRepos(joueur)) {
    return false;
  }

  etat.saison.demandeReposMatch = true;
  etat.saison.motifAbsence = "Repos demandé en raison d'une forte fatigue";

  joueur.fatigue = limiter(
    joueur.fatigue - 25,
    0,
    100
  );

  joueur.confiance = limiter(
    joueur.confiance - 1,
    0,
    100
  );

  ajouterJournal(
    etat,
    "Repos accordé",
    "Le joueur demande à ne pas être retenu. Fatigue : -25."
  );

  return true;
}
