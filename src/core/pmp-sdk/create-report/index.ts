import { type Report, ReportCreateResponse } from "../types";
import { _post } from "../utilities";

export const _createReport = async (report: Report) => {
  return _post('/reports', {
    ...report
  }, ReportCreateResponse)
}