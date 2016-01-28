var editor = function editor(i, html) {
    return html.
    replace(/(?:<a href=")?(?:http:\/\/|https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^\ ]+)?(?:".*\<\/a>)/g,
    '<iframe width="560" height="315" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>').
    replace(/(?:<a href=")?(?:http:\/\/|https:\/\/)?(?:www\.)?(?:vimeo\.com)\/([^\ ]+)?(?:".*\<\/a>)/g,
    '<iframe src="https://player.vimeo.com/video/$1" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>').
     replace(/(?:<a href=")?(?:http:\/\/|https:\/\/)?(?:www\.)?(?:twitch\.tv)?(?:\/.*v\/)([^\ ]+)?(?:".*\<\/a>)/g,
    	'<iframe src="http://player.twitch.tv/?video=v$1" frameborder="0" scrolling="no" height="315" width="560"></iframe>');
};
$(document).find('.video_filter').html(editor);
