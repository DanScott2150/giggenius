from flask import Flask, request, jsonify
# from flask_cors import CORS
import json
import requests
import xml.etree.ElementTree as ET
import openai
from dotenv import dotenv_values

config = dotenv_values('.env')
openai.api_key = config["OPENAI_API_KEY"]

app = Flask(__name__)
app.config.from_object(__name__)

# CORS(app, resources={r'/*': {'origins': '*'}})

@app.route("/generate-analysis", methods=['POST'])
def generate_analysis():
	"""
	Takes description for a given job and makes API call to OpenAI to analyze how it aligns to user's profile

	Parameters:
	- request object will contain key:value pairs -- aboutMeText, jobText, guid

	Returns:
	- A JSON response containing the analysis generated by the model.

	Note:
	- OpenAI prompts for System and User messages are hardcoded here. Will eventually move elsewhere to be more dynamic.
	- @TODO - use openAI library methods instead of manual HTTPS post request
	"""

	args = request.json
	api_url = 'https://api.openai.com/v1/chat/completions'
	api_key = openai.api_key

	headers = {
		"Content-Type": "application/json",
		"Authorization": f"Bearer {api_key}",
	}

	user_prompt = f'''
		MY EXPERIENCE: ### {args["aboutMeText"]} ###
		JOB DESCRIPTION: ### {args["jobText"]} ###
		JOB ID: ### {args["guid"]} ###

		Your response should only match the following format exactly. You should not provide any extra summary or analysis.
		---
		<div style="display:none;">: Applicant Summary: <<APPLICANT_SUMMARY>> -- Job Summary:<<JOB_SUMMARY>></div>
		<p><strong>Decision</strong>: <span id="<<JOB ID>>"><<MATCH_DECISION>></span></p>
		<p><strong>Assessment</strong>: <<MATCH_SUMMARY>></p>
		---
	'''

	data = {
		"model": "gpt-3.5-turbo",
		"messages": [
			{
			"role": "system",
			"content": '''
			CONTEXT: You are an expert HR professional, highly skilled in evaluating whether or not an applicant would be a good fit for a job.
			Your job is to take inputs provided by the user, and decide whether or not the job is a "match" for the applicant.

			You will be provided with two inputs: MY_EXPERIENCE, and JOB_DESCRIPTION.

			When given a task, you will think it through step-by-step:

			First: Create a *bullet point summary* of MY_EXPERIENCE. Bullet points should only reference things that are explicitly declared within MY_EXPERIENCE. This *bullet point summary* will be referred to as the "APPLICANT_SUMMARY" in the following steps.
			Second: Create a *bullet point summary* of the requirements being asked for in JOB_DESCRIPTION. Bullet points should only reference things that are explicitly declared within JOB_DESCRIPTION and should be ranked in order of importance. This *bullet point summary* will be referred to as the "JOB_SUMMARY" in the following steps.
			Third: Compare the APPLICANT_SUMMARY and JOB_SUMMARY and determine whether or not the user is a strong candidate for this position, and explain your reasoning in 1 paragraph. This will be referred to as the "MATCH_SUMMARY" in the following steps.
			Fourth: Based on the MATCH_SUMMARY you generated, decide on a classification: "Strong Candidate", "Weak Candidate", or "Not a Candidate". This will be referred to as the MATCH_DECISION.

			All of your responses should match the following format exactly:
			---
			<div style="display:none;">: Applicant Summary:<<APPLICANT_SUMMARY>> -- Job Summary:<<JOB_SUMMARY>></div>
			<p><strong>Decision</strong>: <span id="<<JOB ID>>}"><< MATCH_DECISION>></span></p>
			<p><strong>Assessment</strong>: <<MATCH_SUMMARY>></p>
			---
			'''
			},
			{
			"role": "user",
			"content": user_prompt
			}
		]
	}

	try:
		# POST request to OpenAI
		response = requests.post(api_url, headers=headers, data=json.dumps(data))
		response_data = response.json()
		analysis = response_data['choices'][0]['message']['content']
		return jsonify(analysis)
	except Exception as error:
		print('Error generating analysis:', error)
		return "Error generating output."


@app.route("/fetch-upwork-jobs-rss")
def fetch_upwork_jobs_rss():
	"""
	Fetches list of jobs from Upwork RSS feed - specific to an individual account's saved search options. DOES NOT scrape the Upwork website.

	Returns:
		list: A list of job information dictionaries.

	Raises:
		Exception: If there is an error fetching the Upwork RSS feed.

	Notes:
	- @TODO URL currently hardcoded. Move it elsewhere to make the config parameters in the URL more dynamic & changeable
	- @TODO parse more data points from the Upwork RSS feed
	"""

	## Upwork RSS Feed URL
	# This URL should populate to your saved search options (keyword, budget, etc)
	target_url = 'https://www.upwork.com/ab/feed/jobs/rss?api_params=1&contractor_tier=1,2,3&hourly_rate=50-&job_type=hourly,fixed&orgUid=872559107033931777&paging=0;5&q=wordpress&securityToken=de56b8790f403c07196293547743d7d0aa964c95b1ad8dbba549fb823dfdbf2ef9ca3f6cb441593ab02952d74ecd8bc19ccf63dd5173aea09e263182b98f2c55&sort=recency&userUid=742862918896668672&user_location_match=1'

	jobs = []

	try:
		response = requests.get(target_url)

		# RSS Data returned in XML format. Need to parse
		data = ET.fromstring(response.text)
		items = data.findall('.//item')

		for job in items:
			guid = job.find('guid').text
			job_info = {
				'guid': guid,
				'aiAnalysis': {
				'decision': 'n/a',
				'summary': 'n/a'
			},
				'budget': 'TBD',
				'description': job.find('description').text,
				'feedback': {},
				'title': job.find('title').text,
				'url': job.find('link').text,
				'pubDate': job.find('pubDate').text
			}
			print(job_info)
			jobs.append(job_info)

	except Exception as error:
		print('Error fetching upwork RSS:', error)

	return jsonify(jobs)

if __name__ == '__main__':
	app.run()
