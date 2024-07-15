const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export default catchAsync;

//NOTES
// works by recevinbg a async function that receives the req, res, next varaiables, that function will added as middleware where arguements will passed, the function will  returned a sucess promise (await query) , the res to end the cycle or error whcih can be thened(async topic js) by calling the next function  which will send the err
