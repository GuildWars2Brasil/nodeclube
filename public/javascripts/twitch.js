var gw2api='https://api.twitch.tv/kraken/streams?game=Guild+Wars+2';
var gw2api_limit= 5;
var gw2api_lang='pt';
var world= gw2api + '&limit=' + gw2api_limit;
var br= gw2api + '&language=' + gw2api_lang + '&limit=' + gw2api_limit;

$.getJSON(br, function(data1) {
    $.getJSON(world, function(data2) {

        var output="<ul>";
        for (var i in data1.streams) {
            output+='<li class="streamer">' +
            '<span class="name">' + data1.streams[i].channel.display_name + '</span>' +
            '<span class="flag' + data1.streams[i].channel.language + '"></span>' + '</li>'
            + '<li class="details">' +
            '<ul><li>' + data1.streams[i].viewers + ' assistindo: <br><strong>' + data1.streams[i].channel.status + '</strong></li>' +
            '<li><a hrf="' + data1.streams[i].channel.url + '" class="preview">' + '<img src="' +
            data1.streams[i].preview.medium + '"></a></li></ul></li>';
        }
        for (var i in data2.streams) {
            output+='<li class="streamer">' +
            '<span class="name">' + data2.streams[i].channel.display_name + '</span>' +
            '<span class="flag' + data2.streams[i].channel.language + '"></span>' + '</li>'
            + '<li class="details">' +
            '<ul><li>' + data2.streams[i].viewers + ' assistindo: <br><strong>' + data2.streams[i].channel.status + '</strong></li>' +
            '<li><a hrf="' + data2.streams[i].channel.url + '" class="preview">' + '<img src="' +
            data2.streams[i].preview.medium + '"></a></li></ul></li>';
}

        output+="</ul>";
        document.getElementById("twitch").innerHTML=output;
  })
    });