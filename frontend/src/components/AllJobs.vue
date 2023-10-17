<template>

	<header class="page-header">
	  <h2>All Jobs</h2>
	</header>

	<div style="margin-top:30px">

		<p>All jobs that have been fetched & saved from Upwork via your Job Feed.</p>

		<v-divider></v-divider>

		<JobDataTable
			v-model:expanded="expanded"
			class="elevation-1"
			item-value="title"
			show-expand
			:headers="jobTableHeaders"
			:items="dbJobs"
			:sort-by="[{ key: 'pubDate', order: 'asc' }]"
			>
		</JobDataTable>

	</div>

</template>

<script setup>

	import { ref } from 'vue';

  // Setup connection to Firebase Realtime Database
  import { ref as dbRef } from 'firebase/database';
  import { useDatabase } from 'vuefire'
  import { useDatabaseList } from 'vuefire';
  import JobDataTable from './JobDataTable.vue';

  const db = useDatabase();
  const dbJobs = useDatabaseList(dbRef(db, 'users/u1/jobs'));

  const expanded = ref([]);


const jobTableHeaders = ref([
	{ title: '', key: 'data-table-expand' },
	{ title: 'Job Title', align: 'start', sortable: false, key: 'title' },
	{ title: 'Match', key: 'aiAnalysis.decision' },
	{ title: 'Post Date', key: 'pubDate' },
	{ title: '', key: 'actions', sortable: false },
]);

</script>
