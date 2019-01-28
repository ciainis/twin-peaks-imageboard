(function() {
    Vue.component("hello-diane", {
        data: function() {
            return {
                image: [],
                previousid: null,
                nextid: null,
                comment: "",
                username: "",
                comments: []
            };
        },
        template: "#popup",
        props: ["imageid"],
        mounted: function() {
            var self = this;
            axios
                .get("/get-image/" + this.imageid)
                .then(function(response) {
                    self.previousid = response.data[0].previous_id;
                    self.nextid = response.data[0].next_id;
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
                    .get("/get-image/" + this.imageid)
                    .then(function(response) {
                        self.previousid = response.data[0].previous_id;
                        self.nextid = response.data[0].next_id;
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
                            self.comments.push(response.data[0]);
                            self.comment = null;
                            self.username = null;
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                }
            },
            getpreviousimage: function() {
                this.comments = [];
                location.hash = this.nextid;
            },
            getnextimage: function() {
                this.comments = [];
                location.hash = this.previousid;
            }
        }
    });
})();
