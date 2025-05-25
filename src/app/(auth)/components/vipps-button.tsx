import { useFormStatus } from "react-dom";

export function VippsButton() {
  const formStatus = useFormStatus();
  return (
    <>
      <script
        async
        type="text/javascript"
        src="https://checkout.vipps.no/checkout-button/v1/vipps-checkout-button.js"
      ></script>
      {/* @ts-expect-error - vipps-mobilepay-button is not a valid HTML element */}
      <vipps-mobilepay-button
        type="submit"
        brand="vipps"
        language="no"
        variant="primary"
        rounded="false"
        verb="login"
        stretched="true"
        branded="true"
        loading={formStatus.pending}
      >
        {/* @ts-expect-error - vipps-mobilepay-button is not a valid HTML element */}
      </vipps-mobilepay-button>
    </>
  );
}
