<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<p class="label">Job Information:</p>
				<div v-html="props.description"></div>
			</v-col>
			<v-col cols="4">

				<p class="label">Match:</p>
				<div v-if="props.match" v-html="match"></div>
				<div v-else>Loading...</div>

				<p class="label">AI Analysis:</p>
				<div v-if="isLoading">
					<v-progress-circular indeterminate></v-progress-circular>
				</div>
				<div v-if="props.match"  v-html="analysis"></div>
				<div v-else>Loading...</div>
				<ButtonComponent label="AI Analyze" :action="generateAnalysis" />

				<v-divider class="my-10"></v-divider>

				<p class="label">Posted on:</p>
				<p>{{ outputDate }}</p>

				<p class="label">Budget:</p>
				<p>{{ props.budget }}</p>

			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { ref, defineProps, watch, onMounted, onUpdated, onUnmounted } from 'vue';
import { ref as dbRef, getDatabase, update } from 'firebase/database';
import { useProposalStore } from '../store';
import ButtonComponent from './base/Button2.vue'

console.log("setup");

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

// Add console log to onMount() vue hook
onMounted(() => {
	console.log("mount");
})

// Add console log to onUpdated() vue hook
onUpdated(() => {
	console.log("update");
})

// Add console log to onUnmounted() vue hook
onUnmounted(() => {
	console.log("unmount");
})

// console.log(props);

const dbDate = new Date(props.pubDate);
const outputDate = dbDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const analysis      = ref(props.analysis);
const match         = ref(props.match);
const jobText       = ref(props.description);
const proposalStore = useProposalStore();
const aboutMeText   = ref(proposalStore.aboutMeText);
const isLoading     = ref(false);

/**
 * Generates the AI analysis for a given job. API call to flask server which connects to OpenAI.
 *
 * @param {string} jobText - The text of the job description, accessed via props, which pull from the database.
 * @param {string} aboutMeText - The text of the user skills/experience/interests, accessed via global store.
 *
 */
const generateAnalysis = async () => {

	isLoading.value = true;

	const url = "http://127.0.0.1:5000/generate-analysis";

	try {
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
		match.value = data["match_decision"] || "";
	} catch (error) {
		console.error(error);
		analysis.value = "There was an error generating the analysis. Please try again.";
		match.value = "";
	} finally {
		isLoading.value = false;
	}


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
