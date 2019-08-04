<template>
  <h1>{{code}} {{message}}</h1>
</template>

<script>
export default {
  props: {
    code: { type: String },
    message: { type: String }
  }
};
</script>
