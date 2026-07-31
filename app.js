
function simulerMatchSansJoueur(motif) {
  const rencontre = matchDuJoueur(etat);

  if (!rencontre) {
    alert("Aucun match programmé.");
    return;
  }

  const butsDomicile = Math.floor(Math.random() * 4);
  const butsExterieur = Math.floor(Math.random() * 4);

  enregistrerResultat(
    etat,
    rencontre.domicile,
    rencontre.exterieur,
    butsDomicile,
    butsExterieur
  );

  simulerAutresMatchs(etat);

  etat.saison.dernierMatchAbsent = {
    domicile: rencontre.domicile,
    exterieur: rencontre.exterieur,
    butsDomicile,
    butsExterieur
  };

  etat.saison.motifAbsence = motif;
  etat.saison.phase = "matchAbsent";

  ajouterJournal(
    etat,
    "Match sans le joueur",
    rencontre.domicile +
      " " +
      butsDomicile +
      " - " +
      butsExterieur +
      " " +
      rencontre.exterieur +
      " | " +
      motif
  );

  sauvegarderEtAfficher();
}

document
  .getElementById("demanderRepos")
  .addEventListener("click", () => {
    if (demanderReposMatch(etat)) {
      simulerMatchSansJoueur(
        "Repos demandé en raison d'une forte fatigue"
      );
    }
  });

document
  .getElementById("jouerMalgreFatigue")
  .addEventListener("click", () => {
    etat.saison.choixReposEffectue = true;
    sauvegarderEtAfficher();
  });

document
  .getElementById("journeeSuivanteAbsent")
  .addEventListener("click", () => {
    etat.saison.journee++;
    etat.saison.phase =
      etat.joueur.semainesBlessure > 0
        ? "blessure"
        : "entrainement";

    etat.saison.demandeReposMatch = false;
    etat.saison.choixReposEffectue = false;
    etat.saison.dernierMatchAbsent = null;
    etat.saison.motifAbsence = "";

    sauvegarderEtAfficher();
  });


document.addEventListener("click", event => {
  const boutonSemaine = event.target.closest("[data-choix-semaine]");
  if (boutonSemaine) {
    traiterChoixSemaine(
      etat,
      Number(boutonSemaine.dataset.choixSemaine)
    );
    sauvegarderEtAfficher();
    return;
  }

  const boutonAvant = event.target.closest("[data-choix-avant]");
  if (boutonAvant) {
    traiterChoixAvantMatch(
      etat,
      Number(boutonAvant.dataset.choixAvant)
    );
    sauvegarderEtAfficher();
    return;
  }

  const boutonAction = event.target.closest("[data-choix-action]");
  if (boutonAction) {
    traiterActionMatch(
      etat,
      Number(boutonAction.dataset.choixAction)
    );
    sauvegarderEtAfficher();
  }
});

let etat = chargerSauvegarde();

if (!etat) {
  etat = creerEtatInitial();
  enregistrerSauvegarde(etat);
}

function sauvegarderEtAfficher() {
  enregistrerSauvegarde(etat);
  afficherInterface(etat);
}


document
  .getElementById("choixAllerEntrainement")
  .addEventListener("click", () => {
    traiterChoixEvenement(etat, true);
    sauvegarderEtAfficher();
  });

document
  .getElementById("choixNePasAllerEntrainement")
  .addEventListener("click", () => {
    traiterChoixEvenement(etat, false);
    sauvegarderEtAfficher();
  });

document
  .getElementById("validerEntrainement")
  .addEventListener("click", () => {
    const choix =
      document.getElementById("choixEntrainement").value;

    if (!choix) {
      alert("Choisis un entraînement.");
      return;
    }

    const message = effectuerEntrainement(etat, choix);

    document.getElementById("resultatEntrainement").textContent =
      message;

    sauvegarderEtAfficher();
  });

document
  .getElementById("jouerMatch")
  .addEventListener("click", () => {
    jouerMatchChampionnat(etat);
    sauvegarderEtAfficher();
  });

document
  .getElementById("journeeSuivante")
  .addEventListener("click", () => {
    etat.saison.journee++;
    etat.saison.dernierScore = null;
    etat.saison.dernierTexte = "";
    etat.saison.dernierEntrainement = "";
    etat.saison.evenementAvantEntrainement = null;
    etat.saison.decisionEntrainementPrise = false;
    etat.saison.interactionCoach = null;
    etat.saison.forceBanc = false;
    etat.saison.demandeReposMatch = false;
    etat.saison.choixReposEffectue = false;
    etat.saison.dernierMatchAbsent = null;
    etat.saison.motifAbsence = "";
    etat.saison.evenementSemaine = null;
    etat.saison.seniorEvent = null;
    etat.saison.choixSemaineFait = false;
    etat.saison.interactionAvantMatch = null;
    etat.saison.choixAvantMatchFait = false;
    etat.saison.actionMatch = null;
    etat.saison.choixActionMatchFait = false;
    etat.saison.bonusActionMatch = 0;
    etat.saison.butInteraction = 0;
    etat.saison.passeInteraction = 0;

    if (etat.joueur.matchsSuspendu > 0) {
      etat.joueur.matchsSuspendu--;
    }

    document.getElementById("choixEntrainement").value = "";
    document.getElementById("resultatEntrainement").textContent = "";

    etat.saison.phase =
      etat.joueur.semainesBlessure > 0
        ? "blessure"
        : "entrainement";

    sauvegarderEtAfficher();
  });

