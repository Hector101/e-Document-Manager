
/**
 * @description evaluate pagination details
 * @returns {Object} filtered user details
 * @param {Number} count - total number of user instances
 * @param {Number} limit - page limit
 * @param {Number} offset - page offset
 */
export default (totalCount, limit, offset) => {
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(totalCount / limit);
  const pageSize = (totalCount - offset) > limit ? limit : (totalCount - offset);

  return {
    page,
    pageCount,
    pageSize,
    totalCount
  };
};
