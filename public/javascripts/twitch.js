(function () {
  "use strict";

  var
    buildurl = function (lang, limit) {
      return "https://api.twitch.tv/kraken/streams?game=Guild+Wars+2&language=" + lang + "&limit=" + limit;
    },
    logo = function (obj) {
      return "<span class=\"logo\" style=\"background-image: url(" + obj.channel.logo + ");\"</span>";
    },
    nam = function (obj) {
      return "<span class=\"name\">" + obj.channel.display_name + "</span>";
    },
    flag = function (obj) {
      return "<span class=\"flag " + obj.channel.language + "\"></span></li>";
    },
    views = function (obj) {
      return "<ul><li>" + obj.viewers + " assistindo: <br>";
    },
    title = function (obj) {
      return "<strong>" + obj.channel.status + "</strong></li>";
    },
    image = function (obj, l) {
      return "<li><a href=\"" + l + "\" class=\"preview\" target=\"_blank\">" + "<img src=\"" +
        obj.preview.medium + "\"></a></li>";
    },
    channelUrl = function (obj) {
      return obj.channel.url;
    },
    url1 = buildurl("pt", 5),
    url2 = buildurl("en", 5),
    request1 = new XMLHttpRequest(),
    request2 = new XMLHttpRequest(),
    initActive = function () {
      var streamer = [],
        details = [];
      streamer = document.getElementById("twitch").getElementsByClassName("streamer");
      details = document.getElementById("twitch").getElementsByClassName("details");
      if (streamer.length > 0) {
        streamer[0].classList.add("active");
        details[0].classList.add("list");
      }
    },
    goGo = function (req) {
      req = req.target;
      if (req.status >= 200 && req.status < 400) {
        var data = JSON.parse(req.responseText),
          twitch = document.getElementById("twitch");
        twitch.getElementsByTagName("ul")[0].innerHTML = "";
        data.streams.forEach(function (stream) {
          var streamer = document.createElement('li'),
            details = document.createElement('li');

          streamer.classList.add("streamer");
          streamer.setAttribute("onclick", "dodajAktywne(this)");
          streamer.innerHTML = logo(stream);
          streamer.innerHTML += nam(stream);
          streamer.innerHTML += flag(stream);
          twitch.getElementsByTagName("ul")[0].appendChild(streamer);

          details.classList.add("details");
          details.innerHTML += views(stream);
          details.innerHTML += title(stream);
          details.innerHTML += image(stream, channelUrl(stream));
          twitch.getElementsByTagName("ul")[0].appendChild(details);
        });
        initActive();
      }
    };

  request1.open("GET", url1, true);
  request2.open("GET", url2, true);

  request1.onload = goGo;
  request2.onload = goGo;

  window.docReady(function () {
    document.getElementById("twitch").innerHTML = "<ul>Carregando...</ul>";
  });

  window.onload = function () {
    request1.send();
    request2.send();
  };

  // Click events
  window.dodajAktywne = function (elem) {
    // get all "a" elements
    var streamer = document.getElementById("twitch").getElementsByClassName("streamer"),
      details = document.getElementById("twitch").getElementsByClassName("details"),
      count;
    // loop through all "a" elements
    for (count = 0; count < streamer.length; count = count + 1) {
      // Remove the class "active" if it exists
      streamer[count].classList.remove("active");
      details[count].classList.remove("list");
    }
    // add "active" classs to the element that was clicked
    elem.classList.add("active");
    elem.nextSibling.classList.add("list");
  };
}());
