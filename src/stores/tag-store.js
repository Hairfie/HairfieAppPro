import Fluxxor from 'fluxxor';

export default Fluxxor.createStore({
    actions: {
        RECEIVE_ALL_TAGS: 'onReceiveAllTags'
    },
    initialize() {
        this.tags = [];
    },
    onReceiveAllTags(tags) {
        this.tags = tags;
        this.emit('change');
    },
    getById(id) {
        return _.find(this.tags, { id: id });
    },
    getAllGroupedByCategory() {
        return _.groupBy(
            _.sortByAll(
                this.tags,
                ['category.position', 'position']
            ),
            'category.id'
        );
    }
});

const TagStore = Fluxxor
