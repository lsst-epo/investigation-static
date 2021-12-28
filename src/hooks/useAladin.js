import { useEffect } from "react";
import { waitForGlobal } from "@/helpers";

export default function useAladin(
  selector,
  survey,
  fov,
  target,
  options,
  setAladins
) {
  useEffect(() => {
    waitForGlobal("jQuery", () => {
      waitForGlobal("A", () => {
        const aladin = window.A.aladin(
          selector,
          Object.assign(options, {
            fov,
            target,
          })
        );
        const customSurvey = aladin.setImageSurvey(
          aladin.createImageSurvey(
            "Custom Test",
            "Custom Test Color",
            survey,
            "equatorial",
            5,
            { imgFormat: "jpg" }
          )
        );
        setAladins({
          // window.A.init.then(() => {
          //   setAladins({
          //     // Initialize aladin Global
          //     aladinGlobal: window.A,
          //     aladin: window.A.aladin(
          //       selector,
          //       Object.assign(options, {
          //         survey,
          //         fov,
          //         target,
          //       })
          //     ),
          //   });
          // });

          // Initialize aladin Global
          aladinGlobal: window.A,
          aladin,
        });
      });
    });
  }, [selector, survey, fov, target, options, setAladins]);
}
