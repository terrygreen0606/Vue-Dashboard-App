<template>
  <div>
    <input
      ref="file"
      type="file"
      class="d-none"
      @change="uploadImage"
    >
    <v-card
      :class="previewImg ? 'success--text' : 'grey--text'"
      class="mx-auto d-inline-flex profile-photo"
      outlined
      shaped
      @click="$refs.file.click()"
    >
      <v-img
        v-if="previewImg"
        :src="previewImg"
        height="100%"
        width="100%"
      />
      <v-icon
        v-else
        class="mx-auto"
        size="96"
      >
        {{ icon }}
      </v-icon>
    </v-card>
    <div class="font-weight-bold grey--text">
      CHOOSE PICTURE
    </div>
    <v-dialog
      v-model="cropper.show"
      max-width="700"
    >
      <image-cropper
        :image="cropper.image"
        :cnt="cropper.cnt"
        @close="cropper.show = false"
        @upload="uploadCroppedImages"
      />
    </v-dialog>
  </div>
</template>

<script>
  export default {
    components: {
      ImageCropper: () => import('../ImageCropper'),
    },
    props: {
      squareImg: {
        type: Blob,
      },
      rectImg: {
        type: Blob,
      },
      icon: {
        type: String,
        default: 'mdi-account',
      },
    },
    data: () => ({
      cropper: {
        show: false,
        image: null,
        cnt: 0,
      },
      previewImg: null,
    }),
    methods: {
      uploadImage (event) {
        const file = event.target.files[0]
        if (file.type.indexOf('image/') !== -1) {
          const fileReader = new FileReader()
          fileReader.onload = e => {
            this.cropper.image = e.target.result
            this.cropper.cnt++
            this.cropper.show = true
          }
          fileReader.readAsDataURL(file)
        }
        event.target.value = null
      },
      uploadCroppedImages (squareImg, rectImg) {
        this.cropper.show = false
        const fileReader = new FileReader()
        fileReader.onload = e => {
          this.previewImg = e.target.result
        }
        fileReader.readAsDataURL(squareImg)
        this.$emit('update:rectImg', rectImg)
        this.$emit('update:squareImg', squareImg)
      },
    },
  }
</script>
