$(".invite-button").hover(function(){
    $(this).toggleClass("is-active");
});

function initMenuBar() {
    var x = document.getElementById("hidden-menu");
    if (x.className === "hidden-menu") {
        x.className = "show-menu";
    } else {
        x.className = "hidden-menu";
    }

    var y = document.getElementById("hawk-sub-con");
    if (y.className === "hawk-sub-con") {
        y.className = "hidden-sub-con";
    } else {
        y.className = "hawk-sub-con";
    }

    var z = document.getElementById("hawk-discord-img");
    if (z.className === "hawk-discord-img") {
        z.className = "hawk-discord-img dark";
    } else {
        z.className = "hawk-discord-img";
    }
}