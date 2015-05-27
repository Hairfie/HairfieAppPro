'use strict';

export default {
    start() {
        return this.flux.actions.auth.rememberLogin();
    }
};
