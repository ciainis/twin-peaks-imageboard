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
            axios.get("/get-images/" + this.imageid).then(function(response) {
                console.log(response.data[0]);
                self.image = response.data[0];
            });
            axios
                .get("/get-comments/" + this.imageid)
                .then(response => {
                    if (response.data.length) {
                        //console.log(response.data);
                        self.comments = response.data;
                    } else {
                        return;
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        methods: {
            closePopUp: function() {
                this.$emit("closepopup");
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
