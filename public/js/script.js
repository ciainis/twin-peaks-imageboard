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
            newcomment: function(newval, oldval){
                this.results.unshift(newval[0])
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
            pageTitle: '$€£ [#]**!?',
            results : [],
            input: {
                title: '',
                description: '',
                username: '',
                file: null
            },
            currentImage: {}
        },
        mounted: function() {
            axios.get('/images')
                .then(function(res) {
                    res.data.rows.forEach(function(row, index) {
                        res.data.rows[index].created_at = moment(row.created_at).format('llll')
                        // res.data.rows[index].created_at = new Date(row.created_at.replace(' ', 'T'))
                        console.log(res.data.rows[index].created_at)
                    })
                    this.results = res.data.rows
                }.bind(this))
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
            shownodal: function(data) {
                this.currentImage = data
            },
            closeModal: function() {
                this.currentImage = {}
            }
        }    
    })
})()