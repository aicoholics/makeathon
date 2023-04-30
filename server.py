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

SUMMARIZER_PROMPT = """You are a summarizer that based on the given interview, summarize what the USER said accurately, but without mentioning the INTERVIEWER."""

def VISUALIZER_PROMPT(interview_summary):
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
"entity": The name of the entity that has a problem and will be affected by the use case.
"current_approach": Detailed description of the current approach that you think has a problem or could have a potential improvement. Refer to the organization summary and structure.
"problem": Very detailed explanation of the problem you have identified in the current approach. Refer to the organization summary and structure.
"solution": A very detailed and concrete suggestion on which specific AI tool can be applied to solve the problem for the entity, with examples. It should also explain how to apply the AI tool, and why it is better than the current approach. Refer to the organization summary and structure. It can also compare with alterative approaches. It should be at least 100 words.
"expected_value": Qualitative or quantitative evaluation of the expected business value enabled by your AI solution. Do not make up numbers.
"risks": Potential costs and risks involved in the implementation of your AI solution. Do not make up numbers.
"required_resources": Resources required to implement your AI solution, including data, people, and infrastructure. Give examples.

Format the your answer as a JSON object(example):
{{
    "entity": "Marketing",
    "current_approach": "The marketing team currently manually browses through social media to find potential customers and their interests. They spend significant time in doing so.",
    "problem": "The current approach is inefficient and time-consuming. It is also difficult to find all potential customers and their interests. There is also potential bias in the selection of customers. For instance, the marketing team may only select customers that are similar to themselves, speak a certain language, or tend to be active on social media during the same time of the day.",
    "solution": "The marketing team can use an NLP model to automatically and constantly monitor social media activity to find potential customers and their interests. The NLP model can also understand multiple languages and be active during any time of the day. It could use a LLM such as GPT-3 to summarize large amounts of text and extract the most important information. It could also use a BERT model to classify the sentiment of the text and understand the customer's interests. The human marketing team can therefore gain a higher level overview with less bias and more efficiency.",
    "expected_value": "Discovering more potential customers and their interests will lead to more sales and revenue. It will also lead to a more diverse customer base and a better understanding of the market. The marketing team will also be able to spend less time on social media and more time on other tasks.",
    "risks": "The NLP model may not be able to understand all languages and may not be able to understand all types of text. The training process of the NLP model is crucial to its usefulness and accuracy. The NLP model may also be expensive to train and deploy. A IT team would be required to provide the necessary infrastructure and support. NLP models can still contain biases due to their training data.",
    "required_resources": "1. Large amount of training data, which can be obtained from the marketing team's past social media activity.\\n2. Large amount of computing power to train and deploy.\\n3. IT team to provide the necessary infrastructure and support."
}}
"""

AI_MODELS = """
List of AI models that can be used to solve the problem:
- ChatGPT: A powerful chatbot that can answer any question in a flexible manner.
- DALL-E: A powerful image generator that can generate images based on text descriptions.
- AutoGPT: A autonomous agent-based chatbot that can plan over a long-term horizon by an iterative process of planning and execution, based on GPT. It can take actions and use tools such as calculators and websearch to achieve its goal.
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

@app.route('/mock_suggester', methods=['GET', 'POST'])
def mock_suggester():
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

    # convert the conversation to a string
    conversation = [f"\n{'USER' if msg['role'] == 'user' else 'INTERVIEWER'}:  {msg['content']}" for msg in conversation]
    conversation = ''.join(conversation)
        
    # send the conversation to GPT
    return jsonify(ask_chatGPT([{'role': 'user', 'content': 'Please summarize what the USER said in the following interview precisely. Do not mention the INTERVIEWER at all. \n'+conversation}], system_prompt, should_jsonify=False).content)



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


@app.route('/suggester', methods=['POST'])
def suggester():
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