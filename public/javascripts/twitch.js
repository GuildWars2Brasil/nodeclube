var gw2api = 'https://api.twitch.tv/kraken/streams?game=Guild+Wars+2';
var gw2api_limit = '&limit=5';
var world = gw2api + gw2api_limit;
var br = gw2api + '&language=pt' + gw2api_limit;
var count = 0;

$.getJSON(br, function (data1) {
  $.getJSON(world, function (data2) {

    var output = "<ul>";
    while (count < 5) {

      for (var i in data1.streams) {
        output += '<li class="streamer">' +
          '<span class="logo" style="background-image: url(' + data1.streams[i].channel.logo + ');"</span>' +
          '<span class="name">' + data1.streams[i].channel.display_name + '</span>' +
          '<span class="flag ' + data1.streams[i].channel.language + '"></span>' + '</li>' + '<li class="details">' +
          '<ul><li>' + data1.streams[i].viewers + ' assistindo: <br><strong>' + data1.streams[i].channel.status + '</strong></li>' +
          '<li><a href="' + data1.streams[i].channel.url + '" class="preview" target="_blank">' + '<img src="' +
          data1.streams[i].preview.medium + '"></a></li></ul></li>';
        count++;
      }
      for (var i in data2.streams) {
        output += '<li class="streamer">' +
          '<span class="logo" style="background-image: url(' + data2.streams[i].channel.logo + ');"</span>' +
          '<span class="name">' + data2.streams[i].channel.display_name + '</span>' +
          '<span class="flag ' + data2.streams[i].channel.language + '"></span>' + '</li>' + '<li class="details">' +
          '<ul><li>' + data2.streams[i].viewers + ' assistindo: <br><strong>' + data2.streams[i].channel.status + '</strong></li>' +
          '<li><a href="' + data2.streams[i].channel.url + '" class="preview" target="_blank">' + '<img src="' +
          data2.streams[i].preview.medium + '"></a></li></ul></li>';
        count++;
      }
    }

    output += "</ul>";
    document.getElementById("twitch").innerHTML = output;

    // Click events
	$('#twitch .streamer').first().addClass('active');
	$('#twitch .streamer').first().next('.details').slideDown();
	$('#twitch .streamer').click(function(){
		if($(this).hasClass('active')){
			$(this).next('.details').slideUp();
			$(this).removeClass('active');
		} else {
			$('#twitch .streamer').removeClass('active');
			$('#twitch .streamer').not(this).next('.details').slideUp();
			$(this).next('.details').slideDown();
			$(this).addClass('active');
		}
	});
  });
});
