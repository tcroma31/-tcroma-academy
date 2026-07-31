function htmlClassement(etat) {
  const ordre = classementTrie(etat);

  return `
    <table>
      <thead>
        <tr>
          <th>Club</th>
          <th>J</th>
          <th>Pts</th>
          <th>Diff.</th>
        </tr>
      </thead>
      <tbody>
        ${ordre.map((equipe, index) => `
          <tr class="${equipe.nom === etat.joueur.club ? "mon-club" : ""}">
            <td>${index + 1}. ${equipe.nom}</td>
            <td>${equipe.joues}</td>
            <td>${equipe.points}</td>
            <td>${equipe.butsPour - equipe.butsContre}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function ligneStat(nom, valeur) {
  return `
    <div class="ligne-stat">
      <span>${nom}</span>
      <div class="barre">
        <span style="width:${Math.min(100, valeur)}%"></span>
      </div>
      <strong>${valeur}</strong>
    </div>
  `;
}

function afficherInterface(etat) {
  const joueur = etat.joueur;
  const saison = etat.saison;

  document.getElementById("joueur").textContent =
    joueur.prenom + " " + joueur.nom;

  document.getElementById("resumeJoueur").textContent =
    joueur.poste + " • " + joueur.club;

  document.getElementById("age").textContent =
    joueur.age + " ans";

  document.getElementById("journee").textContent =
    saison.journee <= 18
      ? "Journée " + saison.journee + "/18"
      : "Saison terminée";

  document.getElementById("etatJoueur").innerHTML =
    ligneStat("Fatigue", joueur.fatigue) +
    ligneStat("Forme", joueur.forme) +
    ligneStat("Confiance", joueur.confiance) +
    "<p> Blessure : " +
    (
      joueur.semainesBlessure > 0
        ? joueur.nomBlessure +
          " — " +
          joueur.semainesBlessure +
          " journée(s)"
        : "aucune"
    ) +
    "</p>";

  document.getElementById("qualitesJoueur").innerHTML =
    ligneStat("Technique", joueur.technique) +
    ligneStat("Vitesse", joueur.vitesse) +
    ligneStat("Physique", joueur.physique) +
    ligneStat("Mental", joueur.mental);

  let statistiquesHtml =
    "<p>Matchs : <strong>" +
    joueur.matchs +
    "</strong></p>" +
    "<p>Hommes du match : <strong>" +
    joueur.hommesDuMatch +
    "</strong></p>" +
    "<p>Note moyenne : <strong>" +
    noteMoyenne(joueur).toFixed(1) +
    "</strong></p>" +
    "<p>Réputation : <strong>" +
    joueur.reputation +
    "/100</strong></p>";

  if (estGardien(joueur)) {
    statistiquesHtml +=
      "<p>Arrêts : <strong>" +
      joueur.arrets +
      "</strong></p>" +
      "<p>Clean sheets : <strong>" +
      joueur.cleanSheets +
      "</strong></p>" +
      "<p>Penalties arrêtés : <strong>" +
      joueur.penaltiesArretes +
      "</strong></p>" +
      "<p>Buts encaissés : <strong>" +
      joueur.butsEncaisses +
      "</strong></p>";
  } else {
    statistiquesHtml +=
      "<p>Buts : <strong>" +
      joueur.buts +
      "</strong></p>" +
      "<p>Passes décisives : <strong>" +
      joueur.passes +
      "</strong></p>";
  }

  document.getElementById("statsCarriere").innerHTML =
    statistiquesHtml;

  document.getElementById("avenirJoueur").innerHTML =
    ligneStat("Réputation", joueur.reputation) +
    ligneStat("Potentiel", joueur.potentiel) +
    "<p>Club actuel : <strong>" +
    joueur.club +
    "</strong></p>" +
    "<p>Niveau : <strong>" +
    (joueur.niveauChampionnat || etat.championnat.niveau || "Régional jeunes") +
    "</strong></p>" +
    "<p>Sélection : <strong>" +
    joueur.selection +
    "</strong></p>";

  document.getElementById("journalCarriere").innerHTML =
    saison.journal.map(entree => `
      <div class="entree-journal">
        <strong>${entree.titre}</strong>
        <div class="muted">${entree.texte}</div>
      </div>
    `).join("");

  afficherPhase(etat);
}

function cacherBlocs() {
  [
    "blocBlessure",
    "blocEvenementSemaine",
    "blocChoixEntrainement",
    "blocEntrainement",
    "blocAvantMatch",
    "blocActionMatch",
    "blocRepos",
    "blocMatchAbsent",
    "blocMatch",
    "blocResultat",
    "blocFinSaison"
  ].forEach(id => {
    document.getElementById(id).classList.add("cache");
  });
}

function afficherPhase(etat) {
  cacherBlocs();

  const joueur = etat.joueur;
  const saison = etat.saison;

  if (saison.journee > 18) {
    document.getElementById("blocFinSaison").classList.remove("cache");

    const place = positionClub(etat);

    document.getElementById("bilanSaison").innerHTML =
      "<strong>" +
      joueur.club +
      " termine " +
      place +
      "e sur 10.</strong><br><br>" +
      "Matchs personnels : " +
      joueur.matchs +
      "<br>Buts : " +
      joueur.buts +
      "<br>Passes : " +
      joueur.passes +
      "<br>Note moyenne : " +
      noteMoyenne(joueur).toFixed(1);

    document.getElementById("classementFinal").innerHTML =
      htmlClassement(etat);

    const blocOffre = document.getElementById("blocOffre");
    const blocSelection = document.getElementById("blocSelection");

    blocOffre.classList.add("cache");
    blocSelection.classList.add("cache");

    const complements = [];

    if (saison.tournoiSpecial) {
      let texteTournoi =
        "<strong>" +
        saison.tournoiSpecial.nom +
        "</strong><br>" +
        saison.tournoiSpecial.resultat +
        " Réputation : +" +
        saison.tournoiSpecial.gainReputation +
        ".";

      if (saison.tournoiSpecial.recruteur) {
        texteTournoi +=
          "<br>Un recruteur de " +
          saison.tournoiSpecial.recruteur +
          " souhaite te suivre.";
      }

      complements.push(texteTournoi);
    }

    if (saison.resultatTournoi) {
      complements.push(
        "<strong>" +
        saison.resultatTournoi.nom +
        "</strong><br>" +
        saison.resultatTournoi.resultat +
        " Réputation : +" +
        saison.resultatTournoi.gainReputation +
        "."
      );
    }

    if (saison.detectionPole) {
      complements.push(
        "<strong>Détection au Pôle Espoirs de Castelmaurou</strong><br>" +
        saison.detectionPole.message +
        "<br>Évaluation de la journée : " +
        saison.detectionPole.performance +
        "/100."
      );
    }

    if (complements.length > 0) {
      document.getElementById("bilanSaison").innerHTML +=
        "<br><br>" + complements.join("<br><br>");
    }

    if (saison.selectionProposee) {
      blocSelection.classList.remove("cache");
      document.getElementById("texteSelection").textContent =
        "Tu es convoqué avec " + saison.selectionProposee + ".";
    }

    if (saison.offreTransfert) {
      blocOffre.classList.remove("cache");
      document.getElementById("texteOffre").textContent =
        saison.offreTransfert.message +
        " Niveau du projet : " +
        saison.offreTransfert.type +
        ".";
    }

    return;
  }

  if (joueur.semainesBlessure > 0) {
    document.getElementById("blocBlessure").classList.remove("cache");

    document.getElementById("messageBlessure").textContent =
      "Tu souffres de " +
      joueur.nomBlessure +
      ". Il reste " +
      joueur.semainesBlessure +
      " journée(s) d'indisponibilité.";

    return;
  }

  if (saison.phase === "entrainement") {
    const evtSemaine = genererEvenementSemaine(etat);

    if (evtSemaine && !saison.choixSemaineFait) {
      document.getElementById("blocEvenementSemaine").classList.remove("cache");
      document.getElementById("titreEvenementSemaine").textContent =
        evtSemaine.titre;
      document.getElementById("texteEvenementSemaine").textContent =
        evtSemaine.texte;

      document.getElementById("choixEvenementSemaine").innerHTML =
        evtSemaine.choix.map((choix, index) =>
          '<button data-choix-semaine="' + index + '">' +
          choix.texte +
          '</button>'
        ).join("");

      return;
    }

    const evenement = genererEvenementAvantEntrainement(etat);

    if (evenement && !saison.decisionEntrainementPrise) {
      document
        .getElementById("blocChoixEntrainement")
        .classList.remove("cache");

      document.getElementById("titreEvenementEntrainement").textContent =
        evenement.titre;

      document.getElementById("texteEvenementEntrainement").textContent =
        evenement.texte;

      document.getElementById("choixAllerEntrainement").textContent =
        evenement.choixA;

      document.getElementById("choixNePasAllerEntrainement").textContent =
        evenement.choixB;
    } else {
      document.getElementById("blocEntrainement").classList.remove("cache");
    }
  }

  if (saison.phase === "matchAbsent") {
    document.getElementById("blocMatchAbsent").classList.remove("cache");

    const absence = saison.dernierMatchAbsent;

    document.getElementById("scoreMatchAbsent").textContent =
      absence.domicile +
      " " +
      absence.butsDomicile +
      " - " +
      absence.butsExterieur +
      " " +
      absence.exterieur;

    document.getElementById("texteMatchAbsent").textContent =
      "Tu étais absent : " + saison.motifAbsence + ".";

    document.getElementById("classementMatchAbsent").innerHTML =
      htmlClassement(etat);

    return;
  }

  if (saison.phase === "match") {
    if (
      joueur.fatigue >= 70 &&
      !saison.demandeReposMatch &&
      !saison.choixReposEffectue
    ) {
      document.getElementById("blocRepos").classList.remove("cache");
      return;
    }

    const interaction = genererInteractionAvantMatch(etat);

    if (interaction && !saison.choixAvantMatchFait) {
      document.getElementById("blocAvantMatch").classList.remove("cache");
      document.getElementById("titreAvantMatch").textContent =
        interaction.titre;
      document.getElementById("texteAvantMatch").textContent =
        interaction.texte;

      document.getElementById("choixAvantMatch").innerHTML =
        interaction.choix.map((choix, index) =>
          '<button data-choix-avant="' + index + '">' +
          choix.texte +
          '</button>'
        ).join("");

      return;
    }

    if (!saison.actionMatch) {
      genererActionMatch(etat);
    }

    if (!saison.choixActionMatchFait) {
      const action = saison.actionMatch;

      document.getElementById("blocActionMatch").classList.remove("cache");
      document.getElementById("minuteActionMatch").textContent =
        action.minute;
      document.getElementById("texteActionMatch").textContent =
        action.texte;

      document.getElementById("choixActionMatch").innerHTML =
        action.choix.map((choix, index) =>
          '<button data-choix-action="' + index + '">' +
          choix.texte +
          '</button>'
        ).join("");

      return;
    }

    document.getElementById("blocMatch").classList.remove("cache");

    const rencontre = matchDuJoueur(etat);

    document.getElementById("afficheMatch").textContent =
      rencontre.domicile +
      " contre " +
      rencontre.exterieur;

    document.getElementById("messageAvantMatch").textContent =
      joueur.fatigue >= 70
        ? "Tu es très fatigué. Une place sur le banc est possible."
        : "L'entraîneur prépare sa composition.";
  }

  if (saison.phase === "resultat") {
    document.getElementById("blocResultat").classList.remove("cache");

    const score = saison.dernierScore;

    document.getElementById("scoreMatch").textContent =
      score.domicile +
      " " +
      score.butsDomicile +
      " - " +
      score.butsExterieur +
      " " +
      score.exterieur;

    document.getElementById("texteResultat").innerHTML =
      saison.dernierTexte;

    document.getElementById("classementApresMatch").innerHTML =
      htmlClassement(etat);
  }
}

function activerOnglets() {
  document.querySelectorAll(".onglet").forEach(bouton => {
    bouton.addEventListener("click", () => {
      document.querySelectorAll(".onglet").forEach(item => {
        item.classList.remove("actif");
      });

      document.querySelectorAll(".contenu-onglet").forEach(section => {
        section.classList.add("cache");
      });

      bouton.classList.add("actif");

      document
        .getElementById("onglet-" + bouton.dataset.onglet)
        .classList.remove("cache");
    });
  });
}
