const API_URL = "url from google colab paste here"; 

document.addEventListener('DOMContentLoaded', () => {

    const uploadBtn = document.getElementById('upload-trigger');
    const realFileInput = document.getElementById('real-file-input');
    const textAreas = document.querySelectorAll('.text-box'); 
    const actionButtons = document.querySelectorAll('.action-card');
    const footerText = document.querySelector('.footer-text');

    if (uploadBtn && realFileInput) {
        uploadBtn.addEventListener('click', () => {
            realFileInput.click();
        });

        realFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            footerText.innerHTML = `<div style="color: #0e1c3d; font-weight: bold;">Processing ${file.name}...</div>`;

            if (file.type === "application/pdf") {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await fetch(`${API_URL}/upload-pdf`, {
                        method: 'POST',
                        headers: { "Bypass-Tunnel-Reminder": "true" },
                        body: formData
                    });

                    if (!response.ok) throw new Error("PDF extraction failed");

                    const data = await response.json();
                    
                    if (data.text) {
                        textAreas[0].value = data.text; // Fill the Resume box
                        footerText.innerHTML = `<span style="color: green; font-weight: bold;">✔ PDF extracted successfully!</span>`;
                    } else {
                        throw new Error(data.error || "No text found in PDF");
                    }
                } catch (error) {
                    console.error("PDF Error:", error);
                    footerText.innerHTML = `<span style="color: red;">Error: Could not read PDF. Try pasting text directly.</span>`;
                }
            } 
            else if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (event) => {
                    textAreas[0].value = event.target.result;
                    footerText.innerHTML = `<span style="color: green; font-weight: bold;">✔ ${file.name} loaded!</span>`;
                };
                reader.readAsText(file);
            } else {
                alert("Please upload a .pdf or .txt file.");
                footerText.innerHTML = "Invalid file format.";
            }
        });
    }

    actionButtons.forEach(button => {
        if (button.id === 'upload-trigger') return;

        button.addEventListener('click', async () => {
            const resumeText = textAreas[0].value.trim();
            const jdText = textAreas[1].value.trim();
            const actionType = button.innerText.trim();

            if (!resumeText || !jdText) {
                alert("Please ensure both Resume and Job Description are filled.");
                return;
            }

            footerText.innerHTML = `<div style="color: #0e1c3d; font-weight: bold;">Analyzing ${actionType}...</div>`;
            button.style.opacity = "0.5";
            button.style.pointerEvents = "none";

            try {
                const response = await fetch(`${API_URL}/analyze`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Bypass-Tunnel-Reminder": "true" 
                    },
                    body: JSON.stringify({
                        resume: resumeText,
                        jd: jdText,
                        action: actionType
                    })
                });

                if (!response.ok) throw new Error(`Server error: ${response.status}`);

                const data = await response.json();

                footerText.innerHTML = `
                    <div style="text-align: left; padding: 20px; border-top: 3px solid #0e1c3d; margin-top: 20px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <h3 style="color: #0e1c3d; margin-top: 0; font-size: 1.1rem; border-bottom: 1px solid #ccc; padding-bottom: 10px; text-transform: uppercase;">
                            ${data.action_title} Analysis
                        </h3>
                        <div style="color: #333; line-height: 1.6; font-size: 0.95rem; white-space: pre-wrap; margin-top: 10px;">
                            ${data.result}
                        </div>
                    </div>
                `;
                
            } catch (error) {
                footerText.innerHTML = `<div style="color: red; font-weight: bold;">Backend Connection Failed. Check Colab URL.</div>`;
            } finally {
                button.style.opacity = "1";
                button.style.pointerEvents = "auto";
            }
        });
    });
});