//promise method
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler())
    .catch((error) => next(error))
  }
}

export default asyncHandler





//try and catch method
// const asyncHandler = (fnc) => async (req, res, next) => {
//   try {
//     await fnc(req, res, next)
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message
//     })
//   }
// }