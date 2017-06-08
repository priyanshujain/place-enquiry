
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ", " + cityStr;

    // load streetview
    $greeting.text('So you want to live at ' + address + ' ?');
    var streetviewUrl =  'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // YOUR CODE GOES HERE!
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=67a50bc408634f708a1c1e0234dc6a94';

    $.getJSON(url, function(data){
      $nytHeaderElem.text('Newyork Times articles about ' + cityStr);
      articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append("<li class='" + article + "'>" + '<a href="' + article.web_url +'">' + article.headline.main + '</a>'+'<p>' + article.snippet + '</p>' + "</li>");
      }
  //     var items = [];
  // $.each( data, function( key, val ) {
  //   items.push( "<li id='" + key + "'>" + val + "</li>" );
  // });
  //
  // $( "<ul/>", {
  //   "class": "article-list",
  //   html: items.join( "" )
  // }).appendTo( "body" );
      console.log(data);
    }).error(function(e){
      $nytHeaderElem.text("This text could not be loaded.");
    });

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text("Timeout!, Failed to load data.");
    }, 1000);

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      //jsonp: callback,
      success: function(response){
        var articleList = response[1];

        for (var i = 0; i < articleList.length; i++) {
          var articleStr = articleList[i];
          var uurl = 'https://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="' + uurl + '">' + articleStr + '</a></li>' );
        };
        clearTimeout(wikiRequestTimeout);
      }
    });

    return false;
};

$('#form-container').submit(loadData);
