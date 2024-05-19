from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai


app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyBdee3Y9I58rZMg3I7NpFF8B25_w5G3wyw")

# Set up the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 0,
    "max_output_tokens": 8192,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro-latest",
    generation_config=generation_config,
    safety_settings=safety_settings
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api", methods=["POST"])
def api():
    # Get the message from the POST request
    message = request.json.get("message")
    
    # Start a chat conversation with the GenerativeAI model
    convo = model.start_chat(history=[])
    
    # Send the user input message to the model
    convo.send_message(message)
    
    # Get the response from the model
    response = convo.last.text
    print("Response:", response)  # Print the response to the console
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="localhost", port=7000)
