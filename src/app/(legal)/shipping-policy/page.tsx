import { COMPANY } from '@/lib/constants/legal';

import { LegalContactEmail } from "../_components/legal-contact-email";

const DAMAGE_CLAIM_WINDOW_HOURS = 72;
const DEPOSIT_PERCENT_STANDARD = 50;
const HANDLING_TIME_FROM = 1;
const HANDLING_TIME_TO = 7;
const NATIONAL_SHIPPING_TIME_START = 1;
const NATIONAL_SHIPPING_TIME_END = 5;
const INTERNATIONAL_SHIPPING_TIME_START = 4;
const INTERNATIONAL_SHIPPING_TIME_END = 10;
const WIRE_TRANSFER_CLEARING_DAYS = 5;
const STORAGE_FEE_PERCENT_PER_MONTH = 3;
const LATE_PAYMENT_INTEREST_PERCENT_PER_MONTH = 1.5;
const LATE_PAYMENT_MAX_DAYS = 60;
const PAYMENT_PERCENT_IN_STOCK = 100;
const WARRANTY_PERIOD_YEARS = 1;

export default function ShippingPolicyPage() {
  return (
    <>
      <h1>Shipping Policy</h1>
      <h2>Handling Time</h2>
      <p>
        All works offered through the website are generally in stock. Handling times may vary depending on packaging requirements and complexity. Estimated handling time ranges from {HANDLING_TIME_FROM} to {HANDLING_TIME_TO} business days.
      </p>

      <h2>Shipping & Transit Time</h2>
      <p>
        Orders are dispatched on the business day following completion of packaging. Delivery timeframes are estimates only and are not guaranteed. Shipments within the United States typically arrive within {NATIONAL_SHIPPING_TIME_START} to {NATIONAL_SHIPPING_TIME_END} business days. International shipments generally arrive within {INTERNATIONAL_SHIPPING_TIME_START} to {INTERNATIONAL_SHIPPING_TIME_END} business days. Delivery times for international orders may be extended due to customs clearance procedures.
      </p>

      <h2>Shipping Location</h2>
      <p>
        All shipments originate from {COMPANY.ADDRESS}.
      </p>

      <h2>Local Messenger</h2>
      <p>
        Customers located in the Miami, FL area may request messenger delivery services for an additional fee. Pricing and scheduling details are available upon request.
      </p>

      <h2>Shipping Method</h2>
      <p>
        Domestic shipments within the United States are sent via UPS Ground Service unless otherwise agreed at the time of purchase. International shipments are sent via DHL.
      </p>
      <p>
        {COMPANY.NAME} reserves the right to arrange shipment through its preferred carriers unless the Buyer provides specific shipping instructions. All shipping charges are quoted PROFORMA and included in the final invoice. If a shipment is returned due to the Buyer's failure or refusal to accept delivery, the Buyer shall be responsible for any resulting costs, including but not limited to storage and re-delivery fees.
      </p>

      <h2>Shipping Rates</h2>
      <p>
        Shipping fees are calculated by the carrier based on parcel dimensions, weight, and declared insured value. {COMPANY.NAME} applies an additional packaging charge reflecting the level of protection required.
      </p>
      <p>
        <strong>{COMPANY.NAME} DOES NOT PROVIDE FREE SHIPPING.</strong>
      </p>

      <h2>Packaging</h2>
      <p>
        All items are packaged in accordance with industry standards appropriate for fragile goods. Crating requirements for shipments outside Miami, FL will be determined on a per-order basis. {COMPANY.NAME} collaborates with trusted logistics partners for both domestic and international shipments.
      </p>

      <h2>Damage In Transit</h2>
      <p>
        All claims for shipping damage must be submitted in writing to <LegalContactEmail /> within {DAMAGE_CLAIM_WINDOW_HOURS} hours of receipt. Claims must include photographs and a detailed written description of the damage. All original packaging must be retained, as failure to do so may void the claim.
      </p>
      <p>
        Delivery terms are F.O.B. Miami. Risk of loss and title transfer to the Buyer once the freight carrier takes possession of the goods. {COMPANY.NAME} is not liable for goods collected by a third-party carrier arranged by the Buyer.
      </p>
      <p>
        In accordance with applicable ICC regulations, ownership transfers to the Buyer upon the carrier's acceptance of the shipment. The Buyer assumes responsibility for any damage occurring in transit and must submit freight claims within {DAMAGE_CLAIM_WINDOW_HOURS} hours.
      </p>
      <p>
        The carrier is responsible for inspecting goods at origin. Any visible damage must be documented on the Bill of Lading (BOL). The signed BOL constitutes confirmation that the carrier accepted the goods in stated condition. Inspection of boxed or crated goods is limited to the external packaging unless otherwise noted. If packaging appears compromised, it must be opened immediately and exceptions recorded.
      </p>
      <p>
        Photographic documentation of both the product and packaging is required for quality or damage claims. {COMPANY.NAME} will address product quality concerns promptly upon proper notification.
      </p>

      <h2>Force Majeure</h2>
      <p>
        All completion and delivery dates are estimates. {COMPANY.NAME} shall not be held liable for delays or failure to perform caused by events beyond its reasonable control, including but not limited to governmental actions, war, civil unrest, embargoes, epidemics, pandemics, material shortages, labor disruptions, transportation delays, fire, flood, or other unforeseen events. In such cases, {COMPANY.NAME} shall be granted a reasonable extension of time for performance.
      </p>
      <p>
        Acceptance of goods by the Buyer constitutes a waiver of any claims for damages resulting from delivery delays.
      </p>

      <h2>Title & Risk Of Loss</h2>
      <p>
        Delivery to the carrier constitutes delivery to the Buyer. At that moment, title and risk of loss transfer to the Buyer. Any claim for shortage or damage prior to such delivery must be made in writing within {DAMAGE_CLAIM_WINDOW_HOURS} hours of receipt and must include the original BOL signed by the carrier noting the condition of goods at origin.
      </p>

      <h2>Pricing & Terms</h2>
      <p>
        All prices are stated in U.S. dollars and are F.O.B. Miami. Published pricing reflects list prices and may be subject to trade discounts. Shipping and packaging charges are additional.
      </p>
      <p>
        A deposit of {DEPOSIT_PERCENT_STANDARD}% is required to initiate production, except for in-stock items, which require {PAYMENT_PERCENT_IN_STOCK}% payment in advance. Final payment is due upon invoicing, which occurs when the order is complete.
      </p>
      <p>
        Accounts not paid within {LATE_PAYMENT_MAX_DAYS} calendar days from the invoice date may incur a service charge equal to the lesser of {LATE_PAYMENT_INTEREST_PERCENT_PER_MONTH}% per month or the maximum rate permitted by law. Orders must be paid in full, including all associated charges, prior to shipment. Prices are subject to change without notice.
      </p>

      <h2>Taxes</h2>
      <p>
        The Buyer is responsible for all applicable taxes, duties, or governmental charges, whether federal, state, local, or international, arising from the sale or transport of goods.
      </p>
      <p>
        For international shipments, VAT, customs duties, or local import taxes are payable by the consignee upon importation.
      </p>

      <h2>Storage</h2>
      <p>
        If goods are not collected or shipped within {LATE_PAYMENT_MAX_DAYS} calendar days following final invoice, a storage fee equal to {STORAGE_FEE_PERCENT_PER_MONTH}% of the total invoice value per month will apply. Storage charges are not prorated.
      </p>

      <h2>Order Initiation</h2>
      <p>
        Orders may be placed through online checkout or by contacting <LegalContactEmail />. Inquiry-based orders require a non-refundable deposit of {DEPOSIT_PERCENT_STANDARD}%, except for in-stock items, which require {PAYMENT_PERCENT_IN_STOCK}% non-refundable payment.
      </p>
      <p>
        Remaining balances and shipping charges must be paid prior to scheduling delivery. Payment receipt confirms acceptance of all order details. {COMPANY.NAME} is not responsible for errors not identified by the Buyer prior to payment. Accepted payment methods include credit card and wire transfer. Wire transfers may require up to {WIRE_TRANSFER_CLEARING_DAYS} working days to clear.
      </p>

      <h2>Quality Control & Variation</h2>
      <p>
        All products are inspected prior to shipment to ensure satisfactory condition. Variations in color, texture, and veining are natural characteristics of materials such as stone and are not considered defects. As all items are handmade, minor variations may occur.
      </p>

      <h2>Warranty</h2>
      <p>
        Except as otherwise stated, {COMPANY.NAME} warrants that goods shall be free from defects in materials and workmanship for a period of {WARRANTY_PERIOD_YEARS} year(s). This warranty excludes damage resulting from improper installation, misuse, neglect, accidents, or normal wear and tear. Defective items will be replaced within standard production lead times. If materials are discontinued or unavailable, no refund shall be issued.
      </p>
    </>
  )
}