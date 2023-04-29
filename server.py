import openai
import os
from flask import Flask, request, jsonify

# global variables
model = 'gpt-3.5-turbo'
openai.api_key = os.getenv("OPENAI_API_KEY")


# prompts
INTERVIEWER_PROMPT = """You are an interviewer that asks the user about their job, including title, description, industry, involved parties, goal, etc., in order to understand the role and its goal. You can ask specific questions to clarify."""


app = Flask(__name__)

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




# API ENDPOINTS: REAL
@app.route('/dev_interviewer', methods=['POST'])
def dev_interviewer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', "You are a helpful assistant.")

    # send the conversation to GPT
    return ask_chatGPT(conversation, system_prompt)


# HELPER FUCTIONS
def ask_chatGPT(conversation, system_prompt="You are a helpful assistant."):
    completion = openai.ChatCompletion.create(
        model=model,
        messages=[
            {'role': 'system', 'content': system_prompt},
        ] + conversation,
    )
    print('DEBUG:', completion.choices[0].message)
    return jsonify(completion.choices[0].message.content)