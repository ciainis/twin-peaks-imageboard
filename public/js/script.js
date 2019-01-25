(function() {

    // MODAL COMPONENT

    Vue.component('imagemodal', {
        template: '#modal__template',
        data: function() {
           return {

           } 
        },
        props: ['data'],
        methods: {
            close: function() {
                this.$emit('close')
            },
            nextImage: function() {
                location.hash = this.data.next
            },
            prevImage: function() {
                location.hash = this.data.prev
            }
        }
    })

    // ADD COMMENTS COMPONENT

    Vue.component('addcomments', {
        template: '#addcomments__template',
        data: function() {
            return {
                commentInput: {
                    comment: '',
                    username: ''
                },
                comments: []
            }
        },
        props: ['id'],
        methods: {
            submitComment: function(e) {
                e.preventDefault()
                axios.post('/comments', {
                    comment: this.commentInput.comment,
                    username: this.commentInput.username,
                    imageID: this.id
                })
                .then(res => {
                    this.comments.unshift(res.data.rows[0])
                })
            }
        }
    })

    // SHOW COMMENTS COMPONENT

    Vue.component('showcomment', {
        template:'#showcomment__template',
        data: function() {
            return {
                results: []
            }
        },
        props: ['imageID', 'newcomment'],
        watch: {
            newcomment: function(newval, oldval) {
                this.results.unshift(newval[0])
            },
            imageID: function(newVal, oldVal) {
                axios.post('/allcomments', {
                    imageID: this.imageID
                })
                .then(function(res) {
                    res.data.rows.forEach(function(row, index) {
                        res.data.rows[index].created_at = moment(row.created_at).format('llll')
                    })
                    this.results = res.data.rows
                }.bind(this))
            }
        },
        mounted: function() {
            axios.post('/allcomments', {
                imageID: this.imageID
            })
            .then(function(res) {
                res.data.rows.forEach(function(row, index) {
                    res.data.rows[index].created_at = moment(row.created_at).format('llll')
                })
                this.results = res.data.rows
            }.bind(this))
        }
    })

    // MAIN COMPONENT 

    new Vue({
        el: '#main',
        data: {
            pageTitle: '$€£ *[#]*!?',
            results : [],
            lastImageID: '',
            showButton: true,
            input: {
                title: '',
                description: '',
                username: '',
                file: null
            },
            currentImage: {},
            currentID: ''
        },
        mounted: function() {
            
            axios.get('/images')
                .then(function(res) {
                    res.data.rows.forEach(function(row, index) {
                        res.data.rows[index].created_at = moment(row.created_at).format('llll')
                    })
                    this.results = res.data.rows
                }.bind(this))

            if (location.hash) {
                axios.post('/image', {
                    id: location.hash.slice(1)
                })
                .then(function(res) {
                    res.data.rows.forEach(function(row, index) {
                        res.data.rows[index].created_at = moment(row.created_at).format('llll')
                    })
                    this.currentImage = res.data.rows[0]
                }.bind(this))
            }
            this.$nextTick(function() {
                window.addEventListener('hashchange', function(){
                    axios.post('/image', {
                        id: location.hash.slice(1)
                    })
                    .then(function(res) {
                        res.data.rows.forEach(function(row, index) {
                            res.data.rows[index].created_at = moment(row.created_at).format('llll')
                        })
                        this.currentImage = res.data.rows[0]
                    }.bind(this))
                }.bind(this))
            })
        },
        methods: {
            upload: function(e) {
                e.preventDefault()
                var file = document.getElementById('fileInput').files[0]
                var formData = new FormData()
                formData.append('file', file)
                formData.append('title', this.input.title)
                formData.append('description', this.input.description)
                formData.append('username', this.input.username)
                axios.post('/upload', formData)
                    .then(function(res) {
                        this.results.unshift(res.data.rows[0]) 
                    }.bind(this))
            },
            loadMore: function() {
                axios.post('/moreimages', {
                    lastID: this.results[this.results.length - 1].id
                })
                .then(function(res) {
                    res.data.rows.forEach(function(row, index) {
                        res.data.rows[index].created_at = moment(row.created_at).format('llll')
                    })
                    this.results = this.results.concat(res.data.rows)
                }.bind(this))
            },
            showModal: function(data) {
                this.currentImage = data
                console.log(this.currentImage.prev)
                location.hash = `#${this.currentImage.id}`
            },
            closeModal: function() {
                this.currentImage = {}
                location.hash = ''
            }
        }, 
        watch: {
            results: function(newVal, oldVal) {
                axios.get('/lastimage')
                    .then(res => {
                        this.lastImageID = res.data.rows[0].id
                    })
                if (this.lastImageID === this.results[this.results.length - 1].id) {
                    this.showButton = false
                }
            }
        }   
    })
})()