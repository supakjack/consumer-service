const axios = require("axios")
const createError = require("http-errors")
const KONG_ADMIN_URI = process.env.KONG_ADMIN_URI || "http://localhost:8001"
const KONG_GATEWAY_URI = process.env.KONG_GATEWAY_URI || "http://localhost:8000"

module.exports = {
  register: async (req, res, next) => {
    try {
      const group = req.body.group
      const username = req.body.username
      const password = req.body.password

      await axios.post(KONG_ADMIN_URI + "consumers", {
        username,
      })

      await axios.post(
        KONG_ADMIN_URI + "consumers/" + username + "/basic-auth",
        {
          username,
          password,
        }
      )

      await axios.post(KONG_ADMIN_URI + "consumers/" + username + "/acls", {
        group,
      })

      const { data } = await axios.post(
        KONG_ADMIN_URI + "consumers/" + username + "/key-auth"
      )

      const { key } = data

      res.send({ data: { username, group, key } })
    } catch (error) {
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const username = req.body.username
      const password = req.body.password

      try {
        await axios.get(KONG_GATEWAY_URI + "auth", {
          auth: {
            username: username,
            password: password,
          },
        })
      } catch (error) {
        throw createError.Unauthorized()
      }

      const keyAuthApi = await axios.get(
        KONG_ADMIN_URI + "consumers/" + username + "/key-auth"
      )
      const { key } = keyAuthApi.data.data[0]

      const aclApi = await axios.get(
        KONG_ADMIN_URI + "consumers/" + username + "/acls"
      )
      const { group } = aclApi.data.data[0]

      res.send({ username, group, key })
    } catch (error) {
      next(error)
    }
  },
}
