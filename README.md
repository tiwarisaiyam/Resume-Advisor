Resume AI Advisor 
An AI-powered tool that evaluates how well a resume matches a job description. It uses NLP to extract text and calculate a semantic similarity score and give you the advices on the basis of that using gemini model.

Features : 
PDF Extraction: Uses PyMuPDF to parse resume content.
AI Matching: Uses sentence-transformers (all-MiniLM-L6-v2) for semantic analysis.
Match Scoring: Calculates Cosine Similarity between resume and JD.
Web UI: A clean frontend for easy file interaction.

Tech Stack : 
AI/ML: Python, PyTorch, Scikit-learn
Frontend: HTML5, CSS3, JavaScript
Environment: Google Colab / VS Code

Structure
Resume_AI_Advisor.ipynb: Core NLP pipeline and model logic.
frontend/: Contains the index.html, style.css, and script.js.

Setup
Run the .ipynb file in Google Colab to see the matching logic.
Open index.html in your browser to view the interface.

Note:
In this project i used a local tunnel to connect my vs code frontend and google colab backend with FastAPI, so make sure while running you connect the local tunnel.
