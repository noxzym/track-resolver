function standardErrorHandler(e, payload,loadType = "LOAD_FAILED", severity = "COMMON") {
	return Object.assign(payload, { loadType: loadType, exception: { message: (typeof e === "string" ? e : e.message).split("\n").slice(-1)[0].replace(/(Error|ERROR):? ?/, ""), severity: severity } })
}
module.exports = { standardErrorHandler }