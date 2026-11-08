WHITE HOLE website — local setup for Mac

1. Make sure the Ollama app is installed and open.
2. Open Terminal and go into this folder:
   cd ~/Downloads/WHITE-HOLE-WEBSITE
   (If you extracted it somewhere else, use that folder's location.)
3. Create and activate a virtual environment:
   python3 -m venv venv
   source venv/bin/activate
4. Install the website requirements:
   pip install -r requirements.txt
5. Make sure the model is available:
   ollama pull llama3.2:1b
6. Start the website:
   python app.py
7. Open Safari and visit:
   http://127.0.0.1:5000

Keep Terminal open while using the website. This version uses your local Ollama model,
so it does not require an OpenAI/Gemini API key. It runs on this computer only;
it is not publicly hosted yet.
