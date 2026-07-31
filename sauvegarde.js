const CLE_SAUVEGARDE = "tcromaAcademyV1";

function chargerSauvegarde() {
  const brute = localStorage.getItem(CLE_SAUVEGARDE);

  if (!brute) {
    return null;
  }

  try {
    return JSON.parse(brute);
  } catch (erreur) {
    console.error("Sauvegarde illisible", erreur);
    return null;
  }
}

function enregistrerSauvegarde(etat) {
  localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(etat));
}
