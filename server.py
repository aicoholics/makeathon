import openai
import os
from flask import Flask, request, jsonify

# global variables
model = 'gpt-3.5-turbo'
openai.api_key = os.getenv("OPENAI_API_KEY")



# prompts
INTERVIEWER_PROMPT = """You are an interviewer that asks about the position of the user in the company and, based on the answer, 
understand the entails of the organization, including roles, job descriptions, industry, the organization's goal, etc. The purpose of 
this interview is to gain an overview understanding of aim of the organization. You can ask specific questions to clarify."""

VISUALIZER_PROMPT = """You read the user's description of their company structure and parties' relations, then summarize it to a list of 
entities and the relations in the company or team, exactly according to the user's description and without your own speculation. 
Format the your answer as a JSON object(example):

{
  "Entities": {
    "HR": "Manage employees and workplace.",
    "Marketing": "Business development, branding, promotion, etc.",
    "Customer Support": "Offer support and troubleshooting products over chat and hotline."
  },
  "Relations": [
    {
      "from": "Marketing",
      "to": "Customer Support",
      "description": "Gives instructions on deals to promote to customers"
    },
    {
      "from": "HR",
      "to": "Customer Support",
      "description": "Check performance and feedback on each employee"
    }
  ]
}

"""

SUGGESTER_PROMPT = """You are a problem solver that based on the given summaries of the work relations, observe the potential problems and 
give suggestions which AI can help to achieve their organization's goal."""


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

    return {"role": "assistant", "content": "Oh that's great! Thank you for your time."}


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

@app.route('/dev_visualizer', methods=['POST'])
def dev_visualizer():   
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', VISUALIZER_PROMPT)

    return visualize_chatGPT(conversation, system_prompt)


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
    return jsonify(completion.choices[0].message)


def visualize_chatGPT(conversation, system_prompt=VISUALIZER_PROMPT):
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



