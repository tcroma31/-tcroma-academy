function jouerMatchChampionnat(etat) {
  const joueur = etat.joueur;
  const rencontre = matchDuJoueur(etat);

  if (!rencontre) {
    throw new Error("Aucun match programmé.");
  }

  const niveauMoyen =
    (joueur.technique +
      joueur.vitesse +
      joueur.physique +
      joueur.mental) / 4;

  const performance =
    niveauMoyen +
    joueur.forme * 0.25 +
    joueur.confiance * 0.20 -
    joueur.fatigue * 0.30 +
    Math.random() * 35 +
    (etat.saison.bonusActionMatch || 0);

  if (joueur.matchsSuspendu > 0) {
    throw new Error("Le joueur est suspendu pour cette rencontre.");
  }

  const titulaire =
    performance >= 62 &&
    joueur.fatigue < 85 &&
    joueur.semainesBlessure === 0 &&
    !etat.saison.forceBanc;

  let note;
  let texte;
  let butCeMatch = etat.saison.butInteraction || 0;
  let passeCeMatch = etat.saison.passeInteraction || 0;
  let arretsCeMatch = 0;
  let penaltyArrete = 0;

  if (!titulaire) {
    note = 4.8 + Math.random() * 1.3;
    texte =
      "Tu commences sur le banc et entres en fin de rencontre.";
    joueur.confiance = limiter(joueur.confiance - 2, 0, 100);
  } else if (performance < 72) {
    note = 5.5 + Math.random() * 1.1;
    texte =
      "Match difficile. L'entraîneur attend davantage.";
    joueur.confiance = limiter(joueur.confiance - 1, 0, 100);
  } else if (performance < 91) {
    note = 6.4 + Math.random() * 1.2;
    texte =
      "Tu réalises un match sérieux et appliqué.";
    joueur.confiance = limiter(joueur.confiance + 2, 0, 100);
  } else {
    note = 7.7 + Math.random() * 1.3;
    texte =
      "Très gros match ! Tu fais partie des meilleurs.";
    joueur.confiance = limiter(joueur.confiance + 5, 0, 100);
  }

  if (titulaire) {
    if (estGardien(joueur)) {
      arretsCeMatch =
        2 +
        Math.floor(Math.random() * 7) +
        Math.floor(Math.max(0, performance - 75) / 12);

      if (Math.random() < 0.07) {
        penaltyArrete = 1;
      }

      // Extrêmement rare pour un gardien.
      if (Math.random() < 0.002) {
        butCeMatch = 1;
      }

      if (Math.random() < 0.008) {
        passeCeMatch = 1;
      }
    } else if (
      joueur.poste.includes("Défenseur") ||
      joueur.poste.includes("Latéral")
    ) {
      if (Math.random() < 0.12) {
        butCeMatch = 1;
      }

      if (Math.random() < 0.20) {
        passeCeMatch = 1;
      }
    } else if (
      joueur.poste.includes("Milieu") ||
      joueur.poste === "Meneur de jeu"
    ) {
      if (Math.random() < 0.25) {
        butCeMatch = 1;
      }

      if (Math.random() < 0.38) {
        passeCeMatch = 1;
      }
    } else {
      if (Math.random() < 0.48) {
        butCeMatch = 1;
      }

      if (Math.random() < 0.30) {
        passeCeMatch = 1;
      }
    }
  }

  let butsJoueur;
  let butsAdversaire;

  if (estGardien(joueur)) {
    const solidite =
      joueur.physique * 0.25 +
      joueur.mental * 0.30 +
      joueur.forme * 0.20 +
      joueur.confiance * 0.15 -
      joueur.fatigue * 0.20 +
      Math.random() * 25;

    butsAdversaire =
      solidite >= 75
        ? Math.floor(Math.random() * 2)
        : Math.floor(Math.random() * 4);

    butsJoueur = Math.floor(Math.random() * 4);
  } else {
    butsJoueur =
      Math.floor(
        Math.random() *
        4 *
        (
          1.1 +
          joueur.confiance / 150 +
          joueur.forme / 220 -
          joueur.fatigue / 300
        )
      );

    butsJoueur = Math.max(0, butsJoueur, butCeMatch);
    butsAdversaire = Math.floor(Math.random() * 4);
  }

  let butsDom;
  let butsExt;

  if (rencontre.domicile === joueur.club) {
    butsDom = butsJoueur;
    butsExt = butsAdversaire;
  } else {
    butsDom = butsAdversaire;
    butsExt = butsJoueur;
  }

  enregistrerResultat(
    etat,
    rencontre.domicile,
    rencontre.exterieur,
    butsDom,
    butsExt
  );

  simulerAutresMatchs(etat);

  joueur.matchs++;
  joueur.buts += butCeMatch;
  joueur.passes += passeCeMatch;
  joueur.sommeNotes += note;

  if (estGardien(joueur)) {
    const encaisses =
      rencontre.domicile === joueur.club
        ? butsExt
        : butsDom;

    joueur.arrets += arretsCeMatch;
    joueur.butsEncaisses += encaisses;
    joueur.penaltiesArretes += penaltyArrete;

    if (encaisses === 0 && titulaire) {
      joueur.cleanSheets++;
    }
  }

  if (note >= 8) {
    joueur.hommesDuMatch++;
  }

  let sanctionTexte = "";
  const tirageCarton = Math.random();

  if (tirageCarton < 0.05) {
    joueur.cartonsBlancs++;
    sanctionTexte =
      "<br>Carton blanc : exclusion temporaire pendant le match.";
    note = Math.max(3.5, note - 0.5);
  } else if (tirageCarton < 0.09) {
    joueur.cartonsJaunes++;
    sanctionTexte = "<br>Carton jaune.";
  } else if (tirageCarton < 0.105) {
    joueur.cartonsRouges++;
    joueur.suspensions++;
    joueur.matchsSuspendu = 1;
    sanctionTexte =
      "<br>Carton rouge : suspension pour la prochaine journée.";
    note = Math.max(3.0, note - 1.2);
  }

  joueur.fatigue = limiter(joueur.fatigue + 14, 0, 100);

  if (note >= 7) {
    joueur.forme = limiter(joueur.forme + 3, 0, 100);
  } else if (note < 5.8) {
    joueur.forme = limiter(joueur.forme - 4, 0, 100);
  }

  const blesse = provoquerBlessure(etat, "match");

  texte +=
    "<br><br>Statut : " +
    (titulaire ? "Titulaire" : "Remplaçant") +
    "<br>Note : " +
    note.toFixed(1) +
    "/10";

  if (estGardien(joueur)) {
    const encaisses =
      rencontre.domicile === joueur.club
        ? butsExt
        : butsDom;

    texte +=
      "<br>Arrêts : " +
      arretsCeMatch +
      "<br>Buts encaissés : " +
      encaisses +
      "<br>Clean sheet : " +
      (encaisses === 0 && titulaire ? "Oui" : "Non") +
      "<br>Penalty arrêté : " +
      (penaltyArrete ? "Oui" : "Non");

    if (butCeMatch > 0 || passeCeMatch > 0) {
      texte +=
        "<br>Action exceptionnelle : " +
        butCeMatch +
        " but, " +
        passeCeMatch +
        " passe décisive.";
    }
  } else {
    texte +=
      "<br>Buts : " +
      butCeMatch +
      "<br>Passes décisives : " +
      passeCeMatch;
  }

  texte += sanctionTexte;

  if (blesse) {
    texte +=
      "<br><br>🚑 Blessure : " +
      joueur.nomBlessure +
      " — " +
      joueur.semainesBlessure +
      " journée(s).";
  }

  etat.saison.dernierScore = {
    domicile: rencontre.domicile,
    exterieur: rencontre.exterieur,
    butsDomicile: butsDom,
    butsExterieur: butsExt
  };

  etat.saison.dernierTexte = texte;
  etat.saison.phase = "resultat";

  ajouterJournal(
    etat,
    "Journée " + etat.saison.journee,
    rencontre.domicile +
      " " +
      butsDom +
      " - " +
      butsExt +
      " " +
      rencontre.exterieur +
      " | Note : " +
      note.toFixed(1)
  );
}

