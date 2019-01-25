(function() {
    Vue.component("hello-diane", {
        data: function() {
            return {
                image: [],
                comment: "",
                username: "",
                comments: [],
                error: ""
            };
        },
        template: "#popup",
        props: ["imageid"],
        mounted: function() {
            var self = this;
            axios
                .get("/get-images/" + this.imageid)
                .then(function(response) {
                    self.image = response.data[0];
                })
                .catch(function(err) {
                    console.log(err);
                    location.hash = "";
                });
            axios
                .get("/get-comments/" + this.imageid)
                .then(response => {
                    if (response.data.length) {
                        self.comments = response.data;
                    } else {
                        return;
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        watch: {
            imageid: function() {
                var self = this;
                axios
                    .get("/get-images/" + this.imageid)
                    .then(function(response) {
                        console.log("getting watch response");
                        self.image = response.data[0];
                    })
                    .catch(function(err) {
                        console.log(err);
                        self.$emit("closepopup");
                        location.hash = "";
                    });
                axios
                    .get("/get-comments/" + this.imageid)
                    .then(response => {
                        if (response.data.length) {
                            self.comments = response.data;
                        } else {
                            return;
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        },
        methods: {
            closePopUp: function() {
                this.$emit("closepopup");
                location.hash = "";
            },
            submitComment: function() {
                var self = this;

                if (self.comment != "" && self.username != "") {
                    axios
                        .post("/comment/add", {
                            imageid: self.imageid,
                            comment: self.comment,
                            username: self.username
                        })
                        .then(function(response) {
                            self.error = null;
                            self.comments.unshift(response.data[0]);
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                } else {
                    self.error = "Something went wrong... Please try again!";
                }
            }
        }
    });
})();
