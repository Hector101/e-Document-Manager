
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
      email: requestBody.email,
      isBlocked: requestBody.isBlocked,
      roleId: requestBody.roleId,
      createdAt: requestBody.createdAt,
      updatedAt: requestBody.updatedAt
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
      access: requestBody.access,
      userId: requestBody.userId,
      createdAt: requestBody.createdAt,
      updatedAt: requestBody.updatedAt
    };
  }
};
