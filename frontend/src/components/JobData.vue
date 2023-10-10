<template>

	<v-card>

		<v-card-text>
			<v-container>
				<v-row>
					<v-col cols="8">
						<div v-html="props.description"></div>
					</v-col>
					<v-col cols="4">

						<p class="label">AI Analysis:</p>
						<div v-html="analysis"></div>
						<ButtonComponent label="AI Analyze" :action="generateAnalysis" />

						<v-divider class="my-10"></v-divider>

						<p class="label">Posted on:</p>
						<p>{{ props.pubDate }}</p>

						<p class="label">Budget:</p>
						<p>TBD</p>

					</v-col>
				</v-row>
			</v-container>

		</v-card-text>
	</v-card>

</template>

<script setup>
import { ref, defineProps, onMounted, onUpdated } from 'vue';
import { useProposalStore } from '../store';

import ButtonComponent from './base/Button2.vue'

const props = defineProps([
	'title',
	'link',
	'description',
	'pubDate',
	'guid'
]);

const analysis = ref(null);
const proposalStore = useProposalStore();

const aboutMeText   = ref(proposalStore.aboutMeText);
const jobText = ref(props.description);


onMounted( async() => {

	const job = {
		aboutMeText: aboutMeText.value,
		jobText: jobText.value,
		guid: props.guid
	}

	// analysis.value = await generateAnalysis(job);

});

const generateAnalysis = async (job) => {

	const url = "http://127.0.0.1:5000/generate-analysis";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(job)
	} );

    const data = await response.json();

	console.log(data);

	return data || "Error generating output.";
  }

</script>

<style scoped>
.label{
	font-size: 20px;
	font-weight: bold;
}

</style>
