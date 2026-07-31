function provoquerBlessure(etat, source) {
  const joueur = etat.joueur;

  let risque = 0.015;

  if (source === "entrainement") {
    risque += joueur.fatigue / 650;
  }

  if (source === "match") {
    risque += joueur.fatigue / 500;
  }

  if (joueur.physique < 45) {
    risque += 0.025;
  }

  if (Math.random() >= risque) {
    return false;
  }

  const blessure =
    BLESSURES[Math.floor(Math.random() * BLESSURES.length)];

  joueur.nomBlessure = blessure.nom;
  joueur.semainesBlessure = blessure.duree;
  joueur.forme = limiter(joueur.forme - 12, 0, 100);
  joueur.confiance = limiter(joueur.confiance - 5, 0, 100);

  etat.saison.phase = "blessure";

  ajouterJournal(
    etat,
    "Blessure",
    blessure.nom + " : " + blessure.duree + " journée(s) d'absence."
  );

  return true;
}

function effectuerEntrainement(etat, choix) {
  const joueur = etat.joueur;
  let message = "";

  if (choix === "recuperation") {
    const recuperation = 12 + Math.floor(Math.random() * 9);

    joueur.fatigue = limiter(
      joueur.fatigue - recuperation,
      0,
      100
    );

    joueur.forme = limiter(joueur.forme + 5, 0, 100);

    message =
      "Bonne récupération : -" +
      recuperation +
      " en fatigue.";
  } else {
    joueur.fatigue = limiter(joueur.fatigue + 8, 0, 100);

    const tirage = Math.random();

    if (tirage < 0.15) {
      joueur.forme = limiter(joueur.forme - 5, 0, 100);
      joueur.confiance = limiter(joueur.confiance - 2, 0, 100);
      message = "Mauvais entraînement : aucune progression.";
    } else if (tirage < 0.45) {
      joueur.forme = limiter(joueur.forme - 1, 0, 100);
      message = "Séance moyenne : aucun progrès notable.";
    } else {
      const progression = 1 + Math.floor(Math.random() * 3);

      joueur[choix] += progression;
      joueur.forme = limiter(joueur.forme + 3, 0, 100);
      joueur.confiance = limiter(joueur.confiance + 1, 0, 100);

      message =
        "Très bonne séance : +" +
        progression +
        " en " +
        choix +
        ".";
    }

    if (provoquerBlessure(etat, "entrainement")) {
      message +=
        " Blessure : " +
        joueur.nomBlessure +
        ".";
      return message;
    }
  }

  genererInteractionCoach(etat);

  etat.saison.phase = "match";
  etat.saison.dernierEntrainement = message;

  ajouterJournal(
    etat,
    "Entraînement - journée " + etat.saison.journee,
    message
  );

  return message;
}
