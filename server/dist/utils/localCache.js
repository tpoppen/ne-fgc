import NodeCache from "node-cache";
// Cache time to live is 1 week
// 60 seconds in a minute, 60 minutes in an hour, 24 hours a day, 7 days in a week
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const BuildLocalCache = () => {
    const cache = new NodeCache({ stdTTL: WEEK_IN_SECONDS, checkperiod: 120 });
    return {
        cacheItem: (key, item) => {
            return cache.set(key, item);
        },
        getCacheItem: (key) => {
            return cache.get(key);
        },
        deleteCacheItem: (key) => {
            return cache.del(key);
        }
    };
};
export default BuildLocalCache();
