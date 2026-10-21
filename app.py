from flask import Flask, render_template


app = Flask(__name__)


@app.get("/")
def home():
    return render_template("home.html")


@app.get("/lessons")
def lessons():
    return render_template("lessons.html")

@app.route("/lessons/devops-basics")
def devops_basics():
    return render_template("devops_basics.html")

@app.route("/lessons/scm-basics")
def scm_basics():
    return render_template("scm_basics.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


if __name__ == "__main__":
    app.run(debug=True)