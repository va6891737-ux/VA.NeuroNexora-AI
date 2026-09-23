from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os
import re


# ==========================================
# NEURONEXORA AI - BACKEND SETUP
# ==========================================

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/")
def home():
    return "NeuroNexora AI Backend is Running!"


# ==========================================
# AI CHAT
# ==========================================

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({
            "error": "Message is required"
        }), 400

    try:

        response = client.responses.create(

            model="gpt-4o-mini",

            instructions="""
You are NeuroNexora AI, a human-centric intelligent
decision-support assistant.

Help users understand decisions, compare options,
and make informed choices.

Consider the user's:

- Goals
- Education
- Skills
- Interests
- Preferences
- Time
- Budget
- Constraints

When comparing options:

- Clearly list the options
- Explain advantages and limitations
- Explain important trade-offs
- Explain why each option may fit
- Give practical next steps

Be clear, practical and beginner-friendly.

Do not make the final decision for the user.
Provide neutral decision-support information.
""",

            input=user_message
        )

        return jsonify({
            "reply": response.output_text
        })

    except Exception as error:

        print("Chat Error:", error)

        return jsonify({
            "error": "AI service error",
            "details": str(error)
        }), 500


# ==========================================
# NEURONEXORA AI - CAREER SCORING ENGINE
# ==========================================

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    # ------------------------------------------
    # Get user profile
    # ------------------------------------------

    education = data.get("education", "")
    career_goal = data.get("careerGoal", "")
    skills = data.get("skills", "")
    time_available = data.get("timeAvailable", "")
    budget = data.get("budget", "")

    skills_text = skills.lower()
    goal_text = career_goal.lower()

    # ------------------------------------------
    # Initial scores
    # ------------------------------------------

    scores = {
        "Software Engineering": 50,
        "Data Analytics": 50,
        "Web Development": 50
    }

    # ------------------------------------------
    # Career goal matching
    # ------------------------------------------

    if "software" in goal_text:

        scores["Software Engineering"] += 25

    if "data" in goal_text or "analytics" in goal_text:

        scores["Data Analytics"] += 25

    if "web" in goal_text:

        scores["Web Development"] += 25

    # ------------------------------------------
    # Skill matching
    # ------------------------------------------

    if any(
        skill in skills_text
        for skill in [
            "python",
            "java",
            "c++",
            "programming"
        ]
    ):

        scores["Software Engineering"] += 15

    if any(
        skill in skills_text
        for skill in [
            "sql",
            "excel",
            "tableau",
            "power bi",
            "python"
        ]
    ):

        scores["Data Analytics"] += 15

    if any(
        skill in skills_text
        for skill in [
            "html",
            "css",
            "javascript",
            "react"
        ]
    ):

        scores["Web Development"] += 15

    # ------------------------------------------
    # Learning time factor
    # ------------------------------------------

    numbers = re.findall(
        r'\d+',
        time_available
    )

    if numbers:

        hours = int(numbers[0])

        if hours >= 10:

            for option in scores:

                scores[option] += 5

    # ------------------------------------------
    # Keep scores between 0 and 100
    # ------------------------------------------

    for option in scores:

        scores[option] = min(
            100,
            max(0, scores[option])
        )

    # ------------------------------------------
    # Prepare result
    # ------------------------------------------

    result = []

    for option, score in scores.items():

        result.append({

            "option": option,

            "score": score

        })

    # ------------------------------------------
    # Send response to frontend
    # ------------------------------------------

    return jsonify({

        "profile": {

            "education": education,

            "careerGoal": career_goal,

            "skills": skills,

            "timeAvailable": time_available,

            "budget": budget
        },

        "scores": result,

        "note":
        "AI-assisted indicative compatibility scores "
        "based on the provided profile."

    })


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )