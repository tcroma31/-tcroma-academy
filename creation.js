document.addEventListener("DOMContentLoaded", () => {
  const departement = document.getElementById("departement");
  const club = document.getElementById("club");
  const bouton = document.getElementById("commencer");

  departement.addEventListener("change", () => {
    const numero = departement.value;
    club.innerHTML = "";

    if (!numero) {
      club.innerHTML = '<option value="">Choisir d’abord un département</option>';
      return;
    }

    club.innerHTML = '<option value="">Choisir un club</option>';

    CLUBS_PAR_DEPARTEMENT[numero].forEach(nomClub => {
      const option = document.createElement("option");
      option.value = nomClub;
      option.textContent = nomClub;
      club.appendChild(option);
    });
  });

  bouton.addEventListener("click", () => {
    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const poste = document.getElementById("poste").value;
    const numeroDepartement = departement.value;
    const nomClub = club.value;

    if (!prenom || !nom || !poste || !numeroDepartement || !nomClub) {
      alert("Merci de compléter toutes les informations.");
      return;
    }

    localStorage.clear();

    localStorage.setItem("prenom", prenom);
    localStorage.setItem("nom", nom);
    localStorage.setItem("poste", poste);
    localStorage.setItem("departement", numeroDepartement);
    localStorage.setItem("club", nomClub);

    window.location.href = "carriere.html";
  });
});
