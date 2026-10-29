/* =====================================================
   BornISLog - login.js
   Chargé en bas de login.html : les éléments existent déjà.
   ===================================================== */

(function () {
    "use strict";

    const formulaire   = document.getElementById("login-form");
    const champNom     = document.getElementById("username");
    const champMdp     = document.getElementById("password");
    const boutonOeil   = document.getElementById("mdp-toggle");
    const boutonEnvoi  = document.getElementById("btn-connexion");
    const texteBouton  = boutonEnvoi.querySelector(".btn-texte");
    const messageErreur = document.getElementById("login-erreur");
    const avertissementMaj = document.getElementById("maj-avertissement");

    const TEXTE_NORMAL = texteBouton.textContent;


    /* -------------------------------------------------
       1. Afficher / masquer le mot de passe
       ------------------------------------------------- */
    boutonOeil.addEventListener("click", function () {
        const visible = champMdp.type === "text";
        champMdp.type = visible ? "password" : "text";
        boutonOeil.setAttribute("aria-pressed", String(!visible));
        boutonOeil.setAttribute(
            "aria-label",
            visible ? "Afficher le mot de passe" : "Masquer le mot de passe"
        );
        champMdp.focus();
    });


    /* -------------------------------------------------
       2. Avertissement "Verrouillage majuscules"
       ------------------------------------------------- */
    function verifierMajuscules(evenement) {
        if (typeof evenement.getModifierState !== "function") return;
        avertissementMaj.hidden = !evenement.getModifierState("CapsLock");
    }

    champMdp.addEventListener("keydown", verifierMajuscules);
    champMdp.addEventListener("keyup", verifierMajuscules);
    champMdp.addEventListener("blur", function () {
        avertissementMaj.hidden = true;
    });


    /* -------------------------------------------------
       3. Message d'erreur
       ------------------------------------------------- */
    function afficherErreur(texte) {
        messageErreur.textContent = texte;
        messageErreur.hidden = false;
    }

    function masquerErreur() {
        messageErreur.hidden = true;
        messageErreur.textContent = "";
    }

    // Dès que l'utilisateur retape, on retire le rouge du champ
    [champNom, champMdp].forEach(function (champ) {
        champ.addEventListener("input", function () {
            champ.classList.remove("invalide");
        });
    });


    /* -------------------------------------------------
       4. Bouton : état "chargement" (évite le double envoi)
       ------------------------------------------------- */
    function bloquerBouton() {
        boutonEnvoi.disabled = true;
        boutonEnvoi.classList.add("chargement");
        texteBouton.textContent = "Connexion…";
    }

    function debloquerBouton() {
        boutonEnvoi.disabled = false;
        boutonEnvoi.classList.remove("chargement");
        texteBouton.textContent = TEXTE_NORMAL;
    }

    // Si l'utilisateur revient en arrière (cache du navigateur), on réinitialise
    window.addEventListener("pageshow", debloquerBouton);


    /* -------------------------------------------------
       5. Validation avant envoi
       ------------------------------------------------- */
    formulaire.addEventListener("submit", function (evenement) {
        masquerErreur();

        const nomVide = champNom.value.trim() === "";
        const mdpVide = champMdp.value === "";

        champNom.classList.toggle("invalide", nomVide);
        champMdp.classList.toggle("invalide", mdpVide);

        if (nomVide || mdpVide) {
            evenement.preventDefault();
            afficherErreur("Renseignez votre nom d'utilisateur et votre mot de passe.");
            (nomVide ? champNom : champMdp).focus();
            return;
        }

        bloquerBouton();   // le formulaire part normalement (POST /login)
    });


    /* -------------------------------------------------
       6. Erreur renvoyée par le serveur : on remet le focus
       ------------------------------------------------- */
    if (!messageErreur.hidden) {
        champMdp.value = "";
        champMdp.focus();
    }
})();