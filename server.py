import openai
import os
from flask import Flask, request, jsonify
from flask_cors import CORS


# global variables
model = 'gpt-3.5-turbo'
openai.api_key = open('api_key.txt', 'r').read()
if openai.api_key is None:
    raise Exception("Missing OPENAI_API_KEY environment variable")



# prompts
INTERVIEWER_PROMPT = """You are an interviewer that asks the user about their job, including title, description, industry, involved parties, 
goal, etc., in order to understand the role and its goal. You can ask specific questions to clarify."""

VISUALIZER_PROMPT = """You are a visualizer that asks the user about their job, including title, description, industry, involved parties,"""

SUGGESTER_PROMPT = """You are an interviewer that asks the user about their job, including title, description, industry, involved parties, 
goal, etc., in order to understand the role and its goal. You can ask specific questions to clarify."""


app = Flask(__name__)
CORS(app)

# API ENDPOINTS: DEBUG
@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/hello_gpt')
def hello_gpt():
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
    )
    print(completion.choices[0].message)
    return jsonify(completion.choices[0].message)


# API ENDPOINTS: MOCKED
@app.route('/interviewer', methods=['GET', 'POST'])
def interviewer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', INTERVIEWER_PROMPT)

    return "Oh that's great! Thank you for your time."


@app.route('/visualizer', methods=['GET', 'POST'])
def visualizer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', VISUALIZER_PROMPT)

    entrynrelations = {
        "entities": {
            "ENTITY1": "DESCRIPTION",
            "ENTITY2": "DESCRIPTION",
            "NAME": "DESCRIPTION",},
        "relations": [
            {"from": "ENTITY1", "to": "ENTITY2", "description": "DESCRIPTION"}
  ]
}
    return jsonify(entrynrelations)

@app.route('/suggester', methods=['GET', 'POST'])
def suggester():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', SUGGESTER_PROMPT)

    return "Oh how do you find our solution?"



# API ENDPOINTS: REAL
@app.route('/dev_interviewer', methods=['POST'])
def dev_interviewer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', INTERVIEWER_PROMPT)

    # send the conversation to GPT
    return interview_chatGPT(conversation, system_prompt)


@app.route('/dev_suggester', methods=['POST'])
def dev_suggester():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', SUGGESTER_PROMPT)

    # send the conversation to GPT
    return suggest_chatGPT(conversation, system_prompt)


# HELPER FUCTIONS
def interview_chatGPT(conversation, system_prompt=INTERVIEWER_PROMPT):
    completion = openai.ChatCompletion.create(
        model=model,
        messages=[
            {'role': 'system', 'content': system_prompt},
        ] + conversation,
    )
    print('DEBUG:', completion.choices[0].message)
    return jsonify(completion.choices[0].message.content)

def suggest_chatGPT(conversation, system_prompt=SUGGESTER_PROMPT):
    completion = openai.ChatCompletion.create(
        model=model,
        messages=[
            {'role': 'system', 'content': system_prompt},
        ] + conversation,
    )
    print('DEBUG:', completion.choices[0].message)
    return jsonify(completion.choices[0].message.content)



