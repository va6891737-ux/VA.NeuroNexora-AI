// ==========================================
// NEURONEXORA AI - CHAT FUNCTION
// ==========================================

// ------------------------------------------
// ⚙️ BACKEND URL CONFIG
// Backend deploy panna apram, keela iruka
// "http://127.0.0.1:5000" ah unga deployed
// URL kooda replace pannunga. Example:
// const API_BASE = "https://neuronexora-backend.onrender.com";
// ------------------------------------------
const API_BASE = "https://neuronexora-ai-a62m.onrender.com";

async function sendMessage() {

    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user-message");
    input.value = "";

    addMessage(
        `<div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>`,
        "ai-message"
    );

    const savedProfile =
        localStorage.getItem("neuroNexoraProfile");

    let profile = {};

    if (savedProfile) {
        try {
            profile = JSON.parse(savedProfile);
        } catch (error) {
            console.error("Profile JSON Error:", error);
        }
    }

    const personalizedMessage = `
You are NeuroNexora AI, a human-centric intelligent decision-support assistant.

Name: ${profile.name || "Not provided"}
Education: ${profile.education || "Not provided"}
Career Goal: ${profile.careerGoal || "Not provided"}
Skills: ${profile.skills || "Not provided"}
Available Learning Time: ${profile.timeAvailable || "Not provided"}
Budget: ${profile.budget || "Not provided"}

User Question:
${message}

Provide clear and practical decision-support information.
Compare options when appropriate.
Explain advantages, limitations and trade-offs.
Do not make the final decision for the user.
`;

    try {

        const response = await fetch(`${API_BASE}/chat`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: personalizedMessage
            })
        });

        // Remove typing message
        const chatArea =
            document.getElementById("chatArea");

        if (chatArea.lastElementChild) {
            chatArea.lastElementChild.remove();
        }

        // Check server response
        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "Backend Error:",
                response.status,
                errorText
            );

            addMessage(
                `⚠️ AI server error: ${response.status}<br>
                 Please check your backend /chat route.`,
                "ai-message"
            );

            return;
        }

        const data = await response.json();

        if (data.reply) {

            addMessage(
                "🧠 " + data.reply,
                "ai-message"
            );

            localStorage.setItem(
                "neuroNexoraLastReply",
                data.reply
            );

        } else {

            addMessage(
                "⚠️ Backend connected, but no AI reply was received.",
                "ai-message"
            );
        }

    } catch (error) {

        const chatArea =
            document.getElementById("chatArea");

        if (chatArea.lastElementChild) {
            chatArea.lastElementChild.remove();
        }

        addMessage(
            "⚠️ Cannot connect to NeuroNexora AI backend.",
            "ai-message"
        );

        console.error("CHAT ERROR:", error);
    }
}


// ==========================================
// ADD MESSAGE TO CHAT
// ==========================================

function addMessage(text, type) {

    const chatArea =
        document.getElementById("chatArea");

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message " + type;

    messageDiv.innerHTML = text;

    chatArea.appendChild(messageDiv);

    chatArea.scrollTop =
        chatArea.scrollHeight;
}

// ==========================================
// SAVE USER PROFILE
// ==========================================

