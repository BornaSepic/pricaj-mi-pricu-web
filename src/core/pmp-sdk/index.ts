import { _createReading } from "./create-reading";
import { _deleteReading } from "./delete-reading";
import { _getDepartment } from "./get-department";
import { _getDepartments } from "./get-departments";
import { _getEvents } from "./get-events";
import { _getReadingsForDepartment } from "./get-readings-for-department";
import { _getReadingsForTimeframe } from "./get-readings-for-timeframe";
import { _logIn } from "./log-in";
import { _register } from "./register";

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
}