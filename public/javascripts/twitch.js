var count = 0;
var output = "<ul>";
var array = [];

var buildurl = function(lang, limit){
  return 'https://api.twitch.tv/kraken/streams?game=Guild+Wars+2&language=' + lang
  + '&limit=' + limit;
}

var logo = function(obj){
  output += '<span class="logo" style="background-image: url('
    + obj.channel.logo + ');"</span>';
};

var nam = function(obj){
  output += '<span class="name">' + obj.channel.display_name + '</span>';
};

var flag = function(obj){
  output += '<span class="flag ' + obj.channel.language + '"></span></li>';
};

var views = function(obj){
  output += '<ul><li>' + obj.viewers + ' assistindo: <br>';
};

var title = function(obj){
  output += '<strong>' + obj.channel.status + '</strong></li>'
};

var image = function(obj, l){
  output += '<li><a href="' + l + '" class="preview" target="_blank">' + '<img src="' +
  obj.preview.medium + '"></a></li>';
};

var channelUrl = function(obj){
  return obj.channel.url;
};

var url1 = buildurl('pt', 5);
var url2 = buildurl('en', 5);

var request1 = new XMLHttpRequest();
request1.open('GET', url1, true);
var request2 = new XMLHttpRequest();
request2.open('GET', url2, true);

var goGo = function(req) {
  if (req.status >= 200 && req.status < 400) {
    var data = JSON.parse(req.responseText);
    for(var i in data.streams){
      output += '<li class="streamer" onclick="dodajAktywne(this)">';
      logo(data.streams[i]);
      nam(data.streams[i]);
      flag(data.streams[i]);
      output += '<li class="details">';
      views(data.streams[i]);
      title(data.streams[i]);
      image(data.streams[i], channelUrl(data.streams[i]));
      output += '</ul></li>';
      array[count] = output;
      count++;
    }
    document.getElementById("twitch").innerHTML = array[4];
    initActive();
  }
  else{

  }
};

request1.onload = function(){
  goGo(request1);
};
request2.onload = function(){
  goGo(request2);
};

var streamer = [];
var details = [];

 var initActive = function (){
  streamer = document.getElementById('twitch').getElementsByClassName('streamer');
  details = document.getElementById('twitch').getElementsByClassName('details');

  streamer[0].classList.add('active');
  details[0].classList.add('list');
};
window.onload = function(){
  request1.send();
  request2.send();
  };

 // Click events
function dodajAktywne(elem) {
    // get all 'a' elements
    var streamer = document.getElementById('twitch').getElementsByClassName('streamer');
    var details = document.getElementById('twitch').getElementsByClassName('details');
    // loop through all 'a' elements
    for (i = 0; i < streamer.length; i++) {
        // Remove the class 'active' if it exists
        streamer[i].classList.remove('active');
  details[i].classList.remove('list');
    }
    // add 'active' classs to the element that was clicked
    elem.classList.add('active');
    elem.nextSibling.classList.add('list');
};