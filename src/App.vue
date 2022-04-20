<template>
  <div id="app" class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
      <a class="navbar-brand font-weight-bold" href="#">Movie Search</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!--
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
      -->
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
          <h6>Genre &amp; Keywords: </h6>
          <div class="input-group">
            <input v-model="newGenre" @keyup.enter="addGenre" id="movie_genre_keyword" type="text" class="form-control" placeholder="Add genre(s) and keyword(s)..." aria-label="Add an item" aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button @click="addGenre" class="btn btn-outline-secondary" id="enter" type="button">Add</button>
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
          <h6>Cast: </h6>
          <div class="input-group">
            <input v-model="newCast" @keyup.enter="addCast" id="movie_cast" type="text" class="form-control" placeholder="Add cast members..." aria-label="Add an item" aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button @click="addCast" class="btn btn-outline-secondary" id="enter" type="button">Add</button>
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
        <button @click="search" type="button" id="search-btn" class="btn btn-success btn-lg btn-block w-50 center-block">SEARCH</button>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
      </div>
      <!-- End of Left Panel-->


      <!-- Beginning of Right Panel -->
      <div class="right-panel col-md-6 p-0 h-md-100">
        <br><br>
        <div v-if="data">
          <div v-for="(value, index) in data" 
            :key="index"
            :ref="`card_${index}`"
            class="card mb-3 col-md-11">
            <div class="row col-md-12">
              <div class="col">
                <img :src="getPoster(value._source.imdb_id)" class="img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title font-weight-bold">{{value._source.title}}</h5>
                  <p class="card-text">Rating: {{value._source.vote_average}}</p>
                  <p class="card-text">Running Time: {{value._source.runtime}} minutes</p>
                  <p class="card-text">Release Date: {{value._source.release_date}}</p>
                  <p class="card-text font-weight-light">{{value._source.overview}}</p>
                </div>
              </div>
            </div>
            <a class="btn stretched-link" :href="getURL(value._source.imdb_id)"></a>
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
        // let query = encodeURI(this.items.join())
        let query = encodeURI(JSON.stringify(this.obj))
        this.axios.get('http://localhost:5000/search?q='+query)
              .then(response => {
                this.maxScore = response.data.max_score
                this.data = response.data.hits.filter(hit => hit._score > 0.7 * this.maxScore).splice(0,8);
                if(this.obj.director.length > 0) {
                  this.data = this.data.filter(hit => {
                    let crew = hit._source.crew
                    if(crew.filter(member => member.job.toLowerCase() == 'director')[0].name.toLowerCase() == this.obj.director.toLowerCase()) {
                      return hit
                    }
                  })
                }
                // let union = []
                // let intersection = []
                // for (let i in this.data) {
                //   if(this.data[i]._source.symptoms_list.length > 0) {
                //     union = union.concat(this.data[i]._source.symptoms_list)
                //   }
                //   if(i == 0) {
                //     intersection = this.data[i]._source.symptoms_list
                //   } else {
                //     intersection = intersection.filter(x => this.data[i]._source.symptoms_list.includes(x))
                //   }
                // }
                // union = new Set(union)
                // this.recommendations = [...union].filter(x => !intersection.includes(x))
                // this.recommendations = this.recommendations.filter(x => !this.items.includes(x))
                // eslint-disable-next-line no-console
                console.log(response.data.hits)
          })
    },
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
    }, 
    /* Path to movie poster */
    getPoster(imdb_id) {
      return "http://img.omdbapi.com//?apikey=430f6fbe&i=" + imdb_id;
    }, 
    /* Path to imdb page */
    getURL(imdb_id) {
      return "https://www.imdb.com/title/" + imdb_id;
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
  background-color: #F5FBF7; /* Light green */
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

