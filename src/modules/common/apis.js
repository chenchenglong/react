let apiDomain = '//m.dianping.com';

if (process.env.NODE_ENV === 'development') {
    apiDomain = '//10.72.255.242';
}

export default {
    saleList () {
        return `${apiDomain}/hotel/shepherd/promotions`;
    },

    saleDetail (promotionId) {
        return `${apiDomain}/hotel/shepherd/promotions/${promotionId}`;
    },

    groupInfo (groupId) {
        return `${apiDomain}/hotel/shepherd/groups/${groupId}/promotions`;
    }
};
