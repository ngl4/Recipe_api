//api key

var apiKey = "ad9411943fc77cb3dcb9f5c1f72654de";
var apiId = "b3505691";

//Declare variables

var searchTerm = "";
var numIngredients = 0;
var numResults = 0;
var numTime = 0;
var chosenSearch = [];
var chosenSearchLess60 = [];

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC9DKpx43Vp_crjyB6Auv2i9QyS2vp5ztI",
  authDomain: "my-project-bb79e.firebaseapp.com",
  databaseURL: "https://my-project-bb79e.firebaseio.com",
  projectId: "my-project-bb79e",
  storageBucket: "",
  messagingSenderId: "519592625731"
};
firebase.initializeApp(config);

var database = firebase.database();

//URL base
var queryURLBase =
  "http://api.edamam.com/search?from=0&to=20&app_id=" +
  apiId +
  "&app_key=" +
  apiKey;

//track number of recipe
recipeCounter = 0;

function runQuery(numSearch, queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    $("#displayResults").empty();

    if (parseInt(numTime) === 30) {
      response.hits.forEach(function(element) {
        if (
          element.recipe.totalTime < numTime &&
          element.recipe.totalTime != 0
        ) {
          chosenSearch.push(element.recipe);
        }
      });
    }

    if (parseInt(numTime) === 60) {
      response.hits.forEach(function(element) {
        if (
          element.recipe.totalTime < numTime &&
          element.recipe.totalTime > 30 &&
          element.recipe.totalTime != 0
        ) {
          chosenSearch.push(element.recipe);
        }
      });
    }

    if (parseInt(numTime) === 120) {
      response.hits.forEach(function(element) {
        if (
          element.recipe.totalTime < numTime &&
          element.recipe.totalTime > 60 &&
          element.recipe.totalTime != 0
        ) {
          chosenSearch.push(element.recipe);
        }
      });
    }

    chosenSearch.slice(0, numSearch).forEach(function(element, i) {

      var calories = Math.round(element.calories / element.yield);

      var displaySection = $("<div>");
      displaySection.attr("id", "recipe-" + i);
      displaySection.addClass("card p-3 m-2 verticalList");

      var displayVideo = $("<div>");
      displayVideo.attr("id","player-"+i);

      var displayVideo1 = $("<div>");
      displayVideo1.attr("id","player1-"+i);

      var displayVideo2 = $("<div>");
      displayVideo2.attr("id","player2-"+i);
      

      var instructionBtn = $("<button>");
      instructionBtn.attr("src", element.url);
      instructionBtn.text("See Instructions");
      instructionBtn.addClass("instructionBtn w-25");

      var youtubeBtn = $("<button>");
      youtubeBtn.attr("name", element.label);
      youtubeBtn.attr("index", i);
      youtubeBtn.text("Show sample videos");
      youtubeBtn.addClass("videoBtn w-25");

      var saveBtn = $("<button>");
      saveBtn.attr("data-title", element.label);
      saveBtn.attr("data-image", element.image);
      saveBtn.attr("data-calories", calories);
      saveBtn.attr("data-ingredientLines", element.ingredientLines);
      saveBtn.attr("data-dietLabel", element.dietLabels);
      saveBtn.attr("data-healthLabel", element.healthLabels);
      saveBtn.attr("data-url", element.url);
      saveBtn.text("Save to Collections");
      saveBtn.addClass("saveBtn w-25");

      $("#displayResults").append(displaySection);

      //Attach the content to the appropriate div
      $("#recipe-" + i).append("<h3>" + element.label.toUpperCase() + "</h3>");
      $("#recipe-" + i).append(
        "<h5>" +
          element.healthLabels.join(" ") +
          " [ <i>" +
          element.dietLabels.join(" ") +
          " </i>]" +
          "</h5>"
      );
      $("#recipe-" + i).append(
        "<p>" + element.ingredientLines.join("\n") + "</p>"
      );
      $("#recipe-" + i).append(
        "<img class= 'rounded float-left w-25 h-50' src='" +
          element.image +
          "'></img>"
      );
      $("#recipe-" + i).append(
        "<h5> Total Calories/person: " + calories + "</h5>"
      );
      $("#recipe-" + i).append(instructionBtn);
      $("#recipe-" + i).append(youtubeBtn);
      $("#recipe-" + i).append(saveBtn);
      $("#recipe-" + i).append(displayVideo);
      $("#recipe-" + i).append(displayVideo1);
      $("#recipe-" + i).append(displayVideo2);
    });
  });
}

$("#searchBtn").on("click", function() {
  chosenSearch = [];

  searchTerm = $("#searchTerm")
    .val()
    .trim();

  numResults = $("#numResults").val();

  numTime = $("#numTime").val();

  var newURL = queryURLBase + "&q=" + searchTerm;

  runQuery(parseInt(numResults), newURL);

  return false;
});

$(document).on("click", ".instructionBtn", function() {
  var url = $(this).attr("src");
  window.open(url);
});

$(document).on("click", ".saveBtn", function() {
  var title = $(this).attr("data-title");
  var image = $(this).attr("data-image");
  var calories = $(this).attr("data-calories");
  var dietLabel = $(this).attr("data-dietLabel");
  var healthLabel = $(this).attr("data-healthLabel");
  var url = $(this).attr("data-url");

  database.ref().push({
    title: title,
    image: image,
    calories: calories,
    dietLabel: dietLabel,
    healthLabel: healthLabel,
    url: url,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

var videoIdArray = [];

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$(document).on("click", ".videoBtn", function() {
  videoIdArray = [];
  var name = $(this).attr("name");
  var index = $(this).attr("index");
  var queryURL =
    "https://www.googleapis.com/youtube/v3/search?q=" +
    name +
    "&part=snippet&key=AIzaSyAcwzTei_3ijB48GQzlph93ht_rExhGKM4";
    
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .done(function(result) {


      result.items.forEach(function(element) {

        videoIdArray.push(element.id.videoId);

      });

      console.log(videoIdArray);

      function onYouTubeIframeAPIReady() {
        player = new YT.Player("player-"+index, {
          height: "290",
          width: "540",
          videoId: videoIdArray[0],
          events: {
            'onReady': onPlayerReady
          }
        });
        
      }

      function onYouTubeIframeAPIReady1() {
        player1 = new YT.Player("player1-"+index, {
          height: "290",
          width: "540",
          videoId: videoIdArray[1],
          events: {
            'onReady': onPlayerReady
          }
        });
      }

      function onYouTubeIframeAPIReady2() {
        player2 = new YT.Player("player2-"+index, {
          height: "290",
          width: "540",
          videoId: videoIdArray[2],
          events: {
            'onReady': onPlayerReady
          }
        });
      }

      // The API will call this function when the video player is ready.
      var done = false;
      function onPlayerReady(event) {
        if (done) {
          event.target.playVideo();
          done = true;
        }
      }

      onYouTubeIframeAPIReady();
      onYouTubeIframeAPIReady1();
      onYouTubeIframeAPIReady2();
    })
    .fail(function(err) {
      throw err;
    });
});
