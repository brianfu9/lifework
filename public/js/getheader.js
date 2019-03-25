$.get("/user_name", function (data) {
    if (data) {
        console.log("user is logged in")
        $("#header").load("/freelancer/logged_in_nav.html");
    } else {
        $("#header").load("/freelancer/logged_out_nav.html");
    }
});