const axios = require("axios")
const KONG_SERVER_URI = process.env.KONG_SERVER_URI || "http://localhost:8001"

module.exports = {
  register: async (req, res, next) => {
    try {
      const group = req.body.group
      const username = req.body.username
      const password = req.body.password

      await axios.post(KONG_SERVER_URI + "consumers", {
        username,
      })

      await axios.post(
        KONG_SERVER_URI + "consumers/" + username + "/basic-auth",
        {
          username,
          password,
        }
      )

      await axios.post(KONG_SERVER_URI + "consumers/" + username + "/acls", {
        group,
      })

      const { data } = await axios.post(
        KONG_SERVER_URI + "consumers/" + username + "/key-auth"
      )

      const { key } = data

      res.send({ data: { username, group, key } })
    } catch (error) {
      next(error)
    }
  },
}
