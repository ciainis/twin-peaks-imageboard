(function() {
    new Vue({
        el: '#main',
        data: {
            title: 'Polaroid images',
            results : []
        },
        mounted: function() {
            axios.get('/images')
                .then(function(res) {
                    this.results = res.data.rows
                }.bind(this))
        }
    })
})()