<template>

  <header class="page-header">
    <h2>Upwork Proposal Generator</h2>
  </header>

  <div class="section" id="about-me">
    <h3 class="section-header__primary">About Me</h3>
    <textarea
      v-model="aboutMeText"
      rows="10"
      @input="proposalStore.setAboutMeText(aboutMeText)">
    </textarea>
  </div>

  <div class="section" id="target-job">
    <h3 class="section-header__primary">Target Job</h3>
    <textarea
      v-model="targetJobText"
      rows="10"
      @input="proposalStore.setTargetJobText(targetJobText)">
    </textarea>
  </div>

  <button class="btn btn-primary" @click="generateOutput(aboutMeText, targetJobText)">Generate Output ></button>

  <div class="section" id="output">
    <h3 class="section-header__primary">AI Output</h3>
    <div v-html="outputText" class="text-output"></div>
  </div>

</template>

<script setup>
  import { ref } from "vue";
  import { useProposalStore } from '../store';

  const proposalStore = useProposalStore();

  const aboutMeText = ref(proposalStore.aboutMeText);
  const targetJobText = ref(proposalStore.targetJobText);
  const outputText = ref(proposalStore.outputText);

  // Constants for OpenAI API
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "asdf";

  const generateOutput = async (aboutMe, targetJob) => {

    const userPrompt = `
      MY EXPERIENCE: ### ${aboutMe} ###
      JOB DESCRIPTION: ### ${targetJob} ###
    `;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              CONTEXT: You're an expert at writing cover letters, geared towards applicants who are applying for web-development
              freelance jobs on Upwork. Your goal is to take inputs provided by the user, and output a well-written cover letter.

              The user will provide you with two inputs: MY_EXPERIENCE, and JOB_DESCRIPTION.

              When given a task, you will think it through step-by-step:

              First: Create a *bullet point summary* of MY_EXPERIENCE. Bullet points should only reference things that are explicity declared within MY_EXPERIENCE. This *bullet point summary* will be referred to as the "APPLICANT_SUMMARY".
              Second: Create a *bullet point summary* of the requirements being asked for in JOB_DESCRIPTION. Bullet points should only reference things that are explicity declared within JOB_DESCRIPTION, and should be ranked in order of importance. This *bullet point summary* will be referred to as the "JOB_SUMMARY"
              Third: Compare the APPLICANT_SUMMARY and JOB_SUMMARY and determine whether or not the user is a strong candidate for this position. You should then generate a short summary explaining if the candidate is a "strong match", "weak match", or "not a match". This explanation will be referred to as the "MATCH_SUMMARY".
              Fourth:
                If the MATCH_SUMMARY generated above is "not a match", then skip the rest of the steps.
                If the MATCH_SUMMARY generated above is either a "strong match" or a "weak match", then generate a cover letter that is tailored to the APPLICANT_SUMMARY and JOB_SUMMARY.
                When generating a cover letter, think it through step-by-step.
                The cover letter should only make reference to things that are explicitly mentioned within MY_EXPERIENCE and JOB_DESCRIPTION.
                The output cover letter should be between 2 and 4 paragraphs.
                It should be written in a friendly and conversational manner. The first paragraph should start with a brief introduction.
                The middle paragraphs should emphasize the overlap between MY_EXPERIENCE and the JOB_DESCRIPTION. Only address aspects of JOB_DESCRIPTION that are a match with MY_EXPERIENCE.
                The closing paragraph should invite the hiring manager to view the user's upwork profile, and ask the hiring manager if they'd like to setup a call to "chat more" sometime.

              All of your responses should follow this structure:
              ---
              <strong>Applicant Experience</strong>: <p>{{{ APPLICANT_SUMMARY }}}</p>
              <strong>Job Overview</strong>: <p>{{{ JOB_SUMMARY }}}</p>
              <strong>Assessment of match</strong>: <p> {{{ MATCH_SUMMARY }}}</p>
              *only if applicable:* <h4>Cover Letter</h4>: <p>{{{ COVER LETTER }}}</p>
              ---
              `
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
      }),
    });

    const data = await response.json();
    outputText.value = data.choices[0]?.message?.content || "Error generating output.";
  }
</script>

<style scoped>
  .section {
    padding: 0 20px;
    margin-bottom: 20px;
  }

  textarea {
    display: block;
    width: 90%;
    padding: 25px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-top: 0;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    font-family: Arial, sans-serif;
    resize: vertical;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  }

  .section#output{
    border-top: 1px solid black;
    padding-top: 40px;
  }

  .text-output{
    width: 90%;
    min-height: 500px;
    padding: 25px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-top: 0;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  }
</style>
