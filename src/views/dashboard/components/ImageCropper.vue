<template>
  <v-container class="image-editor-wrapper">
    <div class="display-2">
      <span v-if="step===1">
        Select your profile photo
      </span>
      <span v-else>
        Select your map banner
      </span>
    </div>
    <div class="img-cropper mt-4">
      <vue-cropper
        ref="cropper"
        :src="image"
        :aspect-ratio="1"
      />
    </div>
    <div class="actions mt-4">
      <v-btn
        v-if="step===1"
        color="success"
        @click="next"
      >
        Next
      </v-btn>
      <v-btn
        v-else
        color="success"
        @click="upload"
      >
        Upload
      </v-btn>
      <v-btn
        color="error"
        @click="cancel"
      >
        Cancel
      </v-btn>
    </div>
  </v-container>
</template>

<script>
  import VueCropper from 'vue-cropperjs'
  import 'cropperjs/dist/cropper.css'

  export default {
    name: 'ImageCropper',
    components: { VueCropper },
    props: {
      image: String,
      cnt: Number,
    },
    data: () => ({
      step: 1,
      squareImg: null,
      rectImg: null,
    }),
    watch: {
      cnt: function (value) {
        this.reset()
      },
    },
    methods: {
      next () {
        this.$refs.cropper.getCroppedCanvas().toBlob(b => {
          this.squareImg = b
          this.step++
          this.$refs.cropper.setAspectRatio(16 / 9)
        }, 'image/jpeg')
      },
      upload () {
        this.$refs.cropper.getCroppedCanvas().toBlob(b => {
          this.rectImg = b
          this.$emit('upload', this.squareImg, this.rectImg)
        }, 'image/jpeg')
      },
      cancel () {
        this.$emit('close')
      },
      reset () {
        this.step = 1
        this.$refs.cropper.replace(this.image)
        this.$refs.cropper.setAspectRatio(1)
      },
    },
  }
</script>

<style lang="sass">
  .image-editor-wrapper
    background-color: white
    text-align: center
</style>
