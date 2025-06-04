import { _createActivity } from "./create-activity";
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
import { _logIn } from "./log-in";
import { _register } from "./register";
import { _signOffForActivity } from "./sign-off-for-activity";
import { _signUpForActivity } from "./sign-up-for-activity";
import { _updateActivity } from "./update-activity";
import { _updateReport } from "./update-report";

export const pmpSdk = {
  logIn: _logIn,
  register: _register,
  getDepartment: _getDepartment,
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
}