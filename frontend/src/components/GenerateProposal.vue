<template>

  <header class="page-header">
    <h2>Upwork Proposal Generator</h2>
  </header>

  <v-divider></v-divider>

  <div style="margin-top:30px">

    <v-expansion-panels multiple>
      <v-expansion-panel title="About Me" active>
        <v-expansion-panel-text>
          Enter your about me text: your areas of expertise and the types of jobs you are looking for.<br/><br/>
          <v-textarea
            v-model="aboutMeText"
            clearable
            clear-icon="mdi-close-circle"
            @input="proposalStore.setAboutMeText(aboutMeText)"
            variant="solo-filled">
          </v-textarea>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Target Job">
        <v-expansion-panel-text>
          Copy/paste the job description you are applying for<br/><br/>
          <v-textarea
            v-model="targetJobText"
            clearable
            clear-icon="mdi-close-circle"
            @input="proposalStore.setTargetJobText(targetJobText)"
            variant="solo-filled">
          </v-textarea>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <br/>
    <v-divider></v-divider>
    <br/>

    <v-btn color="green" block @click="generateProposal()">Generate Proposal For This Job ></v-btn>
    <br/>
    <v-divider></v-divider>
    <br/>

    <v-card>
      <v-card-title>AI-Generated Proposal:</v-card-title>
      <v-card-text>
        <div v-html="outputText"></div>
      </v-card-text>
    </v-card>

  </div>

</template>

<script setup>
  import { ref } from "vue";
  import { useProposalStore } from '@/stores/proposalStore';

  const proposalStore = useProposalStore();
  const aboutMeText   = ref(proposalStore.aboutMeText);
  const targetJobText = ref(proposalStore.targetJobText);
  const outputText    = ref(proposalStore.outputText);

  const generateProposal = async () => {

    const job = {
      aboutMeText: aboutMeText.value,
      jobText: targetJobText.value,
	  }

    const url = "http://127.0.0.1:5000/generate-proposal";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job)
    } );

    const data = await response.json();
    outputText.value = data || "Error generating output.";

  }

</script>
