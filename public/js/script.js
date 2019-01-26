(function() {
    new Vue({
        el: "#main",
        data: {
            images: [],
            imageid: location.hash.slice(1),
            lowestid: null,
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            },
            error: ""
        }, //end data
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                if (response.data.length) {
                    self.images = response.data;
                    self.lowestid = response.data[0].lowest_id;
                } else {
                    return;
                }
            });
            window.addEventListener("hashchange", function() {
                self.imageid = location.hash.slice(1);
            });
            var input = document.querySelector("#file");
            var label = document.querySelector("label");
            input.addEventListener("change", function(e) {
                var fileName = "";
                fileName = e.target.value.split("\\").pop();
                label.innerHTML = fileName;
            });
        }, //end mounted
        methods: {
            //every functions that i want to run in response to events
            uploadFile: function(e) {
                e.preventDefault();
                var file = document.getElementById("file"); //get file object
                var uploadedFile = file.files[0]; //access file
                // now we want to send the file to the server (we use form data API, only for files)
                var formData = new FormData(); //create new instance of FormData
                formData.append("file", uploadedFile);
                //console.log("formData ", formData); //it is empty! but it's working. you don't see but the file is appended.
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                //now we send stuff to our server via post request
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function(response) {
                        self.error = null;
                        self.images.unshift(response.data);
                        if (self.images.length > 9) {
                            self.images = self.images.slice(0, 9);
                        }
                        self.form.title = null;
                        self.form.description = null;
                        self.form.username = null;
                    })
                    .catch(function(err) {
                        console.log(err);
                        self.error = "Error!";
                    });
            }, //end uploadFile
            setImageId: function(e) {
                this.imageid = e.target.id;
            },
            doclosepopup: function() {
                this.imageid = null;
            },
            getMoreImages: function() {
                var self = this;
                var lastId = this.images[this.images.length - 1].id;
                axios
                    .get("/images/more/" + lastId)
                    .then(function(response) {
                        self.images = self.images.concat(response.data);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        } //end methods
    }); //end vue
})();
