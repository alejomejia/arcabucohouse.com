import { COMPANY } from '@/lib/constants/legal'

import { LegalContactEmail } from '../_components/legal-contact-email'

const PRIMARY_COUNTRY = "United States"

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <h2>Privacy Overview</h2>
      <p>
        Any information collected through your use of {COMPANY.WEBSITE_URL} (the “Site”) is governed by this Privacy Policy.
        This document explains how {COMPANY.NAME} (“Company”, “we”, “us”, or “our”) gathers, uses, stores, and protects your information, as well as your rights regarding that data.
        By using this Site, you agree to the practices described herein. If you do not agree with this Privacy Policy in full, please discontinue use of the Site.
      </p>

      <h2>Website Intended Audience</h2>
      <p>
        This Site is intended for use by adults and individuals acting in a professional or commercial capacity.
        By accessing the Site, you confirm that you are at least eighteen (18) years of age or the age of majority in your jurisdiction.
      </p>

      <h2>Policy Regarding Children</h2>
      <p>
        {COMPANY.NAME} does not knowingly collect, request, or market to children under the age of thirteen (13).
        If you believe we have inadvertently collected personal data from a child under 13, please contact us at <LegalContactEmail /> so that we may promptly delete such information.
      </p>

      <h2>About This Privacy Policy</h2>
      <p>
        This Privacy Policy applies to all information collected through the Site and forms part of our Terms and Conditions.
        Please review this Policy carefully before submitting any personal data. Your continued use of the Site indicates acceptance of these terms.
      </p>

      <h2>Collection And Use Of Information</h2>
      <p>
        For the purposes of this Policy:
      </p>
      <ul>
        <li>
          <strong>“Personally Identifiable Information”</strong> refers to information that identifies or can reasonably identify you, such as your name, address, email address, telephone number, or payment details.
        </li>
        <li>
          <strong>“Non-Personally Identifiable Information”</strong> refers to data that does not directly identify you, such as browser type, device information, demographic data, and usage statistics.
        </li>
      </ul>

      <p>
        We collect Personally Identifiable Information only when you voluntarily provide it to us, such as when placing an order, subscribing to newsletters, contacting customer support, or creating an account.
      </p>

      <p>We may use your Personally Identifiable Information to:</p>
      <ul>
        <li>Provide the products or services you request.</li>
        <li>Process transactions and fulfill orders.</li>
        <li>Communicate with you about purchases, inquiries, or support requests.</li>
        <li>Send marketing communications, promotions, or newsletters (where permitted by law).</li>
        <li>Personalize content and improve user experience.</li>
        <li>Manage and enhance our business operations and analytics.</li>
        <li>Comply with legal obligations and enforce our Terms and Conditions.</li>
        <li>Protect the rights, safety, and property of {COMPANY.NAME} and others.</li>
      </ul>

      <h2>Disclosure Of Information</h2>
      <p>
        We do not sell or rent your Personally Identifiable Information. However, we may share your information in the following circumstances:
      </p>
      <ol>
        <li>
          With trusted service providers who assist us in operating our business (such as payment processors, hosting providers, fulfillment partners, marketing platforms, and analytics providers), subject to confidentiality obligations.
        </li>
        <li>
          In connection with a merger, acquisition, restructuring, or sale of assets, where personal data may be transferred as part of the business transaction.
        </li>
        <li>
          To comply with applicable laws, regulations, court orders, or lawful government requests.
        </li>
        <li>
          To protect the rights, property, or safety of {COMPANY.NAME}, our customers, or others.
        </li>
      </ol>

      <p>
        Non-Personally Identifiable Information may be used and shared for analytics, marketing, research, or operational purposes without restriction.
      </p>

      <h2>Your Rights And Access To Information</h2>
      <p>
        You may request confirmation of whether we hold Personally Identifiable Information about you by contacting us at <LegalContactEmail />.
        Where applicable by law, you may request access, correction, deletion, or restriction of your personal data.
      </p>

      <p>
        You may unsubscribe from marketing emails at any time by clicking the “unsubscribe” link included in our communications or by contacting us directly.
      </p>

      <h2>Opt-Out Procedures</h2>
      <p>
        If you wish to opt out of receiving promotional communications or request removal of your Personally Identifiable Information from our active databases (where legally permissible), please email <LegalContactEmail /> with the subject line “Opt-Out Request.”
      </p>

      <h2>Security Of Information</h2>
      <p>
        We implement reasonable administrative, technical, and physical safeguards designed to protect your Personally Identifiable Information.
        Payment transactions may be processed through secure third-party payment providers in accordance with industry standards.
      </p>

      <p>
        While we strive to protect your data, no method of transmission over the Internet can be guaranteed to be completely secure. By using this Site, you acknowledge these inherent risks.
      </p>

      <h2>Cookies And Passive Data Collection</h2>
      <p>
        The Site may automatically collect certain Non-Personally Identifiable Information through technologies such as cookies, IP addresses, log files, and analytics tools.
      </p>

      <p>
        Cookies may include:
      </p>
      <ul>
        <li><strong>Session Cookies</strong>, which expire when you close your browser.</li>
        <li><strong>Persistent Cookies</strong>, which remain on your device until deleted.</li>
      </ul>

      <p>
        These technologies help us improve performance, analyze traffic, remember preferences, and enhance your shopping experience.
        You may adjust your browser settings to decline cookies; however, certain features of the Site may not function properly.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        The Site may contain links to external websites not operated by {COMPANY.NAME}.
        We are not responsible for the privacy practices or content of such third-party sites.
        We encourage you to review their privacy policies before providing any personal information.
      </p>

      <h2>Changes To This Privacy Policy</h2>
      <p>
        We reserve the right to update or modify this Privacy Policy at any time.
        Any changes will become effective upon posting on the Site.
        Continued use of the Site following such updates constitutes acceptance of the revised Policy.
      </p>

      <h2>California Residents</h2>
      <p>
        If you are a California resident, you may have additional rights under applicable California privacy laws, including the right to request information about disclosures of personal data for direct marketing purposes.
        To exercise these rights, please contact us at <LegalContactEmail />.
      </p>

      <h2>International Users</h2>
      <p>
        If you access the Site from outside {PRIMARY_COUNTRY}, please note that your information may be transferred to and processed in countries where data protection laws may differ from those in your jurisdiction.
        By using the Site, you consent to such transfers and processing.
      </p>

      <h2>Contact Information</h2>
      <p>
        If you have questions regarding this Privacy Policy or our data practices, please contact:
      </p>

      <p>
        {COMPANY.ADDRESS}<br />
        Email: <LegalContactEmail />
      </p>
    </>
  )
}