document
  .getElementById("passerJourneeBlessure")
  .addEventListener("click", () => {
    const rencontre = matchDuJoueur(etat);

    if (rencontre) {
      const butsDomicile = Math.floor(Math.random() * 4);
      const butsExterieur = Math.floor(Math.random() * 4);

      enregistrerResultat(
        etat,
        rencontre.domicile,
        rencontre.exterieur,
        butsDomicile,
        butsExterieur
      );

      simulerAutresMatchs(etat);

      etat.saison.dernierMatchAbsent = {
        domicile: rencontre.domicile,
        exterieur: rencontre.exterieur,
        butsDomicile,
        butsExterieur
      };

      etat.saison.motifAbsence =
        "Blessure : " + etat.joueur.nomBlessure;

      ajouterJournal(
        etat,
        "Match manqué sur blessure",
        rencontre.domicile +
          " " +
          butsDomicile +
          " - " +
          butsExterieur +
          " " +
          rencontre.exterieur
      );
    }

    etat.joueur.semainesBlessure--;

    etat.joueur.fatigue = limiter(
      etat.joueur.fatigue - 15,
      0,
      100
    );

    etat.joueur.forme = limiter(
      etat.joueur.forme + 2,
      0,
      100
    );

    if (etat.joueur.semainesBlessure <= 0) {
      etat.joueur.semainesBlessure = 0;
      etat.joueur.nomBlessure = "";
    }

    etat.saison.phase = "matchAbsent";
    sauvegarderEtAfficher();
  });

document
  .getElementById("nouvelleSaison")
  .addEventListener("click", () => {
    etat.joueur.age++;
    etat.saison.journee = 1;
    etat.saison.phase = "entrainement";
    etat.saison.dernierScore = null;
    etat.saison.dernierTexte = "";
    etat.saison.bilanCalcule = false;
    etat.saison.offreTransfert = null;
    etat.saison.selectionProposee = null;
    etat.saison.detectionPole = null;
    etat.saison.resultatTournoi = null;
    etat.saison.tournoiSpecial = null;
    etat.saison.evenementAvantEntrainement = null;
    etat.saison.decisionEntrainementPrise = false;
    etat.saison.interactionCoach = null;
    etat.saison.forceBanc = false;
    etat.saison.demandeReposMatch = false;
    etat.saison.choixReposEffectue = false;
    etat.saison.dernierMatchAbsent = null;
    etat.saison.motifAbsence = "";
    etat.saison.evenementSemaine = null;
    etat.saison.seniorEvent = null;
    etat.saison.choixSemaineFait = false;
    etat.saison.interactionAvantMatch = null;
    etat.saison.choixAvantMatchFait = false;
    etat.saison.actionMatch = null;
    etat.saison.choixActionMatchFait = false;
    etat.saison.bonusActionMatch = 0;
    etat.saison.butInteraction = 0;
    etat.saison.passeInteraction = 0;

    etat.joueur.fatigue = limiter(
      etat.joueur.fatigue - 30,
      0,
      100
    );

    etat.joueur.forme = limiter(
      etat.joueur.forme + 10,
      0,
      100
    );

    etat.championnat = creerChampionnat(
      etat.joueur.club,
      etat.joueur
    );

    ajouterJournal(
      etat,
      "Nouvelle saison",
      "Passage à " + etat.joueur.age + " ans."
    );

    sauvegarderEtAfficher();
  });


document
  .getElementById("accepterOffre")
  .addEventListener("click", () => {
    accepterTransfert(etat);
    sauvegarderEtAfficher();
  });

document
  .getElementById("refuserOffre")
  .addEventListener("click", () => {
    refuserTransfert(etat);
    sauvegarderEtAfficher();
  });

document
  .getElementById("accepterSelection")
  .addEventListener("click", () => {
    accepterSelection(etat);
    sauvegarderEtAfficher();
  });

document
  .getElementById("recommencer")
  .addEventListener("click", () => {
    if (!confirm("Supprimer définitivement cette carrière ?")) {
      return;
    }

    localStorage.clear();
    window.location.href = "index.html";
  });

activerOnglets();
sauvegarderEtAfficher();
