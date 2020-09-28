const { Application, Component, Mixin } = Shopware;

const initContainer = Application.getContainer('init');
const httpClient = initContainer.httpClient;

Component.override('sw-admin-menu', {
    mixins: [
        Mixin.getByName('notification')
    ],

    inject: [
        'loginService'
    ],

    created() {
        const headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${this.loginService.getToken()}`,
            'Content-Type': 'application/json'
        }

        httpClient.get("/moorl-foundation/feed", { headers }).then((response) => {
            console.log(response);

            if (response.data.articles) {
                const that = this;

                response.data.articles.forEach(function (article) {
                    if (!article.hasSeen) {
                        that.createNotificationInfo({
                            title: article.title,
                            message: article.teaser,
                            actions: [
                                {
                                    label: that.$tc('moorl-foundation-article.general.openUrl'),
                                    method: () => that.$router.push({ name: 'moorl.foundation.article.list'})
                                }
                            ]
                        });
                    }
                });
            }
        });
    }
});