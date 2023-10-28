<template>

	<header class="page-header">
	  <h2>User Settings & Config</h2>
	</header>

	<v-divider></v-divider>

	<div style="margin-top:30px">

	  <v-expansion-panels multiple>
		<v-expansion-panel title="About Me" active>
		  <v-expansion-panel-text>
			Enter your about me text: your areas of expertise and the types of jobs you are looking for.<br/><br/>
			<v-textarea
			  v-model="aboutMeTextRef"
			  clearable
			  clear-icon="mdi-close-circle"
			  variant="solo-filled">
			</v-textarea>
		  </v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Other Settings Placeholder">
		  <v-expansion-panel-text>
			Other settings here<br/><br/>
			<v-textarea
			  clearable
			  clear-icon="mdi-close-circle"
			  variant="solo-filled">
			</v-textarea>
		  </v-expansion-panel-text>
		</v-expansion-panel>
	  </v-expansion-panels>

	  <br/>
	  <v-divider></v-divider>
	  <br/>

	  <v-btn color="green" block @click="saveSettings()">Save Settings ></v-btn>
	  <br/>
	  <v-divider></v-divider>
	  <br/>

	  <v-card>
		<v-card-title>Placeholder card</v-card-title>
		<v-card-text>
		  <div v-html="outputText"></div>
		</v-card-text>
	  </v-card>

	</div>

  </template>

  <script setup>

	import { ref, onMounted } from "vue";
	import { useProposalStore } from '@/stores/proposalStore';

	const proposalStore = useProposalStore();
	const aboutMeTextRef = ref(proposalStore.aboutMeText);

	onMounted(async () => {
		await proposalStore.fetchAboutMeText();
		aboutMeTextRef.value = proposalStore.aboutMeText;
	});

	const saveSettings = async () => {
	  proposalStore.setAboutMeText(aboutMeTextRef.value);
	  await proposalStore.saveAboutMeText();
	  alert("settings saved!");
	}

  </script>
