//api key

var apiKey = "68d16f10adfdfaed91c7325de496ce48";
var apiId = "7f4b800a";

//Declare variables

var searchTerm = "";
var numIngredients = 0;
var numResults = 0;
var numTime = 0;
var chosenSearch = [];
var chosenSearchLess60 = [];

//URL base
var queryURLBase =
  "http://api.edamam.com/search?from=0&to=70&app_id=7f4b800a&app_key=68d16f10adfdfaed91c7325de496ce48";

//track number of recipe
recipeCounter = 0;

function runQuery(numSearch, queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    if (parseInt(numTime) === 30) {
      response.hits.forEach(function(element, i) {
        if (
          element.recipe.totalTime < numTime &&
          element.recipe.totalTime != 0
        ) {
          chosenSearch.push(element);
        }
      });
    }

    if (parseInt(numTime) === 60) {
        response.hits.forEach(function(element, i) {
          if (
            element.recipe.totalTime < numTime && element.recipe.totalTime > 30 && 
            element.recipe.totalTime != 0
          ) {
            chosenSearch.push(element);
          }
        });
      }

      if (parseInt(numTime) === 120) {
        response.hits.forEach(function(element, i) {
          if (
            element.recipe.totalTime < numTime && element.recipe.totalTime > 60 && 
            element.recipe.totalTime != 0
          ) {
            chosenSearch.push(element);
          }
        });
      }

    console.log(chosenSearch);

    console.log(chosenSearch.slice(0, numSearch));
  });
}

$("#searchBtn").on("click", function() {
  chosenSearch = [];

  searchTerm = $("#searchTerm")
    .val()
    .trim();

  console.log(searchTerm);

  numResults = $("#numResults").val();

  console.log(numResults);

  numTime = $("#numTime").val();

  console.log(parseInt(numTime));

  var newURL = queryURLBase + "&q=" + searchTerm;

  console.log(newURL);

  runQuery(numResults, newURL);

  return false;
});
