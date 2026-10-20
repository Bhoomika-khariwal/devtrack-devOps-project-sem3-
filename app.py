

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():

    return render_template("home.html")


@app.route("/lessons")
def lessons():
    return render_template("lessons.html")

@app.route("/lessons/devops-basics")
def devops_basics():
    return render_template("devops_basics.html")


if __name__ == "__main__":
    app.run(debug=True)


   


