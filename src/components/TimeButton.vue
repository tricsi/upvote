<template>
    <button :disabled="!active">
        <slot v-if="!label && active"></slot>
        <span v-else>{{ label }}</span>
    </button>
</template>

<script>

export default {

    props: [ 'available', 'expire' ],

    data() {
        return {
            active: false,
            label: '',
        };
    },

    created() {
        this.interval = window.setInterval(this.validate, 1000);
        this.validate();
    },

    beforeDestroy() {
        if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = undefined;
        }
    },

    methods: {
        validate() {
            const time = new Date().getTime();
            const expire = parseInt(this.expire) || 0;
            const available = parseInt(this.available) || 0;
            if (expire && expire < time) {
                this.label = "Expired";
                this.active = false;
            } else if (available && available > time) {
                const sec = Math.round((available - time) / 1000);
                this.label = `${Math.floor(sec / 60)}:${sec % 60}`;
                this.active = false;
            } else {
                this.label = "Submit";
                this.active = true;
            }
        }
    }
}
</script>
