$.get("http://127.0.0.1:8081/user_name", function (data) {
    if (data) {
        console.log("user is logged in")
        $("#header").load("/client/logged_in_nav.html");
    } else {
        $("#header").load("/client/logged_out_nav.html");
    }
});