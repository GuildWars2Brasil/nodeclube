$('.video_filter').html(function(i, html) {
    return html.
    replace(/(?:http:\/\/|https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^\ ]+)/g,
    '<iframe width="200" height="100" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>').
    replace(/(?:http:\/\/|https:\/\/)?(?:www\.)?(?:vimeo\.com)\/([^\ ]+)/g,
    '<iframe src="//player.vimeo.com/video/$1" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>').
     replace(/(?:http:\/\/|https:\/\/)?(?:www\.)?(?:twitch\.tv)?(?:\/.*v\/)([^\ ]+)/g,
    	'<iframe src="http://player.twitch.tv/?video=v$1" frameborder="0" scrolling="no" height="315" width="560"></iframe>');

});