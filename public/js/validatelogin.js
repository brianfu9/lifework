$.get("/user_name", function (data) {
    if (!data) {
        alert('Please log in to view this page.');
        window.location.href = "/freelancer/account/login.html";
    } 
});