import openai
import os
import time
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from haystack.nodes.retriever.web import WebRetriever


# global variables
model = 'gpt-3.5-turbo'
# model = 'text-davinci-003'
openai.api_key = open('api_key.txt', 'r').read()
if openai.api_key is None:
    raise Exception("Missing OPENAI_API_KEY environment variable")
document_separator = "\n\n"


# prompts
INTERVIEWER_PROMPT = """You are an interviewer that asks about the position of the user in the company and, based on the answer, 
understand the entails of the organization, including roles, job descriptions, industry, the organization's goal, etc. The purpose of 
this interview is to gain an overview understanding of aim of the organization. You can ask specific questions to clarify."""

SUMMARIZER_PROMPT = """You are a summarizer that based on the given interview, summarize it accurately."""

def VISUALIZER_PROMPT(interview_summary):
    print('intsfdghj',interview_summary)
    return """You read the user's description, then summarize it to a list of entities and the relations in the company or team, exactly according to the user's description and without your own speculation. 
You must format the your answer as a single JSON object, and not include any other text at all (example):
{
  "entities": {
    "HR": "Manage employees and workplace.",
    "Marketing": "Business development, branding, promotion, etc.",
    "Customer Support": "Offer support and troubleshooting products over chat and hotline."
  },
  "relations": [
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

If you cannot find any entities or relations, you must simply return an empty list for the corresponding field. You must not respond in text outside of the JSON, under any circumstances. For example:
{
    "entities": {},
    "relations": []
}

This is the information about the organization:
""" + interview_summary

def SUGGESTER_PROMPT(interview_summary, structure, documents=[]):
    return f"""
You are a problem solver that based on the given summaries of the work relations, observe the potential problems and give suggestions of which AI can help to achieve the organization's goal of the user.

Organization Summary:
{interview_summary}

Organization Structure:
{structure}

{'Related Informations:' + document_separator.join(documents) if len(documents) > 0 else ''}

Output a use case where AI can be applied to solve a problem in the organization. The use case should include:
"entity": The entity that has a problem and will be affected by the use case.
"current_approach": Description of the current approach that you think has a problem or could have a potential improvement.
"problem": Explanation of the problem you have identified in the current approach.
"solution": Suggestion on which AI tool can be applied to solve the problem for the entity.
"expected_value": Qualitative or quantitative evaluation of the expected business value enabled by your AI solution.
"risks": Potential costs and risks involved in the implementation of your AI solution.
"required_resources": Resources required to implement your AI solution, including data, people, and infrastructure.

Format the your answer as a JSON object(example):
{{
    "entity": "Marketing",
    "current_approach": "Marketing team manually selects the deals to promote to customers.",
    "problem": "The marketing team may not be able to select the best deals to promote to customers.",
    "solution": "AI can select the best deals to promote to customers.",
    "expected_value": "AI can increase the sales by 10%.",
    "risks": "AI may not be able to select the best deals to promote to customers.",
    "required_resources": "Data of the past deals and their performance."
}}
"""

AI_MODELS = """
List of AI models that can be used to solve the problem:
- ChatGPT: A powerful chatbot that can answer any question in a flexible manner.
- DALL-E: A powerful image generator that can generate images based on text descriptions.
- GodAI: The most powerful AI that can solve any problem with the best solution.



"""


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
@app.route('/mock_interviewer', methods=['GET', 'POST'])
def mock_interviewer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', INTERVIEWER_PROMPT)

    # sleep for 1 second to simulate a long response time
    time.sleep(1)
    return jsonify({"role": "assistant", "content": "Oh that's great! Thank you for your time."})

@app.route('/mock_summarizer', methods=['POST'])
def mock_summarizer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', SUMMARIZER_PROMPT)

    # send the conversation to GPT
    return jsonify("The user is a data analyst who works with data to draw conclusions and retrain models using Python codes. They work in a consulting company and have experience working with various datasets. Recently, they have been working on a project related to detecting faults in bearings for an electric motor company.")

