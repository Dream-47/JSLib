var newScript=document.createElement("script");
newScript.type="text/javascript";
newScript.src="https://cdn.jsdelivr.net/gh/Dream-47/JSLib@1.3/modernizr.custom.js"; 
var head=document.getElementsByTagName("head")[0];
head.appendChild(newScript);
var mutiInput = {
    // startEvent: function(){
    //     return 'touchstart'
    // },
    startEvent: Modernizr.touch? 'touchstart':'mousedown',
    moveEvent: Modernizr.touch? 'touchmove':'mousemove',
    endEvent: Modernizr.touch? 'touchend':'mouseup',                        
}