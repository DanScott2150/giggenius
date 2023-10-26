<template>
	<v-data-table
		v-model:expanded="expanded"
		:headers="props.headers"
		:items="props.items"
		item-value="title"
		item-key="guid"
		class="elevation-1"
		:sort-by="props.sortBy"
		show-expand
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
</template>

<script setup>

import { ref, defineProps, watch } from 'vue';
import { ref as dbRef, remove } from 'firebase/database';
import { useDatabase } from 'vuefire';
import JobData from './JobData.vue';
const expanded = ref([]);

const props = defineProps({
  headers: Array,
  items: Array,
  sortBy: Array,
})

const db = useDatabase();
const toDelete = ref({});
const dialogDelete = ref(false);

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