@app.route('/mock_visualizer', methods=['GET', 'POST'])
def mock_visualizer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', VISUALIZER_PROMPT)

    entrynrelations = {
        "entities": {
            "ENTITY1": "DESCRIPTIONA",
            "ENTITY2": "DESCRIPTIONB",
            "ENTITY3": "DESCRIPTIONC",},
        "relations": [
            {"from": "ENTITY1", "to": "ENTITY2", "description": "DESCRIPTION"}
        ]
    }
    return jsonify(entrynrelations)

@app.route('/suggester', methods=['GET', 'POST'])
def suggester():
    # get the conversation from the request
    input = request.get_json()

    interview_summary = input['interview_summary']
    structure = input['structure']
    conversation = input['conversation']
    system_prompt = input.get('system_prompt', SUGGESTER_PROMPT(interview_summary, structure))
    
    comment = "I have the following suggestions for you:"

    results ={
            "entity": "Marketing",
            "current_approach": "Marketing team manually selects the deals to promote to customers.",
            "problem": "The marketing team may not be able to select the best deals to promote to customers.",
            "solution": "AI can select the best deals to promote to customers.",
            "expected_value": "AI can increase the sales by 10%.",
            "risks": "AI may not be able to select the best deals to promote to customers.",
            "required_resources": "Data of the past deals and their performance."
        }
    return jsonify({"comment": comment, "result": results})



# API ENDPOINTS: REAL
@app.route('/interviewer', methods=['POST'])
def interviewer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', INTERVIEWER_PROMPT)

    # send the conversation to GPT
    return ask_chatGPT(conversation, system_prompt)

@app.route('/summarizer', methods=['POST'])
def summarizer():
    # get the conversation from the request
    input = request.get_json()

    conversation = input['conversation']
    system_prompt = input.get('system_prompt', SUMMARIZER_PROMPT)

    # if the conversation ends with the assistant, remove it
    if conversation[-1]['role'] == 'assistant':
        conversation = conversation[:-1]

    # send the conversation to GPT
    return jsonify(ask_chatGPT(conversation, system_prompt, should_jsonify=False).content)



@app.route('/visualizer', methods=['POST'])
def visualizer():   
    # get the conversation from the request
    input = request.get_json()

    interview_summary = input['interview_summary']
    conversation = input['conversation']
    system_prompt = input.get('system_prompt', VISUALIZER_PROMPT(interview_summary))

    def json_tester(response):
        assert(type(response['entities']) == dict)
        assert(type(response['relations']) == list)

    return comment_and_result(conversation, system_prompt, json_tester)


@app.route('/dev_suggester', methods=['POST'])
def dev_suggester():
    # get the conversation from the request
    input = request.get_json()

    interview_summary = input['interview_summary']
    structure = input['structure']
    conversation = input['conversation']
    system_prompt = input.get('system_prompt', SUGGESTER_PROMPT(interview_summary, structure, [AI_MODELS]))

    def json_tester(response):
        assert(type(response['entity']) == str)
        assert(type(response['current_approach']) == str)
        assert(type(response['problem']) == str)
        assert(type(response['solution']) == str)
        assert(type(response['expected_value']) == str)
        assert(type(response['risks']) == str)
        assert(type(response['required_resources']) == str)

    # send the conversation to GPT
    return comment_and_result(conversation, system_prompt, json_tester)


# HELPER FUCTIONS
def ask_chatGPT(conversation, system_prompt=INTERVIEWER_PROMPT, should_jsonify=True):
    completion = openai.ChatCompletion.create(
        model=model,
        messages=[
            {'role': 'system', 'content': system_prompt},
        ] + conversation,
    )
    print('[DEBUG] chatGPT replied:', completion.choices[0].message)
    return jsonify(completion.choices[0].message) if should_jsonify else completion.choices[0].message

def comment_and_result(conversation, system_prompt, json_tester):
    response = ask_chatGPT(conversation, system_prompt, should_jsonify=False)
    # parse the json response
    s = response.content
    comment = s[:s.find('{')] if s.find('{') != -1 else s
    comment = comment.strip().replace('JSON object', 'result').replace('JSON', 'result')
    try:
        result = json.loads(s[s.find('{') : s.rfind('}')+1])
        print("DEBUG RESULT=",result)
        json_tester(result)
        return {"comment": comment, "result": result}
    except Exception as e:
        print('[ERROR] visualizer response is not valid json', e)
        return {"comment": comment, "result": {"entities": {}, "relations": []}}