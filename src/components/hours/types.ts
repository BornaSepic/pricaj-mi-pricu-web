import { z } from "zod";
import { Reading } from "../../core/types/readings";

export const SuccessResponse = z.array(
  Reading
)