from flask import Flask, render_template


app = Flask(__name__)

@app.route("/")
def intro():
    return render_template("intro.html")

@app.route("/home")
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

@app.route("/lessons/git-github")
def git_github():
    return render_template("git_github.html")

@app.route("/lessons/cicd")
def cicd():
    return render_template("cicd.html")

@app.route("/student-dashboard")
def student_dashboard():
    return render_template("student_dashboard.html")



if __name__ == "__main__":
    app.run(debug=True)