import styled from "styled-components";
import { fluidScale, tokens } from "@/styles/globalStyles";
import Flag from "@/atomic/Flag";

export const EarlyAccess = styled(Flag)`
  text-align: center;
  font-size: ${fluidScale(
    "12px",
    "8px",
    tokens.BREAK_TABLET,
    tokens.BREAK_MOBILE
  )};
  font-weight: 500;
  line-height: 1.2;
  color: ${tokens.neutral90};
`;
