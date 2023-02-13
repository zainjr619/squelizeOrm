const { adapterRequest } = require("../helpers/adapterRequest");
const userService = require("../services/database/userService");
const authHelper = require("../helpers/authHelper");
const HttpCodes = require("../constants/httpCodes");
const AppMessages = require("../constants/appMessages");
const SuccessResponse = require("../composer/success-response");
const ErrorResponse = require("../composer/error-response");

exports.createUser = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
   
    let exists = await userService.getUserByEmail(body.email);
    if (exists) {
      return res.status(HttpCodes.BAD_REQUEST).send(new ErrorResponse(AppMessages.APP_DUPLICATE_RECORD));
    }

    const password = await authHelper.encryptString(body.password);
    let result = await userService.createUserAccount(body.username, body.email , password, body.role);
    //Api Call and Compose Response Response
    return res.status(HttpCodes.OK).send(new SuccessResponse(AppMessages.SUCCESS, result));

  } catch (error) {
    console.log(error)
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

exports.login = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;

    let result = await userService.getUserByEmail(body.email);

    //Compose Error Response
    if (!result) {
      return res.status(HttpCodes.BAD_REQUEST).send(new ErrorResponse(AppMessages.APP_ERROR_MSG_IVALID_USERNAME_PASSWORD));
    }
    //Validate Paswword
    const isValidUser = await authHelper.isValidUser(body.password, result.password);
    //Compose Error Response if Password is Invalid.
    if (!isValidUser) {
      return res.status(HttpCodes.BAD_REQUEST).send(new ErrorResponse(AppMessages.APP_ACCESS_DENIED));
    }

    res = await authHelper.addAuthTokenInResponseHeader(result, res);
    return res.status(HttpCodes.OK).send(new SuccessResponse(AppMessages.SUCCESS));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};


exports.usersList = async (req, res) => {
  try {
    //Api Call and Compose Response Response
    let users = await userService.getUsers();
    return res.status(HttpCodes.OK).send(new SuccessResponse(AppMessages.SUCCESS, users));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

exports.getUser = async (req, res) => {
  try {
    //Api Call and Compose Response Response
    let id = req.params["id"];
    let user = await userService.getUserByID(id);
    return res.status(HttpCodes.OK).send(new SuccessResponse(AppMessages.SUCCESS, user));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //Api Call and Compose Response Response
    let id = req.params["id"];
    await userService.deleteUser(id);
    return res.status(HttpCodes.OK).send(new SuccessResponse(AppMessages.SUCCESS));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { body } = req;

    let exists = await userService.getUserByID(body.id);
    if (!exists) {
      return res.status(HttpCodes.BAD_REQUEST).send(new SuccessResponse(AppMessages.AppMessages.IVALID_USER_CREDENTIALS));
    }

    let isValidUser = await authHelper.isValidUser(body.oldPassword, exists.password);

    if (!isValidUser) {
      return res.status(HttpCodes.BAD_REQUEST).send(new SuccessResponse(AppMessages.APP_ERROR_MSG_IVALID_USERNAME_PASSWORD));
    }

    let passwordHash = await authHelper.encryptString(body.newPassword);
    let result = await userService.updateUserPassword(body.id, passwordHash);
    //Api Call and Compose Sucess Response Response
    return res.status(HttpCodes.OK).send(new SuccessResponse(AppMessages.APP_PASSWORD_CHANGED, result));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

exports.updateUser = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
    let exists = await userService.getUserByID(body.id);
    if (!exists) {
      return res.status(HttpCodes.BAD_REQUEST).send(new ErrorResponse(AppMessages.APP_RESOURCE_NOT_FOUND));
    }

    //Api Call and Compose Response Response
    return res.status(HttpCodes.BAD_REQUEST).send(new SuccessResponse(AppMessages.RECORD_SUCCESSFULY_UPDATED));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

exports.resendOTP = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
    body.otp = await authHelper.generateOTP();
    let result = await userService.updateOTP(body);

    if (!result[0][0].affected_rows || result[0][0].affected_rows === 0) {
      return res.status(HttpCodes.BAD_REQUEST).send(new SuccessResponse(appMessages.ERROR_PIN_GENERATION));
    }

    //Api Call and Compose Response Response
    return res.status(HttpCodes.BAD_REQUEST).send(new SuccessResponse(appMessages.PIN_SUCCESSFULY_GENERATED));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

exports.confirmOTP = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
    let result = await userService.confirmOTP(body);

    if (!result[0][0].affected_rows || result[0][0].affected_rows === 0) {
      return res.status(HttpCodes.BAD_REQUEST).send(new ErrorResponse(appMessages.ERROR_INVALID_PIN));
    }

    //Api Call and Compose Response Response
    return res.status(HttpCodes.OK).send(new SuccessResponse(appMessages.PIN_SUCCESSFULY_CONFIRMED));
  } catch (error) {
    //Compose Error Response
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR));
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////
