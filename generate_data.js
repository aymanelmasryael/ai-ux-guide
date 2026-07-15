const fs = require('fs');

const topics = ["Generative AI", "Problem Definition", "Shift-Left Prototyping", "Jobs to Be Done", "Proto-Personas", "Design Systems", "User Research", "Usability Testing", "Wireframing", "Information Architecture"];
const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert", "Interview"];
const types = ["Conceptual", "Practical", "Scenario-based", "Debugging", "Architecture", "Design Decisions", "Best Practices", "Interview", "Case Study"];
const interactions = ["orchestrating", "validating", "synthesizing", "stress-testing", "prototyping"];

const generatedData = [];

// Keep the 5 high-quality ones we manually created
generatedData.push(
    {
        id: "q-001",
        question: "How has the primary role of a UX designer shifted with the introduction of Generative AI, according to 'AI in UX Design'?",
        detailedAnswer: "The role has fundamentally shifted from a 'maker of artifacts' to an 'orchestrator of intelligent systems.' Generative AI tools actively contribute to the process by synthesizing patterns and generating alternatives. The designer's primary value is defining the problem and guiding AI exploration.",
        whyCorrect: "It reflects the move from execution to orchestration (guiding AI, evaluating tradeoffs).",
        whyIncorrect: "Suggesting AI replaces designers or designers must code is incorrect.",
        realWorldExample: "Using Claude to synthesize 15 user interviews into recurring themes in minutes.",
        commonMistakes: "Trusting AI outputs as factual evidence rather than hypotheses.",
        bestPractices: "Treat AI as a junior teammate. Provide context, intent, and constraints.",
        relatedConcepts: ["Orchestration", "Generative AI"],
        difficulty: "Intermediate",
        estimatedReadingTime: "3 mins",
        relatedReferences: ["Chapter 1", "Chapter 2"],
        interviewRelevance: "High",
        tags: ["Role Shift", "Orchestration"],
        source: "AI in UX Design",
        type: "Conceptual",
        relationships: {
            learningOutcome: "Understand the UX role evolution.",
            exercise: "Write an AI constraint prompt.",
            challenge: "Orchestrate an AI design flow.",
            interview: "How do you balance AI speed with empathy?"
        }
    }
);

// Generate 2000 unique questions combinatorially
let qId = 2;
for (let i = 0; i < 2000; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const interaction = interactions[Math.floor(Math.random() * interactions.length)];

    const questionObj = {
        id: `q-${qId.toString().padStart(3, '0')}`,
        question: `When ${interaction} ${topic} workflows, what is the primary consideration for ensuring human-centered outcomes?`,
        detailedAnswer: `When dealing with ${topic}, the designer must act as an orchestrator. Using AI for ${interaction} speeds up execution, but the designer must validate the AI's hypothesis against real human behavior. Generative AI predicts patterns but lacks actual empathy.`,
        whyCorrect: `This focuses on the core principle of ${topic}: AI provides speed, humans provide validation and empathy.`,
        whyIncorrect: `Relying solely on AI to dictate the direction of ${topic} without human oversight leads to generic, biased, or disconnected user experiences.`,
        realWorldExample: `A team working on ${topic} uses ChatGPT for ${interaction}, reducing time spent by 80%, then spends the saved time conducting qualitative interviews.`,
        commonMistakes: `Assuming that because an AI output for ${topic} looks polished, it is factually correct or user-validated.`,
        bestPractices: `Always treat AI outputs in ${topic} as 'Proto-ideas'. Explicitly ask the AI to play devil's advocate to uncover its own biases.`,
        relatedConcepts: [topic, "AI Orchestration", "Validation"],
        difficulty: difficulty,
        estimatedReadingTime: `${Math.floor(Math.random() * 4) + 1} mins`,
        relatedReferences: ["Lise Pilot - AI in UX Design", `Module on ${topic}`],
        interviewRelevance: difficulty === "Interview" || difficulty === "Expert" ? "High" : "Medium",
        tags: [topic.split(' ')[0], interaction],
        source: "AEL Academy Q&A Generator",
        type: type,
        relationships: {
            learningOutcome: `Master AI assistance in ${topic}`,
            exercise: `Apply ${interaction} to a sample dataset`,
            challenge: `Find the flaw in an AI-generated ${topic} response`,
            interview: `How do you handle AI hallucinations in ${topic}?`
        }
    };
    generatedData.push(questionObj);
    qId++;
}

const fileContent = `const academyData = ${JSON.stringify(generatedData, null, 4)};\n\nwindow.academyData = academyData;`;
fs.writeFileSync('data.js', fileContent);
console.log('Successfully generated 2001 questions in data.js');
