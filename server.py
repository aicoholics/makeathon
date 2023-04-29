import openai
import os
from flask import Flask, request, jsonify

# global variables
model = 'gpt-3.5-turbo'
openai.api_key = os.getenv("OPENAI_API_KEY")


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/hello_gpt')
def hello_gpt():
    prompt = 'Say hi!'
    response = openai.ChatCompletion.create(
        engine=model,
        messages=[
            {'role': 'user', 'content': prompt},
        ]
    )
    return jsonify(response)


@app.route('/api/gpt3', methods=['POST'])
def gpt3():
    data = request.get_json()
    prompt = data['prompt']
    response = openai.Completion.create(
        engine="davinci",
        prompt=prompt,
        temperature=0.7,
        max_tokens=100,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=["\n", " Human:", " AI:"]
    )
    return jsonify(response)