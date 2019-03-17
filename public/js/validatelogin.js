$.get("http://127.0.0.1:8081/user_name", function (data) {
    if (data) {
        console.log("user is logged in")
        $("#header").load("/freelancer/logged_in_nav.html");
    } else {
        $("#header").load("/freelancer/logged_out_nav.html");
    }
});