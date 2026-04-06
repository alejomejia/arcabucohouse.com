import { COMPANY } from '@/lib/constants/legal';

import { LegalContactEmail } from '../_components/legal-contact-email';

const LAST_UPDATED_DATE = "February 16, 2026";
const DAMAGE_REPORT_PERIOD_DAYS = 7;

export default function ReturnsPolicyPage() {
  return (
    <>
      <h1>Returns Policy</h1>
      <h2>Returns And Exchanges</h2>
      <p><strong>Last Updated:</strong> {LAST_UPDATED_DATE}</p>

      <h2>Order Cancellations</h2>
      <p>
        Orders may not be canceled after fourteen (14) calendar days from the original Order Date.
        Once this period has passed, all purchases become final and non-cancelable.
      </p>
      <p>
        Any request to modify or cancel an order must receive prior written authorization from {COMPANY.NAME}.
        If approved, such changes may be subject to administrative, cancellation, or restocking fees of up to fifty percent (50%) of the net selling price.
      </p>

      <h2>Returns Policy</h2>
      <p>
        All sales made through {COMPANY.WEBSITE_URL} are considered final. Due to the handcrafted and made-to-order nature of our products, we generally do not accept returns or exchanges.
      </p>
      <p>
        In-stock items will not be eligible for return if they have been altered, customized, used, or damaged in any way. Returned products must remain in their original condition and packaging, unless otherwise authorized in writing by {COMPANY.NAME}.
      </p>

      <h2>Damaged Or Defective Items</h2>
      <p>
        If you receive an item that is damaged or defective upon delivery, you must notify us in writing at <LegalContactEmail /> within {DAMAGE_REPORT_PERIOD_DAYS} days of receipt.
        Please include your order number and clear photographic evidence of the issue.
      </p>
      <p>
        We reserve the right to assess the claim and determine, at our sole discretion, whether a replacement, repair, or alternative solution will be offered.
      </p>

      <h2>Non-Returnable Items</h2>
      <p>
        The following items are not eligible for return or exchange:
      </p>
      <ul>
        <li>Customized or personalized products</li>
        <li>Items that have been altered after delivery</li>
        <li>Products showing signs of wear, use, or damage not caused during shipping</li>
      </ul>

      <h2>Policy Updates</h2>
      <p>
        {COMPANY.NAME} reserves the right to amend this Returns Policy at any time.
        Any changes will be published on this page with an updated “Last Updated” date. Continued use of the Site constitutes acceptance of the revised policy.
      </p>
    </>
  )
}