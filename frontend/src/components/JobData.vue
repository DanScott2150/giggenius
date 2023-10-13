<template>

	<v-card>

		<v-card-text>
			<v-container>
				<v-row>
					<v-col cols="8">
						<p class="label">Job Information:</p>
						<div v-html="props.description"></div>
					</v-col>
					<v-col cols="4">

						<p class="label">Match:</p>
						<div v-html="match"></div>

						<p class="label">AI Analysis:</p>
						<div v-html="analysis"></div>
						<ButtonComponent label="AI Analyze" :action="generateAnalysis" />

						<v-divider class="my-10"></v-divider>

						<p class="label">Posted on:</p>
						<p>{{ props.pubDate }}</p>

						<p class="label">Budget:</p>
						<p>{{ props.budget }}</p>

					</v-col>
				</v-row>
			</v-container>

		</v-card-text>
	</v-card>

</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { ref as dbRef, getDatabase, update } from 'firebase/database';
import { useProposalStore } from '../store';
import ButtonComponent from './base/Button2.vue'

const props = defineProps([
	'title',
	'link',
	'description',
	'pubDate',
	'guid',
	'analysis',
	'match',
	'id',
	'budget'
]);

const analysis      = ref(props.analysis);
const match         = ref(props.match);
const jobText       = ref(props.description);
const proposalStore = useProposalStore();
const aboutMeText   = ref(proposalStore.aboutMeText);

/**
 * Generates the AI analysis for a given job. API call to flask server which connects to OpenAI.
 *
 * @param {string} jobText - The text of the job description, accessed via props, which pull from the database.
 * @param {string} aboutMeText - The text of the user skills/experience/interests, accessed via global store.
 *
 */
const generateAnalysis = async () => {

	const url = "http://127.0.0.1:5000/generate-analysis";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			jobText: jobText.value,
			aboutMeText: aboutMeText.value,
			guid: props.guid
		})
	} );

	const data = await response.json();
	console.log(data);
	analysis.value = data["match_summary"] || "Error generating output.";
	match.value = data["match_decision"] || "Error generating output.";

}

/**
 * After the AI Analysis is updated for a given job, update the value in the database too.
 */
watch(analysis, (newAnalysis) => {

	const db    = getDatabase();
	const jobID = props.id;

	// Send new value to firebase database using update()
	update(dbRef(db, `users/u1/jobs/${jobID}`), {
		"aiAnalysis/summary": newAnalysis,
		"aiAnalysis/decision": match.value
	})
  .then(() => {
    console.log("Data updated successfully");
  })
  .catch((error) => {
    console.error("Error updating data: ", error);
  });

});

</script>

<style scoped>
.label{
	font-size: 20px;
	font-weight: bold;
}

</style>
