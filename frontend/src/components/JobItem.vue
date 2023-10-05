<template>
	<div class="job-item">
		<h3 class="section-header__primary">{{ props.title }}</h3>

		<div class="job-item-container">
			<div v-if="isVisible">
				<span class="label">Description:</span>
				<div v-html="props.description"></div>
			</div>
			<div v-if="isVisible">
				<span class="label">Posted on:</span>
				{{ props.pubDate }}
			</div>
			<ButtonComponent label="AI Analyze" :action="generateAnalysis" />
			<!-- <ButtonComponent label="Generate Proposal" :action="generateProposal" /> -->
			<div>
				<span class="label">AI Analysis:</span>
				<div v-html="analysis"></div>
			</div>
			<!-- <button class="btn btn-primary" v-if="isVisible" @click="generateProposal">Generate Proposal For this Job >>></button> -->
		</div>
	</div>
</template>

<script setup>
import { ref, defineProps, onMounted, onUpdated } from 'vue';
import { useProposalStore } from '../store';
import { useRouter } from 'vue-router';

import ButtonComponent from './base/Button2.vue'

const isVisible = ref(true);

const router = useRouter();
const props = defineProps([
	'title',
	'link',
	'description',
	'pubDate',
	'guid'
]);

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "asdf"; //will fetch from python endpoint

const analysis = ref(null);
const proposalStore = useProposalStore();

const aboutMeText   = ref(proposalStore.aboutMeText);
const jobText = ref(props.description);

const generateProposal = async() => {

	const response = await fetch("http://127.0.0.1:5000/ping", { method: "GET" });
	console.log(response);
	const message = await response.json();
	console.log(message);

	// const message = await response.json();
	// console.log(message);

	// proposalStore.setTargetJobText(props.description);
	// router.push('/generate-proposal');
}

onMounted( async() => {

	const job = {
		aboutMeText: aboutMeText.value,
		jobText: jobText.value,
		guid: props.guid
	}

	analysis.value = await generateAnalysis(job);

});

onUpdated( () => {
	if (analysis.value){
		const ID = props.guid;
		const decisionSpan = document.getElementById(`${ID}`) || null;

		if( decisionSpan && decisionSpan.innerText === 'Not a Candidate' ) {
			isVisible.value = false;
		}
		if( decisionSpan && decisionSpan.innerText === 'Weak Candidate' ) {
			isVisible.value = false;
		}
	}
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
.job-item {
	padding: 15px;
	margin: 15px 0;
}

.job-item-container{
    width: 90%;
    padding: 25px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-top: 0;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}
.job-item-container div{
	margin-bottom: 25px;
}
.label{
	font-size: 20px;
	font-weight: bold;
}

</style>
