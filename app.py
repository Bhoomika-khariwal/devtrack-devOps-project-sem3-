from flask import Flask, render_template


app = Flask(__name__)


@app.get("/")
def home():
    return render_template("home.html")


@app.get("/lessons")
def lessons():
    return render_template("lessons.html")


if __name__ == "__main__":
    app.run(debug=True)