
/**
 * @description evaluate pagination details
 * @returns {Object} filtered user details
 * @param {Number} count - total number of user instances
 * @param {Number} limit - page limit
 * @param {Number} offset - page offset
 */
export default (count, limit, offset) => {
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(count / limit);
  const pageSize = (count - offset) > limit ? limit : (count - offset);

  return {
    page,
    pageCount,
    pageSize,
    totalCount: count
  };
};
