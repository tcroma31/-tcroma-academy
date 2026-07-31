function creerChampionnat(clubJoueur, joueur = null) {
  let clubs;

  if (joueur && joueur.auPoleCastelmaurou) {
    clubs = [...CLUBS_CHAMPIONNAT_NATIONAL_JEUNES];

    if (!clubs.includes(clubJoueur)) {
      clubs[0] = clubJoueur;
    }
  } else {
    clubs = [clubJoueur];

    for (const club of CLUBS_CHAMPIONNAT) {
      if (!clubs.includes(club) && clubs.length < 10) {
        clubs.push(club);
      }
    }

    let numero = 1;

    while (clubs.length < 10) {
      clubs.push("Club régional " + numero);
      numero++;
    }
  }

  return {
    niveau:
      joueur && joueur.auPoleCastelmaurou
        ? "National jeunes"
        : "Régional jeunes",
    clubs,
    classement: clubs.map(nom => ({
      nom,
      joues: 0,
      victoires: 0,
      nuls: 0,
      defaites: 0,
      butsPour: 0,
      butsContre: 0,
      points: 0
    })),
    calendrier: creerCalendrier(clubs)
  };
}

function creerCalendrier(clubs) {
  const liste = [...clubs];
  const aller = [];
  let rotation = [...liste];

  for (let tour = 0; tour < liste.length - 1; tour++) {
    const matchs = [];

    for (let i = 0; i < liste.length / 2; i++) {
      const a = rotation[i];
      const b = rotation[liste.length - 1 - i];

      matchs.push(
        tour % 2 === 0
          ? { domicile: a, exterieur: b }
          : { domicile: b, exterieur: a }
      );
    }

    aller.push(matchs);

    rotation = [
      rotation[0],
      rotation[rotation.length - 1],
      ...rotation.slice(1, rotation.length - 1)
    ];
  }

  const retour = aller.map(journee =>
    journee.map(match => ({
      domicile: match.exterieur,
      exterieur: match.domicile
    }))
  );

  return [...aller, ...retour];
}

function matchDuJoueur(etat) {
  const journee = etat.saison.journee;
  const calendrier = etat.championnat.calendrier[journee - 1] || [];

  return calendrier.find(match =>
    match.domicile === etat.joueur.club ||
    match.exterieur === etat.joueur.club
  );
}

function mettreAJourEquipe(etat, nom, pour, contre) {
  const equipe = etat.championnat.classement.find(item => item.nom === nom);

  equipe.joues++;
  equipe.butsPour += pour;
  equipe.butsContre += contre;

  if (pour > contre) {
    equipe.victoires++;
    equipe.points += 3;
  } else if (pour === contre) {
    equipe.nuls++;
    equipe.points++;
  } else {
    equipe.defaites++;
  }
}

function enregistrerResultat(etat, domicile, exterieur, butsDom, butsExt) {
  mettreAJourEquipe(etat, domicile, butsDom, butsExt);
  mettreAJourEquipe(etat, exterieur, butsExt, butsDom);
}

function simulerAutresMatchs(etat) {
  const rencontres =
    etat.championnat.calendrier[etat.saison.journee - 1] || [];

  rencontres.forEach(match => {
    if (
      match.domicile === etat.joueur.club ||
      match.exterieur === etat.joueur.club
    ) {
      return;
    }

    const butsDom = Math.floor(Math.random() * 4);
    const butsExt = Math.floor(Math.random() * 4);

    enregistrerResultat(
      etat,
      match.domicile,
      match.exterieur,
      butsDom,
      butsExt
    );
  });
}

function classementTrie(etat) {
  return [...etat.championnat.classement].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    const diffA = a.butsPour - a.butsContre;
    const diffB = b.butsPour - b.butsContre;

    if (diffB !== diffA) {
      return diffB - diffA;
    }

    return b.butsPour - a.butsPour;
  });
}

function positionClub(etat) {
  return (
    classementTrie(etat).findIndex(
      equipe => equipe.nom === etat.joueur.club
    ) + 1
  );
}
