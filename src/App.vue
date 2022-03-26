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
    <div class="center-block w-25">
      <div class="input-group">
        <input v-model="newItem" @keyup.enter="addItem" id="userinput" type="text" class="form-control" placeholder="Add a symptom..." aria-label="Add an item" aria-describedby="basic-addon2">
        <div class="input-group-append">
          <button @click="addItem" class="btn btn-outline-info" id="enter" type="button">Add</button>
        </div>
      </div>
    </div>
    <br>
    <div class="center-block w-25">
      <ul class="list-group" id="symptom-list">
        <li v-for="(item, index) in items" :key="item.id" class="list-group-item">
          {{ item.symptom }}
          <button @click="removeItem(index)" class="close">
            <span>&times;</span> 
          </button>
        </li>
      </ul>
    </div>
    <br>
    <button type="button" class="btn btn-primary btn-lg btn-block w-25 center-block">SEARCH</button>
    <br>
    <br>
    <br>

    <!-- Old input box -->
    <!--div class="input-group input-group-lg center-block w-50">
      <span class="input-group-text" id="inputGroup-sizing-lg">Search</span>
      <input type="text" 
      class="form-control" 
      aria-label="Sizing example input" 
      aria-describedby="inputGroup-sizing-lg"
      placeholder="Enter here" 
      @keyup.prevent="search"
      v-model="query" />
    </div> -->

    <div v-if="data" class="card-row">
      <div v-for="(value, index) in data" 
        :key="index"
        :ref="`card_${index}`"
          class="card">
      
        <img v-if="value._source.img" class="card-image" :src="value._source.img">
        <img v-else class="card-image" :src="showImage()">
      
        <div class="card-footer">
          <h3 class="card-title">{{value._source.illness}}</h3>
          <!-- <p class="card-text">by 
            <span class="card-author">{{value._source.og_name}}</span>
          </p> -->
        </div>

        <a class="btn btn-primary stretched-link" :href="value._source.url"></a>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      query: '',
      data: [],
      maxScore: 0,
      items: [
        // Stores user input list items, eg. {id: 1, symptom: "Fever"}
      ],
      newItem: "",
    }
  },
  methods: {
    search() {
        let query = encodeURI(this.query);
        this.axios.get('http://localhost:5000/search?q='+query)
              .then(response => {
                this.maxScore = response.data.max_score
                this.data = response.data.hits.filter(hit => hit._score > 0.8 * this.maxScore).splice(0,8);
                // eslint-disable-next-line no-console
                console.log(this.data)
                // eslint-disable-next-line no-console
                console.log(response.data.hits)
          })
    },
    showImage() {
      let imgAddress;
      let random = this.getRandomInt(0,9);
        switch (random) {
          case 0:
            imgAddress = 'https://revcycleintelligence.com/images/site/article_headers/_normal/2020-01-06_nurses.png';
            break;
          case 1:
            imgAddress = 'https://imageio.forbes.com/specials-images/imageserve/5edaacf9b6ac5c00076559df/A-stethoscope-and-clipboard-in-a-doctor-s-office-/960x0.jpg?fit=bounds&format=jpg&width=960';
            break;
          case 2:
            imgAddress = 'https://www.cdc.gov/diseasesconditions/images/cards/covid19.jpg?_=56306';
            break;
          case 3:
            imgAddress = 'https://www.mei.edu/sites/default/files/2019-01/Virus.jpg';
            break;
          case 4:
            imgAddress = 'https://www.verywellhealth.com/thmb/0zMhQRr2MYoD0YBUvH77iGrrX-k=/1080x1080/filters:fill(87E3EF,1)/IlloDot_InfectiousDiseases-0fc3a9d79c1345da8858ad5f7ec2cba3.png';
            break;
          case 5:
            imgAddress = 'https://www.scripps.edu/_files/images/science-and-medicines/translational-institute/600x400_viral_infecteous_disease_3d_graphic.jpg';
            break;
          case 6:
            imgAddress = 'https://www.merck.com/wp-content/uploads/sites/5/2020/02/infection-disease.jpeg?resize=666,664';
            break;
          case 7:
            imgAddress = 'https://sadarpsych.com/wp-content/uploads/2019/11/illness-vs-disease.jpg';
            break;
          case 8:
            imgAddress = 'https://media.istockphoto.com/photos/modern-empty-temporary-intensive-care-emergency-room-is-ready-to-picture-id1295301481?b=1&k=20&m=1295301481&s=170667a&w=0&h=2W-5mbvRju-L4DE-fzGlhHRWhX5fS72MjUcVwj0_jvg=';
            break;
          case 9:
            imgAddress = 'https://www.news-medical.net/image.axd?picture=2021%2F5%2Fshutterstock_1535690891.jpg';
            break;
      }
      return imgAddress;
    }, 
    /* Auxiliary function for showImage() to generate random integers */
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    /* Add user input item to list */
    addItem() {
      if (this.newItem) {
        this.items.push({
          symptom: this.newItem
        });
        this.newItem = "";
      }
    },
    /* Remove item from list */
    removeItem(index) {
      this.items.splice(index, 1);
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

