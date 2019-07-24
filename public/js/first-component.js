(function() {
    Vue.component("first-component", {
        data: function() {
            return {
                image: [],
                previousid: null,
                nextid: null
            };
        },
        template: "#pop-up",
        props: ["imageid"],
        mounted: function() {
            var self = this;
            axios
                .get("/get-image/" + this.imageid)
                .then(function(response) {
                    self.image = response.data[0];
                    self.previousid = response.data[0].previous_id;
                    self.nextid = response.data[0].next_id;
                })
                .catch(function(err) {
                    console.log(err);
                    location.hash = "";
                });
        },
        watch: {
            imageid: function() {
                var self = this;
                axios
                    .get("/get-image/" + this.imageid)
                    .then(function(response) {
                        self.image = response.data[0];
                        self.previousid = response.data[0].previous_id;
                        self.nextid = response.data[0].next_id;
                    })
                    .catch(function(err) {
                        console.log(err);
                        self.$emit("closepopup");
                        location.hash = "";
                    });
            }
        },
        methods: {
            closePopUp: function() {
                this.$emit("closepopup");
                location.hash = "";
            },
            sendToSecond: function() {
                self.$emit("sendtosecond", self.image);
            },
            getpreviousimage: function() {
                location.hash = this.nextid;
            },
            getnextimage: function() {
                location.hash = this.previousid;
            }
        }
    });
})();
