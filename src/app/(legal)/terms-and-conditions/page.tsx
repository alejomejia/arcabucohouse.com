import { UnderlineLink } from '@/components/effects/underline/underline-link';
import { COMPANY } from '@/lib/constants/legal';

import { ContactEmail } from '../_components/contact-email';

const LAST_UPDATED_DATE = "February 16, 2026";
const CURRENCY = "USD"
const GOVERNING_STATE_OR_COUNTRY = "Florida"
const GOVERNING_JURISDICTION = "Miami-Dade County"

export default function TermsAndConditionsPage() {
  return (
    <>
      <h1>Terms & Conditions</h1>
      <p><strong>Last Updated:</strong> {LAST_UPDATED_DATE}</p>

      <h2>Introduction</h2>
      <p>
        Welcome to {COMPANY.WEBSITE_URL} (the “Site”), operated by {COMPANY.NAME} (“Company”, “we”, “us”, or “our”).
        These Terms and Conditions (“Terms”) govern your access to and use of the Site and any related services, products, sales, marketing activities, or events (collectively, the “Services”).
      </p>
      <p>
        By accessing or using the Site, you confirm that you are at least eighteen (18) years of age or the age of majority in your jurisdiction and that you agree to be legally bound by these Terms and our <UnderlineLink className="inline-block" href="/shipping-policy">Privacy Policy</UnderlineLink>.
        If you do not agree with these Terms, you must discontinue use of the Site immediately.
      </p>

      <h2>Contact Information</h2>
      <p>
        For questions regarding these Terms or the Site, please contact us at:
        <br />
        Email: <ContactEmail />
        <br />
        Address: {COMPANY.ADDRESS}
      </p>

      <h2>Modification Or Suspension Of The Site</h2>
      <p>
        We reserve the right, at our sole discretion, to modify, suspend, or discontinue any aspect of the Site or Services at any time without prior notice.
        We shall not be liable for any modification, interruption, or discontinuation of the Site.
      </p>

      <h2>Ownership And Intellectual Property</h2>
      <p>
        All content available on the Site, including but not limited to text, graphics, logos, images, product descriptions, software, design elements, trademarks, service marks, and trade names (collectively, the “Content”), is owned by or licensed to {COMPANY.NAME} and is protected by applicable intellectual property laws.
      </p>
      <p>
        Except as expressly permitted in writing, you may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise exploit any Content for commercial purposes.
      </p>

      <h2>Limited License</h2>
      <p>
        Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Site solely for personal, non-commercial purposes, including placing legitimate orders.
      </p>

      <h2>Eligibility And Account Security</h2>
      <p>
        Certain features of the Site may require account registration. You agree to provide accurate, complete, and current information and to maintain the confidentiality of your login credentials.
      </p>
      <p>
        You are responsible for all activity under your account. We reserve the right to suspend or terminate accounts at our discretion if we believe these Terms have been violated.
      </p>

      <h2>Permitted Use Of The Site</h2>
      <p>
        You agree to use the Site only for lawful purposes. You may not:
      </p>
      <ul>
        <li>Use automated tools (such as bots, scrapers, or spiders) to access or extract data.</li>
        <li>Attempt to gain unauthorized access to any portion of the Site or its systems.</li>
        <li>Interfere with the proper functioning or security of the Site.</li>
        <li>Impersonate another individual or entity.</li>
        <li>Use the Site for unlawful, fraudulent, or prohibited activities.</li>
      </ul>

      <h2>User Content</h2>
      <p>
        If the Site allows you to submit reviews, comments, or other materials (“User Content”), you are solely responsible for such content.
        By submitting User Content, you grant {COMPANY.NAME} a worldwide, royalty-free, perpetual license to use, reproduce, adapt, publish, and distribute such content for any lawful purpose.
      </p>
      <p>
        We reserve the right to remove User Content that violates these Terms or applicable law.
      </p>

      <h2>Product Information</h2>
      <p>
        We strive to ensure product descriptions and images are accurate. However, we do not warrant that product descriptions, images, pricing, or other content are error-free, complete, or current.
        Handmade or customized products may vary slightly from images displayed.
      </p>

      <h2>Pricing And Orders</h2>
      <p>
        All prices are displayed in {CURRENCY} unless otherwise stated. We reserve the right to modify pricing at any time.
        Order acceptance is subject to availability and confirmation of payment. We may cancel or refuse any order at our discretion.
      </p>

      <h2>Disclaimer Of Warranties</h2>
      <p>
        The Site and all Content are provided on an “as is” and “as available” basis.
        To the fullest extent permitted by law, {COMPANY.NAME} disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
      </p>
      <p>
        We do not guarantee uninterrupted or error-free access to the Site.
      </p>

      <h2>Limitation Of Liability</h2>
      <p>
        To the maximum extent permitted by law, {COMPANY.NAME}, its affiliates, employees, and agents shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from or related to your use of the Site or products purchased through it.
      </p>
      <p>
        Your sole remedy for dissatisfaction with the Site is to discontinue use.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {COMPANY.NAME}, its officers, employees, affiliates, and partners from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from your use of the Site or breach of these Terms.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate your access to the Site at any time without notice if we believe you have violated these Terms.
        Provisions that by their nature should survive termination shall remain in effect.
      </p>

      <h2>Links To Third-Party Sites</h2>
      <p>
        The Site may contain links to third-party websites. We are not responsible for the content, policies, or practices of those websites. Accessing third-party sites is at your own risk.
      </p>

      <h2>Compliance With Laws</h2>
      <p>
        You agree to comply with all applicable laws and regulations in connection with your use of the Site.
      </p>

      <h2>Governing Law And Jurisdiction</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of {GOVERNING_STATE_OR_COUNTRY}, without regard to conflict of law principles.
      </p>
      <p>
        Any disputes arising from these Terms shall be resolved exclusively in the courts located in {GOVERNING_JURISDICTION}.
      </p>

      <h2>Severability</h2>
      <p>
        If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.
      </p>

      <h2>No Waiver</h2>
      <p>
        Failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision.
      </p>

      <h2>Electronic Communications</h2>
      <p>
        By using the Site or communicating with us electronically, you consent to receive communications from us electronically.
        Such communications satisfy any legal requirement that communications be in writing.
      </p>

      <h2>Entire Agreement</h2>
      <p>
        These Terms, together with our Privacy Policy and any additional policies referenced herein, constitute the entire agreement between you and {COMPANY.NAME} regarding your use of the Site.
      </p>

      <h2>Copyright And Trademarks</h2>
      <p>
        All trademarks, service marks, trade names, logos, and other intellectual property displayed on the Site are the property of {COMPANY.NAME} or their respective owners.
        Unauthorized use is strictly prohibited.
      </p>

      <h2>Changes To These Terms</h2>
      <p>
        We may update these Terms from time to time. Updates will be posted on this page with a revised “Last Updated” date.
        Your continued use of the Site after changes become effective constitutes acceptance of the updated Terms.
      </p>

      <h2>Agreement</h2>
      <p>
        By accessing or using the Site, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
      </p>
    </>
  )
}