$.get("http://127.0.0.1:8081/user_name", function (data) {
    if (!data) {
        alert('Please log in to view this page.');
        window.location.href = "/client/account/login.html";
    } 
});