(function() {
    new Vue({
        el: "#main",
        data: {
            images: []
        },
        mounted: function() {
            var self = this;
            axios.get("/imageboard").then(function(response) {
                console.log(response);
                self.images = response.data;
            });
        }
    });
})();
