<template>
  <div id="app">
    <b-navbar style="background-color:wheat;border-radius:10px;">
      <br><br>
      <img class="img-logo1" src="./assets/行政院人事行政總處區塊鏈驗證系統logo.png">
    </b-navbar>
    <div style="position:relative;top:-1vw"><router-view/></div>
    <footer class="footer">
      <div class="pull-center text-center" style="margin:10px">
        <img class="img-logo2" src="./assets/nchc-bclab-v8-2-colors.png"><br>
        &copy; 2018, 國家高速網路與計算中心
        <a href="https://www.nchc.org.tw/tw/" target="_blank">NCHC</a>.
        Designed by <a href="#" target="_blank">Blockchain Lab</a>.
        <br>最佳瀏覽建議： Chrome 瀏覽器 ♦ 最佳解析度：1280x768
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
  #app {
    //font-family:"Microsoft JhengHei", "Arial", sans-serif; 
    font-size:10px; 
    line-height:28px;
    height:auto;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    // -webkit-font-smoothing: antialiased;
    // -moz-osx-font-smoothing: grayscale;
    text-align: center;
    //background-size:auto;  
    background-color: wheat;
  }
  .footer{
    background-color: wheat;
    font-family:"Microsoft JhengHei", "Arial", sans-serif; 
    font-size:13px; 
    width:100%;
    position:relative;
    bottom:0px;
    line-height:15px;
    height: auto;
  }
  .img-logo1 {
  position: relative;
  left: -20vw;
  max-width:66%;
  max-height:66%;
  }
  .img-logo2 {
  max-width:15%;
  max-height:15%;
  }
  

</style>
