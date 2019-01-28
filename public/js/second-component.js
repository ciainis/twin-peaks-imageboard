Vue.component("second-component", {
    data: function() {
        return {
            comments: [],
            comment: "",
            username: ""
        };
    },
    template: "#comments-section",
    props: ["imageid", "image"],
    watch: {
        imageid: function() {
            var self = this;
            axios
                .get("/get-comments/" + this.imageid)
                .then(response => {
                    self.comments = [];
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
    mounted: function() {
        var self = this;
        axios
            .get("/get-comments/" + this.imageid)
            .then(response => {
                self.comments = [];
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
    methods: {
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
                        self.comments.push(response.data[0]);
                        self.comment = null;
                        self.username = null;
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        }
    }
});
