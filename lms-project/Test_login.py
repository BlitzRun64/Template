import urllib3
"""
Test visuel de la page de connexion, indépendant du reste de BornISLog.
 
Arborescence attendue :
    test_login.py
    templates/login.html
    static/login.css
    static/login.js
    static/images/LogoOmexom.jpg   (facultatif : une image cassée n'empêche pas le test)
 
Lancement :
    pip install flask
    python test_login.py
Puis ouvrir http://127.0.0.1:5001/login
 
Identifiants de test : test / test  (tout autre couple affiche l'erreur)
"""
 
from flask import Flask, render_template, request
 
app = Flask(__name__)
 
 
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if request.form.get("username") == "test" and request.form.get("password") == "test":
            return "<h1>Connexion réussie (test)</h1><p><a href='/login'>Retour</a></p>"
        return render_template("login.html", erreur="Identifiants incorrects."), 401
 
    # Pour voir l'état d'erreur sans se tromper : http://127.0.0.1:5001/login?erreur=1
    erreur = "Identifiants incorrects." if request.args.get("erreur") else None
    return render_template("login.html", erreur=erreur)
 
 
if __name__ == "__main__":
    app.run(port=5001, debug=True)
