
export default {

  /**
   * collect user details
   * @param {Object} requestBody - request body object
   * @returns {Object} user details
   */
  scrapeUserDetail(requestBody) {
    return {
      id: requestBody.id,
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      username: requestBody.username,
      createdAt: requestBody.createdAt,
    };
  },
    /**
   * collect user details
   * @param {Object} requestBody - request body object
   * @returns {Object} user details
   */
  scrapeDocument(requestBody) {
    return {
      id: requestBody.id,
      title: requestBody.title,
      content: requestBody.content,
      createdAt: requestBody.createdAt,
      updatedAt: requestBody.updatedAt
    };
  }
};
