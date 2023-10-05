<template>
	<button :class="['btn', type]" @click="action">
	  <!-- Use slots for more flexibility -->
	  <slot>{{ label }}</slot>
	</button>
</template>

<script setup>


	// props: {
	//   label: {
	// 	type: String,
	// 	default: 'Click Me'
	//   },
	//   type: {
	// 	type: String,
	// 	default: 'btn-primary' // default button style
	//   },
	//   action: {
	// 	type: Function,
	// 	default: () => {}
	//   }
	// }

  </script>

  <style scoped>
  /* Basic styling for the button. This can be expanded based on design requirements */
  button {
    display: block;
    padding: 25px 50px;
    margin: 40px auto;
    background-color: #4e935c;
    color: #ffffff;
    border: 1px solid #87bf92;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s;
    text-transform: uppercase;
    font-size: 24px;
    font-weight: bold;
    font-family: 'Raleway', sans-serif;
    letter-spacing: 3px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  }

  button:hover {
    background-color: #0056b3;
  }

  /* Additional button styles can be added as needed */
  </style>