function saveProfile() {

    const profile = {

        name: document.getElementById("userName").value,

        education: document.getElementById("education").value,

        careerGoal: document.getElementById("careerGoal").value,

        skills: document.getElementById("skills").value,

        timeAvailable: document.getElementById("timeAvailable").value,

        budget: document.getElementById("budget").value
    };


    // Save profile in browser
    localStorage.setItem(
        "neuroNexoraProfile",
        JSON.stringify(profile)
    );

document.getElementById("userInput").value = "";
    alert("✅ Profile saved successfully!");
}
function analyzeDecision() {

    const savedProfile = localStorage.getItem("neuroNexoraProfile");

    if (!savedProfile) {
        alert("⚠️ Please save your profile first!");
        return;
    }

    const profile = JSON.parse(savedProfile);

    const message = `
Analyze my career decision based on my profile.

Education: ${profile.education}
Career Goal: ${profile.careerGoal}
Skills: ${profile.skills}
Available Learning Time: ${profile.timeAvailable}
Budget: ${profile.budget}

Compare suitable career options and explain the reasoning.
`;

    document.getElementById("userInput").value = message;

    sendMessage();
}
async function compareOptions() {

    const savedProfile = localStorage.getItem("neuroNexoraProfile");

    if (!savedProfile) {
        alert("⚠️ Please save your profile first!");
        return;
    }

    const profile = JSON.parse(savedProfile);

    const resultBox = document.getElementById("comparisonResult");

    resultBox.innerHTML =
        "🧠 NeuroNexora AI is comparing your options...";

    const message = `
Compare career options for this user.

Education: ${profile.education}
Career Goal: ${profile.careerGoal}
Skills: ${profile.skills}
Available Learning Time: ${profile.timeAvailable}
Budget: ${profile.budget}

Compare Software Engineering, Data Analytics,
and Web Development.

For each option explain:
- Advantages
- Limitations
- Skills required
- Important trade-offs

Give clear and neutral decision-support information.
Do not make the final decision for the user.
`;

    try {

        const response = await fetch(
            `${API_BASE}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        if (data.reply) {

            resultBox.innerHTML =
                "<h3>📊 AI Option Comparison</h3>" +
                "<p>" +
                data.reply.replace(/\n/g, "<br>") +
                "</p>";

        } else {

            resultBox.innerHTML =
                "⚠️ Unable to generate comparison.";
        }

    } catch (error) {

        resultBox.innerHTML =
            "⚠️ AI server connection failed.";

        console.error(error);
    }
}
async function explainDecision() {

    const savedProfile = localStorage.getItem("neuroNexoraProfile");

    if (!savedProfile) {
        alert("⚠️ Please save your profile first!");
        return;
    }

    const profile = JSON.parse(savedProfile);

    const resultBox = document.getElementById("xaiResult");

    resultBox.innerHTML =
        "🧠 NeuroNexora AI is explaining the recommendation...";

    const message = `
Explain the reasoning behind the career recommendation.

Education: ${profile.education}
Career Goal: ${profile.careerGoal}
Skills: ${profile.skills}
Available Learning Time: ${profile.timeAvailable}
Budget: ${profile.budget}

Explain:
1. Why the options may fit the user
2. Which user factors influenced the reasoning
3. Advantages
4. Limitations
5. Important trade-offs

Give transparent and understandable reasoning.
Do not make the final decision for the user.
`;

    try {

        const response = await fetch(
            `${API_BASE}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        if (data.reply) {

            resultBox.innerHTML =
                "<h3>💡 Explainable AI</h3>" +
                "<p>" +
                data.reply.replace(/\n/g, "<br>") +
                "</p>";

        } else {

            resultBox.innerHTML =
                "⚠️ Unable to generate explanation.";
        }

    } catch (error) {

    const chatArea = document.getElementById("chatArea");
    
    if (chatArea.lastElementChild) {
        chatArea.lastElementChild.remove();
    }

    addMessage(
        `⚠️ Live AI is temporarily unavailable.

🎬 CONFERENCE DEMO MODE

NeuroNexora AI Demo Result:

Your profile can be analyzed based on:
• Education
• Career Goal
• Skills
• Available Learning Time
• Budget

The platform compares multiple career options,
identifies important trade-offs, and provides
explainable decision-support insights.

📌 Demo note:
This is a prepared fallback response.
Live AI can be used when API service is available.`,
        "ai-message"
    );

    console.error(error);
}
}
async function generateScores() {

    const savedProfile =
        localStorage.getItem("neuroNexoraProfile");

    if (!savedProfile) {
        alert("⚠️ Please save your profile first!");
        return;
    }

    const profile = JSON.parse(savedProfile);

    const resultBox =
        document.getElementById("comparisonResult");

    resultBox.innerHTML =
        "🧠 NeuroNexora AI is calculating compatibility scores...";

    try {

        const response = await fetch(
            `${API_BASE}/analyze`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    education: profile.education,

                    careerGoal: profile.careerGoal,

                    skills: profile.skills,

                    timeAvailable:
                        profile.timeAvailable,

                    budget: profile.budget
                })
            }
        );

        const data = await response.json();

        if (data.scores) {

            let html = `
                <h3>📊 AI Compatibility Analysis</h3>

                <p>
                    Profile-based compatibility scores:
                </p>
            `;

            data.scores.forEach(item => {

                html += `
                    <div class="score-result">

                        <div class="score-heading">

                            <strong>
                                ${item.option}
                            </strong>

                            <strong>
                                ${item.score}%
                            </strong>

                        </div>

                        <div class="progress">

                            <div
                                class="progress-fill"
                                style="width: ${item.score}%;">
                            </div>

                        </div>

                    </div>
                `;
            });

            html += `
                <p class="score-note">
                    ℹ️ These are AI-assisted indicative
                    compatibility scores based on the
                    provided profile.
                </p>
            `;

            resultBox.innerHTML = html;

        } else {

            resultBox.innerHTML =
                "⚠️ Unable to generate scores.";

        }

    } catch (error) {

        resultBox.innerHTML =
            "⚠️ AI scoring server connection failed.";

        console.error("Scoring Error:", error);
    }
}
async function generateFinalDecision() {

    const savedProfile = localStorage.getItem("neuroNexoraProfile");

    if (!savedProfile) {
        alert("⚠️ Please save your profile first!");
        return;
    }

    const profile = JSON.parse(savedProfile);

    const resultBox = document.getElementById("finalDecisionResult");

    resultBox.innerHTML =
        "🧠 NeuroNexora AI is preparing your final decision summary...";

    const message = `
Create a final decision-support summary for this user.

Education: ${profile.education}
Career Goal: ${profile.careerGoal}
Skills: ${profile.skills}
Available Learning Time: ${profile.timeAvailable}
Budget: ${profile.budget}

Include:

1. User Goal
2. Important Profile Factors
3. Options Considered
4. Key Trade-offs
5. Skill Gaps
6. Practical Next Steps

Provide a clear and neutral summary.
Do not make the final decision for the user.
The purpose is to support informed decision-making.
`;

    try {

        const response = await fetch(
            `${API_BASE}/chat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        if (data.reply) {

            resultBox.innerHTML =
                "<h3>🧠 Final Decision Summary</h3>" +
                "<p>" +
                data.reply.replace(/\n/g, "<br>") +
                "</p>";

        } else {

            resultBox.innerHTML =
                "⚠️ Unable to generate final summary.";
        }

    } catch (error) {

        resultBox.innerHTML =
            "⚠️ AI server connection failed.";

        console.error(error);
    }
}
function startPlatform() {
    document.getElementById("profile").scrollIntoView({
        behavior: "smooth"
    });
}
window.addEventListener("load", function () {

    const savedProfile = localStorage.getItem("neuroNexoraProfile");

    if (!savedProfile) return;

    const profile = JSON.parse(savedProfile);

    document.getElementById("userName").value =
        profile.name || "";

    document.getElementById("education").value =
        profile.education || "";

    document.getElementById("careerGoal").value =
        profile.careerGoal || "";

    document.getElementById("skills").value =
        profile.skills || "";

    document.getElementById("timeAvailable").value =
        profile.timeAvailable || "";

    document.getElementById("budget").value =
        profile.budget || "";
});
function newChat() {
    const chatArea = document.getElementById("chatArea");

    chatArea.innerHTML = `
        <div class="message ai-message">
            🧠 Hello! I'm NeuroNexora AI.<br><br>
            How can I help you with your decision today?
        </div>
    `;
}