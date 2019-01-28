var input = document.querySelector("#file");
var label = document.querySelector("label");

input.addEventListener("change", function(e) {
    var fileName = "";
    fileName = e.target.value.split("\\").pop();
    label.innerHTML = fileName;
});
