function standardErrorHandler(e, payload, loadType = 'LOAD_FAILED', severity = 'COMMON') {
  Object.assign(payload, { loadType, exception: { message: (typeof e === 'string' ? e : e.message).split('\n').slice(-1)[0].replace(/(Error|ERROR):? ?/, ''), severity } });
}
module.exports = { standardErrorHandler };
