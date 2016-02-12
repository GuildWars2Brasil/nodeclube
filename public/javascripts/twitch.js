(function () {
  "use strict";

  var
    buildurl = function (lang, limit) {
      return "https://api.twitch.tv/kraken/streams?game=Guild+Wars+2&language=" + lang + "&limit=" + limit;
    },
    name = function (obj) {
      var name = document.createElement("span");
      name.classList.add("name");
      name.innerHTML = obj.channel.display_name;
      return name;
    },
    flag = function (obj) {
      var flag = document.createElement("span");
      flag.classList.add("flag");
      flag.classList.add(obj.channel.language);
      return flag;
    },
    logo = function (obj) {
      var logo = document.createElement("span");
      logo.classList.add("logo");
      logo.setAttribute("style", "background-image: url(" + obj.channel.logo + ")");
      logo.appendChild(name(obj));
      logo.appendChild(flag(obj));
      return logo;
    },
    title = function (obj) {
      var title = document.createElement("strong");
      title.innerHTML = obj.channel.status;
      return title;
    },
    views = function (obj) {
      var views = document.createElement("li"),
        br = document.createElement("br");
      views.innerHTML = obj.viewers + " assistindo: ";
      views.appendChild(br);
      views.appendChild(title(obj));
      return views;
    },
    image = function (obj, l) {
      var li = document.createElement("li"),
        link = document.createElement("a"),
        img = document.createElement("img");
      img.src = obj.preview.medium;

      link.href = l;
      link.classList.add("preview");
      link.target = "_blank";
      link.appendChild(img);

      li.appendChild(link);
      return li;
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
          twitch = document.getElementById("twitch").getElementsByTagName("ul")[0];

        twitch.innerHTML = "";
        data.streams.forEach(function (stream) {
          var streamer = document.createElement("li"),
            details = document.createElement("li"),
            details_inner = document.createElement("ul");

          streamer.classList.add("streamer");
          streamer.setAttribute("onclick", "dodajAktywne(this)");
          streamer.appendChild(logo(stream));

          twitch.appendChild(streamer);

          details.classList.add("details");
          details_inner.appendChild(views(stream));
          details_inner.appendChild(image(stream, channelUrl(stream)));
          details.appendChild(details_inner);

          twitch.appendChild(details);
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
