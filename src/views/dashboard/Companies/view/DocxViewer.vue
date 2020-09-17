<template>
  <iframe
    :src="`https://view.officeapps.live.com/op/embed.aspx?src=${$route.query.docxUrl}`"
    frameborder="0"
  >
    This is an embedded
    <a target="_blank" href="http://office.com">Microsoft Office</a>
    document, powered by
    <a target="_blank" href="http://office.com/webapps">Office Online</a>.
  </iframe>
</template>

<style lang="sass" scoped>
iframe
  width: 100%
  height: 100vh
</style>
