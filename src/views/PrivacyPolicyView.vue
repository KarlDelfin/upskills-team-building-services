<template>
  <div class="privacy_policy_con">
    <div class="wrapper">
      <p>Effective Date: <span class="effective_date">August 2026</span></p>

      <p>
        This Privacy Policy explains how we collect, use, share, and protect your personal information when you visit our website or use our online appointment booking system. We are committed to safeguarding your personal data in accordance with applicable data privacy laws.
      </p>
      
      <p>
        By using our website and submitting a booking request, you agree to the collection and use of your information in accordance with this policy.
      </p>

      <ol type="1" class="privacy_list">
        <!-- 1. INFORMATION WE COLLECT -->
        <li>
          <h2>Information We Collect</h2>
          <p>When you use our online booking system or interact with our website, we collect the following categories of information:</p>
          <ul class="bullet">
            <li>
              <strong>Personal Identification & Contact Information:</strong> Your full name, email address, and mobile phone number (collected during Step 3 of our booking process).
            </li>
            <li>
              <strong>Booking Details:</strong> Information regarding the specific service you select, along with your preferred booking date and time slot.
            </li>
            <li>
              <strong>Security & Verification Data:</strong> Security token data collected via hCaptcha to prevent spam and automated bot submissions.
            </li>
            <li>
              <strong>Technical & Usage Data:</strong> Automatically collected information such as your IP address, browser type, operating system, and interaction details to optimize performance and prevent abuse.
            </li>
          </ul>
        </li>

        <!-- 2. HOW WE USE YOUR INFORMATION -->
        <li>
          <h2>How We Use Your Information</h2>
          <p><strong>Legal Basis for Processing</strong></p>
          <p>We process your data based on the necessity to perform contractual or requested services (booking appointments), compliance with legal obligations, and our legitimate business interests in maintaining security.</p>
          
          <p>We use your information specifically for the following purposes:</p>
          <ul class="bullet">
            <li>To schedule, manage, and confirm your service appointments.</li>
            <li>To send booking confirmations, status updates, or reminders via SMS or email.</li>
            <li>To respond to customer support inquiries and process service cancellations.</li>
            <li>To verify human requests and prevent fraud or automated abuse via hCaptcha.</li>
            <li>To monitor website performance and improve user experience.</li>
          </ul>
        </li>

        <!-- 3. SHARING YOUR INFORMATION -->
        <li>
          <h2>Sharing Your Information</h2>
          <p>We do not sell, rent, or trade your personal information. We only share data with service providers necessary to operate our website and fulfill your booking:</p>
          <ul class="bullet">
            <li>
              <strong>Database & Infrastructure Providers:</strong> Our database services (such as Supabase) store booking records securely to manage your appointments.
            </li>
            <li>
              <strong>Security & Anti-Spam Services:</strong> We integrate third-party tools like hCaptcha to verify legitimate submissions. These services process technical data according to their respective privacy policies.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information if required by court orders, subpoena, or relevant law enforcement authorities.
            </li>
          </ul>
        </li>

        <!-- 4. DATA SECURITY -->
        <li>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to safeguard your personal information against unauthorized access, loss, or alteration. All electronic form submissions are encrypted in transit using SSL/TLS encryption.
          </p>
          <p>
            While we apply strict security controls to protect your data, no method of transmission over the internet is completely immune. We recommend taking care when sharing personal details online.
          </p>
        </li>

        <!-- 5. DATA RETENTION -->
        <li>
          <h2>Data Retention</h2>
          <p>
            We retain your personal contact details and appointment history only for as long as necessary to fulfill the requested services, maintain accurate business records, or comply with legal requirements.
          </p>
          <p>
            Once your booking data is no longer required, it is securely deleted or anonymized.
          </p>
        </li>

        <!-- 6. YOUR PRIVACY RIGHTS -->
        <li>
          <h2>Your Privacy Rights</h2>
          <p>Depending on your jurisdiction and local laws, you have the right to:</p>
          <ul class="bullet">
            <li>Access, correct, or request the deletion of your personal booking details.</li>
            <li>Request clarification on how your data is being used.</li>
            <li>Withdraw consent for marketing communications or optional processing.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the contact details or inquiry options available on our website.
          </p>
        </li>

        <!-- 7. CHANGES TO THIS POLICY -->
        <li>
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect operational, legal, or regulatory changes. Any modifications will be updated on this page with a revised "Effective Date" at the top.
          </p>
        </li>

        <!-- 8. CONTACT US -->
        <li>
          <h2>Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us through the official contact channel provided on our website.
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PrivacyPolicyView',
  data() {
    return {}
  }
}
</script>

<style>
.privacy_policy_con {}
.privacy_policy_con .wrapper {margin: 2rem auto;}
.privacy_policy_con p {margin: 0 0 1rem;}
.privacy_policy_con figure {position: relative;}
.privacy_policy_con figure img {}
.privacy_policy_con figure figcaption {position: relative; bottom: 0; text-align: center; z-index: 1; background: var(--priColor); width: 100%; min-height: 80px; display: flex; justify-content: center; align-items: center; font-size: 3rem; font-weight: 700; color: var(--defaultColor);}
.privacy_policy_con .effective_date{color: red;}
.privacy_policy_con ul { margin: 0 0 1rem;}
.privacy_policy_con ol { padding-left: 20px; list-style-type: decimal;}
.privacy_policy_con ol li::marker { font-size: 1.2rem; }
.privacy_policy_con ol li{}
.privacy_policy_con ol li p{}
.privacy_policy_con ol ul li{}
.privacy_policy_con ol h2 { font-family: var(--secFont); font-size: 2rem; margin: 30px auto 20px;font-weight: 700}
.privacy_policy_con ol p {margin-bottom: 1rem;}
.privacy_policy_con .privacy_span a:hover{text-decoration:underline;}

.privacy_policy {text-decoration: underline; pointer-events: none;}
</style>