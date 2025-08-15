import { _createActivity } from "./create-activity";
import { _createDepartment } from "./create-department";
import { _createPasswordReset } from "./create-password-reset";
import { _createReading } from "./create-reading";
import { _createReport } from "./create-report";
import { _deleteActivity } from "./delete-activity";
import { _deleteReading } from "./delete-reading";
import { _deleteReport } from "./delete-report";
import { _getDepartment } from "./get-department";
import { _getDepartments } from "./get-departments";
import { _getEvents } from "./get-events";
import { _getReadingsForDepartment } from "./get-readings-for-department";
import { _getReadingsForTimeframe } from "./get-readings-for-timeframe";
import { _getUsers } from "./get-users";
import { _logIn } from "./log-in";
import { _register } from "./register";
import { _resetPassword } from "./reset-password";
import { _signOffForActivity } from "./sign-off-for-activity";
import { _signUpForActivity } from "./sign-up-for-activity";
import { _updateActivity } from "./update-activity";
import { _updateDepartment } from "./update-department";
import { _updateReport } from "./update-report";
import { _updateUser } from "./update-user";
import {_getRegistrationCode} from "./get-registration-code";
import {_updateRegistrationCode} from "./update_registration_code";

export const pmpSdk = {
  logIn: _logIn,
  register: _register,
  updateUser: _updateUser,
  getUsers: _getUsers,
  createPasswordReset: _createPasswordReset,
  resetPassword: _resetPassword,
  getDepartment: _getDepartment,
  updateDepartment: _updateDepartment,
  createDepartment: _createDepartment,
  getDepartments: _getDepartments,
  getReadingsForDepartment: _getReadingsForDepartment,
  getReadingsForTimeframe: _getReadingsForTimeframe,
  getEvents: _getEvents,
  createReading: _createReading,
  deleteReading: _deleteReading,
  createReport: _createReport,
  deleteReport: _deleteReport,
  updateReport: _updateReport,
  signUpForActivity: _signUpForActivity,
  signOffForActivity: _signOffForActivity,
  createActivity: _createActivity,
  deleteActivity: _deleteActivity,
  updateActivity: _updateActivity,
  getRegistrationCode: _getRegistrationCode,
  updateRegistrationCode: _updateRegistrationCode,
}
