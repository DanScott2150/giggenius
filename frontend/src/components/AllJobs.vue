<template>

	<header class="page-header">
	  <h2>All Jobs</h2>
	</header>

	<div style="margin-top:30px">

		<div>
			<p>All jobs that have been fetched & saved from Upwork via your Job Feed.</p>
		</div>

		<br/>

		<v-divider></v-divider>

		<v-data-table
			v-model:expanded="expanded"
			:headers="jobTableHeaders"
			:items="dbJobs"
			item-value="title"
			show-expand
			class="elevation-1"
			:sort-by="[{ key: 'budget, post-date', order: 'asc' }]"
			>

			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>All Saved Jobs</v-toolbar-title>

					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
								<v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>

			<template v-slot:item.actions="{ item }">
				<v-icon
					size="small"
					@click="deleteItem(item)"
				>
					mdi-delete
				</v-icon>
			</template>

			<template v-slot:expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length">
						{{ item.description }}
					</td>
				</tr>
			</template>

		</v-data-table>

		<v-divider></v-divider>



		<!-- <v-expansion-panels multiple>
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

		</v-expansion-panels> -->

	</div>

</template>

<script setup>

	import { ref, watch } from 'vue';

  // Setup connection to Firebase Realtime Database
  import { ref as dbRef, remove, push, get, query } from 'firebase/database';
  import { useDatabase } from 'vuefire'
  import { useDatabaseList } from 'vuefire';

  const db = useDatabase();
  const dbJobs = useDatabaseList(dbRef(db, 'users/u1/jobs'));

  const toDelete = ref({});
	const expanded = ref([]);
	const dialogDelete = ref(false);

	const jobTableHeaders = ref([
		{ title: '', key: 'data-table-expand' },
		{ title: 'Job Title', align: 'start', sortable: false, key: 'title' },
		{ title: 'Budget', key: 'budget' },
		{ title: 'Post Date', key: 'post-date' },
		{ title: '', key: 'actions', sortable: false },
	]);

	watch(dialogDelete, (val) => {
		val || closeDelete();
	});

	const deleteItem = function(item) {
		toDelete.value = item;
		dialogDelete.value = true;
	}

	const deleteItemConfirm = function() {
		let jobRef = dbRef(db, `users/u1/jobs/${toDelete.value.id}`);
		remove(jobRef);
		closeDelete()
	}

	const closeDelete = function() {
		dialogDelete.value = false
	}

</script>
