<template>

	<header class="page-header">
	  <h2>All Jobs</h2>
	</header>

	<div style="margin-top:30px">

		<p>All jobs that have been fetched & saved from Upwork via your Job Feed.</p>

		<v-divider></v-divider>

		<v-data-table
			v-model:expanded="expanded"
			:headers="jobTableHeaders"
			:items="dbJobs"
			item-value="title"
			show-expand
			class="elevation-1"
			:sort-by="[{ key: 'pubDate', order: 'asc' }]"
			>

			<!-- Modal Popup for row deletion confirmation -->
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
				<v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
			</template>

			<template v-slot:expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length">
						<JobData
							:guid="item.guid"
							:title="item.title"
							:link="item.url"
							:description="item.description"
							:budget="item.budget"
							:pubDate="item.pubDate"
							:analysis="item.aiAnalysis.summary"
							:match="item.aiAnalysis.decision"
							:id="item.id"
        		/>
					</td>
				</tr>
			</template>

		</v-data-table>

	</div>

</template>

<script setup>

	import { ref, watch } from 'vue';
	import JobData from './JobData.vue';

  // Setup connection to Firebase Realtime Database
  import { ref as dbRef, remove } from 'firebase/database';
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
		// { title: 'Budget', key: 'budget' },
		{ title: 'Post Date', key: 'pubDate' },
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
