const HandleResponse = {
  /**
     * handle error response
     * @param {Object} err - error response object from server
     * @param {Object} status - response status code
     * @param {Object} res - response object from server
     * @param {Object} message - response message to client
     * @returns {Object} server response payload
     */
  handleError(err, status, res, message) {
    if (typeof message === 'string' && message) {
      return res.status(status).send({ message });
    }
    if (err.error) {
      return res.status(500).send({ message: err.error });
    }
    return res.status(status).send({ message: err.errors[0].message });
  },

  /**
   * handle success response from server
   * @param {Object} res - response object from server
   * @param {Object} status - response status code
   * @param {Object} message - response message
   * @returns {Object} server response payload
   */
  getResponse(res, status, message) {
    if (typeof message === 'string' && message) {
      return res.status(status).send({ message });
    } else if (Array.isArray(message)) {
      return res.status(status).send({ message });
    }
    return res.status(status).send(message);
  }
};

export default HandleResponse;
