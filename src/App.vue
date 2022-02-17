<template>
  <div id="app" class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">iCare Symptom Checker</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://www.mayoclinic.org/symptom-checker/select-symptom/itt-20009075">Learn More</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
    <br><br><br>
    <div class="text-center">
      <img src="./assets/med.png" alt="" width="150" height="auto">
      <br><br>
      <h3>What are your symptoms?</h3>
    </div>
    <br>
    <div class="input-group input-group-lg center-block w-50">
      <span class="input-group-text" id="inputGroup-sizing-lg">Search</span>
      <input type="text" 
      class="form-control" 
      aria-label="Sizing example input" 
      aria-describedby="inputGroup-sizing-lg"
      placeholder="Enter here" 
      @keyup.prevent="search"
      v-model="query" />
    </div>

    <div v-if="data" class="card-row">
      <div v-for="(value, index) in data" 
        :key="index"
        :ref="`card_${index}`"
          class="card">
      
        <!-- <img class="card-image" :src="value._source.url"> -->
      
        <div class="card-footer">
          <h3 class="card-title">{{value._source.illness}}</h3>
          <!-- <p class="card-text">by 
            <span class="card-author">{{value._source.og_name}}</span>
          </p> -->
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  data() {
    return {
      query: '',
      data: []
    }
  },
  methods: {
    search() {
        let queryText = ''
        let words = this.query.split(' ')
        queryText = '(' + words[0] + ') '
        if(words.length > 1){
          for(let i = 1; i < words.length; i++){
            if(words[i] != ''){
              queryText = queryText + 'AND' + '(' + words[i] + ')'
            }
          }
        }
        this.axios.get('http://localhost:5000/search?q='+queryText)
              .then(response => {
                this.data = response.data;
          })
        // this.axios.get('http://localhost:5000/search?q='+this.query)
        //       .then(response => {
        //         this.data = response.data;
        //   })
    }
  }
}
</script>

<style>
div.container{text-align: center;}


.container-fluid {
  background-color: #F0F8FF;
}
.center-block {
    display: table;  /* Instead of display:block */
    margin-left: auto;
    margin-right: auto;
}
.card-row {
  display: flex;
  justify-content: center;
  align-items: center;  
  min-width: 780px;
  width: 100%;
  height: 500px;
}
.card {
  position: relative;
  background-color: #FFFFFF;
  height: 370px;
  width: 240px;
  margin: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5);
}
.card-image {
  position: absolute;
  left: -9999px;
  right: -9999px;
  margin: auto;
  height: 220px;
  min-width: 100%;
}
.card-footer {
  position: absolute;
  bottom: 0;
  height: 130px;
  padding: 10px 15px;
  font-family: Helvetica;
}
.card-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
}
.card-title {
  font-family: Serif;
}
.card-author {
  font-size: 14px;
  color: #BAB096;
}
</style>

