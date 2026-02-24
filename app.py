from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# ===============================
# CONFIGURATION
# ===============================

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "retinalcare_secret_key"

db = SQLAlchemy(app)

# ===============================
# DATABASE MODEL
# ===============================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    level = db.Column(db.String(50))
    risk_score = db.Column(db.String(10))
    date = db.Column(db.String(50))

with app.app_context():
    db.create_all()

# ===============================
# HOME PAGE
# ===============================

@app.route("/")
def home():
    return render_template("home.html")

# ===============================
# REGISTER
# ===============================

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return "Email already registered!"

        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for("login"))

    return render_template("register.html")

# ===============================
# LOGIN
# ===============================

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email).first()

        if user and user.password == password:
            session["user_id"] = user.id
            session["user_name"] = user.name
            return redirect(url_for("dashboard"))
        else:
            return "Invalid email or password!"

    return render_template("login.html")

@app.route("/check_users")
def check_users():
    users = User.query.all()
    output = ""
    for u in users:
        output += f"ID: {u.id}, Email: {u.email}, Password: {u.password}<br>"
    return output

# ===============================
# DASHBOARD (PROTECTED)
# ===============================

@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("login"))

    return render_template("index.html", username=session["user_name"])

@app.route("/upload", methods=["GET", "POST"])
def upload():
    if "user_id" not in session:
        return redirect(url_for("login"))

    if request.method == "POST":

        # Temporary fake prediction
        new_prediction = Prediction(
            user_id=session["user_id"],
            level="Level 1 - Mild",
            risk_score="45%",
            date="15 March 2026"
        )

        db.session.add(new_prediction)
        db.session.commit()

        return redirect(url_for("history"))

    return render_template("upload.html")


@app.route("/history")
def history():
    if "user_id" not in session:
        return redirect(url_for("login"))

    predictions = Prediction.query.filter_by(
        user_id=session["user_id"]
    ).all()

    return render_template("history.html", predictions=predictions)


@app.route("/reports")
def reports():
    if "user_id" not in session:
        return redirect(url_for("login"))
    return render_template("reports.html")


@app.route("/doctor")
def doctor():
    if "user_id" not in session:
        return redirect(url_for("login"))
    return render_template("doctor.html")

# ===============================
# LOGOUT
# ===============================

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))

# ===============================
# CREATE TABLES (Run Once)
# ===============================

@app.route("/create")
def create():
    db.create_all()
    return "Database tables created successfully!"

# ===============================
# RUN APP
# ===============================

if __name__ == "__main__":
    app.run()