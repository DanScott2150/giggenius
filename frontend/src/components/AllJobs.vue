<template>

	<header class="page-header">
	  <h2>All Jobs</h2>
	</header>

	<v-divider></v-divider>

	<div style="margin-top:30px">

	  <div>
		<p>All jobs that have been fetched & saved from Upwork via your Job Feed.</p>
	  </div>

	  <br/>
	  <v-divider></v-divider>


	<v-expansion-panels multiple>
	  <v-expansion-panel
		color="light-green"
		v-for="job in dbJobs"
		:title="job.title"
		:key="job.guid"
	  >
		<v-expansion-panel-text>
		 <p>{{ job.title }}</p>
		 <p>{{ job.description }}</p>
		</v-expansion-panel-text>
	  </v-expansion-panel>

	</v-expansion-panels>

	</div>

  </template>

  <script setup>
  import axios from 'axios';

  // Setup connection to Firebase Realtime Database
  import { useDatabase } from 'vuefire'
  import { useDatabaseList } from 'vuefire';
  import { ref as dbRef, push, get, query } from 'firebase/database';

  const db = useDatabase();
  const dbJobs = useDatabaseList(dbRef(db, 'users/u1/jobs'));


  </script>
