function accepterTransfert(etat) {
  const offre = etat.saison.offreTransfert;

  if (!offre) {
    return;
  }

  const ancienClub = etat.joueur.club;
  etat.joueur.club = offre.nom;

  ajouterJournal(
    etat,
    "Transfert accepté",
    "Départ de " + ancienClub + " vers " + offre.nom + "."
  );

  etat.saison.offreTransfert = null;
  etat.championnat = creerChampionnat(etat.joueur.club);
}

function refuserTransfert(etat) {
  const offre = etat.saison.offreTransfert;

  if (!offre) {
    return;
  }

  ajouterJournal(
    etat,
    "Transfert refusé",
    "Le joueur choisit de rester au " + etat.joueur.club + "."
  );

  etat.saison.offreTransfert = null;
}

function accepterSelection(etat) {
  const selection = etat.saison.selectionProposee;

  if (!selection) {
    return;
  }

  etat.joueur.selection = selection;

  ajouterJournal(
    etat,
    "Sélection",
    "Convocation avec " + selection + "."
  );

  etat.saison.selectionProposee = null;
}
