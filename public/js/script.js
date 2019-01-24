(function() {
    new Vue({
        el: "#main",
        data: {
            images: [],
            imageid: "",
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
            axios.get("/imageboard").then(function(response) {
                // console.log(response);
                self.images = response.data;
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
            }
        } //end methods
    }); //end vue
})();
