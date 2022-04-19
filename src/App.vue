<template>
  <div id="app" class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">Movie Search</a>
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
            <a class="nav-link" href="#">Learn More</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
    
    <div class="fill d-md-flex h-md-100 align-items-start">
      
      <!-- Beginning of Left Panel -->
      <div class="left-panel col-md-6 p-0 h-md-100">
        <br><br><br>
        <div class="text-center">
          <br><br><br>
          <h3>Search Movies</h3>
        </div>
        <br>

        <!-- Title Input Field -->
        <div class="center-block w-50">
          <h6>Title: </h6>
          <div class="input-group">
            <input v-model="obj.title" id="movie_title" type="text" class="form-control" placeholder="Enter the title...">
          </div>
        </div>
        <br>

        <!-- Director Input Field -->
        <div class="center-block w-50">
          <h6>Director: </h6>
          <div class="input-group">
            <input v-model="obj.director" id="movie_director" type="text" class="form-control" placeholder="Enter the director...">
          </div>
        </div>
        <br>

        <!-- Genre & Keyword Input Field & List -->
        <div class="center-block w-50">
          <h6>Genre &amp; Keyword: </h6>
          <div class="input-group">
            <input v-model="newGenre" @keyup.enter="addGenre" id="movie_genre_keyword" type="text" class="form-control" placeholder="Add genre(s) and keyword(s)..." aria-label="Add an item" aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button @click="addGenre" class="btn btn-outline-info" id="enter" type="button">Add</button>
            </div>
          </div> 
        </div>
        <br>
        <div class="center-block w-50">
          <ul class="list-group" id="symptom-list">
            <li v-for="(genre, index) in obj.genres" :key="genre.id" class="list-group-item">
              {{ genre }}
              <button @click="removeGenre(index)" class="close">
                <span>&times;</span> 
              </button>
            </li>
          </ul>
        </div>
        <br>

        <!-- Casts Input Field & List -->
        <div class="center-block w-50">
          <h6>Casts: </h6>
          <div class="input-group">
            <input v-model="newCast" @keyup.enter="addCast" id="movie_cast" type="text" class="form-control" placeholder="Add casts..." aria-label="Add an item" aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button @click="addCast" class="btn btn-outline-info" id="enter" type="button">Add</button>
            </div>
          </div>
        </div>
        <br>
        <div class="center-block w-50">
          <ul class="list-group" id="symptom-list">
            <li v-for="(cast, index) in obj.casts" :key="cast.id" class="list-group-item">
              {{ cast }}
              <button @click="removeCast(index)" class="close">
                <span>&times;</span> 
              </button>
            </li>
          </ul>
        </div>
        <br>
        <button @click="search" type="button" id="search-btn" class="btn btn-primary btn-lg btn-block w-50 center-block">SEARCH</button>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
      </div>
      <!-- End of Left Panel-->


      <!-- Beginning of Right Panel -->
      <div class="right-panel col-md-6 p-0 h-md-100">
        <br><br>
        <div v-if="data" class="card-row columns is-multiline">
          <div v-for="(value, index) in data" 
            :key="index"
            :ref="`card_${index}`"
            class="card column is-3">
          
            <img v-if="value._source.img" class="card-image" :src="value._source.img">
            <img v-else class="card-image" :src="showImage(value._source.illness)">
              
            <div class="card-footer bg-white">
              <h3 class="card-title">{{value._source.illness}}</h3>
              <!-- <p class="card-text">by 
                <span class="card-author">{{value._source.og_name}}</span>
              </p> -->
            </div>

            <a class="btn btn-primary stretched-link" :href="value._source.url"></a>
          </div>
        </div>
      </div>
      <!-- End of Right Panel -->

    </div> 
  </div>
</template>


<script>
export default {
  data() {
    return {
      data: [],
      recommendations: [],
      maxScore: 0,
      newGenre: "",
      newCast:"",
      obj: {
        title: "",
        director: "",
        genres: [],
        casts: []
      },
    }
  },
  methods: {
    search() {
        // let query = encodeURI(this.query);
        let query = encodeURI(this.items.join())
        this.axios.get('http://localhost:5000/search?q='+query)
              .then(response => {
                this.maxScore = response.data.max_score
                this.data = response.data.hits.filter(hit => hit._score > 0.8 * this.maxScore).splice(0,8);
                let union = []
                let intersection = []
                for (let i in this.data) {
                  if(this.data[i]._source.symptoms_list.length > 0) {
                    union = union.concat(this.data[i]._source.symptoms_list)
                  }
                  if(i == 0) {
                    intersection = this.data[i]._source.symptoms_list
                  } else {
                    intersection = intersection.filter(x => this.data[i]._source.symptoms_list.includes(x))
                  }
                }
                union = new Set(union)
                this.recommendations = [...union].filter(x => !intersection.includes(x))
                this.recommendations = this.recommendations.filter(x => !this.items.includes(x))
                // eslint-disable-next-line no-console
                console.log(response.data.hits)
          })
    },
    /*
    showImage(disease) {
      let imgAddress;

      let hash = 0

      for (let i = 0; i < disease.length; i++) {
        hash += parseInt(disease[i].charCodeAt(0));
      }

      let random = (hash % 10)

        switch (random) {
          case 0:
            imgAddress = 'https://revcycleintelligence.com/images/site/article_headers/_normal/2020-01-06_nurses.png';
            break;
          case 1:
            // imgAddress = 'https://imageio.forbes.com/specials-images/imageserve/5edaacf9b6ac5c00076559df/A-stethoscope-and-clipboard-in-a-doctor-s-office-/960x0.jpg?fit=bounds&format=jpg&width=960';
            imgAddress = 'https://revcycleintelligence.com/images/site/article_headers/_normal/2020-01-06_nurses.png';
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
    */
    /* Auxiliary function for showImage() to generate random integers */
    /*
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    */
    /* Add new genres and keywords to list */
    addGenre() {
      if (this.newGenre.length < 50) {
        if(this.obj.genres.length < 20) {
          if (this.newGenre) {
            this.obj.genres.push(this.newGenre);
            this.newGenre = "";
          }
        } else {
          window.alert("Cannot exceed 20 genres or keywords per search.");
          this.newGenre = "";
        }
      } else {
        window.alert("Genres or keywords cannot exceed 50 characters.");
        this.newGenre = "";
      }
    },
    /* Add new casts to list */
    addCast() {
      if (this.newCast.length < 50) {
        if(this.obj.casts.length < 20) {
          if (this.newCast) {
            this.obj.casts.push(this.newCast);
            this.newCast = "";
          }
        } else {
          window.alert("Cannot exceed 20 casts per search.");
          this.newCast = "";
        }
      } else {
        window.alert("Casts cannot exceed 50 characters.");
        this.newCast = "";
      }
    },
    /* Remove genre from list */
    removeGenre(index) {
      this.obj.genres.splice(index, 1);
    }, 
    /* Remove cast from list */
    removeCast(index) {
      this.obj.casts.splice(index, 1);
    }
  }
}
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"; /* Import bulma for showing cards in multi-row */

.suggestions {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-weight: bold;
}

div.container{text-align: center;}

.fill, .left-panel, .right-panel { 
  min-height: 100%;
  height: 100%;
  /*overflow-x: hidden; */  /* Disable cards overflow to the right */
} 

.left-panel {
  background-color: #F0F8FF; /* Light blue */
}

.right-panel {
  background-color: #FFFFFF; /* White */
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
.card-title {
  font-family: Serif;
  font-size: 24px;
}
</style>

