import React from 'react';
import { Card } from 'react-bootstrap';
import CustomNavbar from './CustomNavbar';
import HomeFooter from './HomeFooter';

const TermsAndConditions = () => {
  return (
    <div>
      <div>
        <CustomNavbar />
      </div>
      <div style={{
        marginTop: '100px', // Adjust this value to the height of your navbar
        height: 'calc(100vh - 60px)', // Make the content area take the remaining height
        overflowY: 'auto', // Enable vertical scrolling
        padding: '20px', // Add some padding for aesthetics
        boxSizing: 'border-box', // Ensure padding is included in the height calculation
        position: 'relative',
        right: '100px'
      }}>
        <h1 className='text-center'>Terms and Conditions of Jobbox</h1>
        <Card className='job-card' style={{ marginLeft: '130px', width: '90%',padding:'12px'}}>
          <p>These Terms govern</p>
          <ul>
            <li>the use of this Application, and,</li>
            <li>any other related Agreement or legal relationship with the Owner</li>
          </ul>
          <p>in a legally binding way. Capitalized words are defined in the relevant dedicated section of this document.</p>
          <h4>The User must read this document carefully.</h4><br></br>
          <h5><p>This Application is provided by:</p></h5>
          <h6>Jobbox Paaratech Inc</h6>
          <p>
            <strong>Owner contact email:</strong>
            <a href="mailto:info@paisafund.com">info@paisafund.com</a>
          </p>
          <br></br>
          <h1>What Users Should Know at a Glance</h1>   <br></br>
          <h3>Applicability of Provisions:</h3>   <br></br>
          <p>Certain provisions in these Terms may apply specifically to different categories of Users, including:</p>
          <ul>
            <li><strong>Candidates:</strong> Individuals seeking employment through JobBox.</li>
            <li><strong>Companies:</strong> Organizations posting job openings and managing their recruitment processes.</li>
            <li><strong>HR Personnel:</strong> Individuals within Companies responsible for hiring and managing job postings.</li>
          </ul>
          <p>Provisions relevant to each category will be clearly specified. In the absence of such specification, the terms apply to all Users.</p>
          <br></br>
          <h3>Age Restriction:</h3><br></br>
          <p>To access and use JobBox and its services, Users must be legally recognized as adults under applicable law.</p>
          <br></br>
          <h3>Right of Withdrawal:</h3><br></br>
          <p>The right of withdrawal applies only to Users based in the European Union and is detailed in the relevant section of these Terms.</p>
          <br></br>
          <h3>Automatic Renewal:</h3><br></br>
          <p>JobBox may utilize automatic renewal for subscription-based services. Details about the renewal period, cancellation procedures, and termination notice are provided in the relevant section of these Terms.</p>
          <br></br>
          <h3>General Terms:</h3><br></br>
          <p>The terms outlined in this section generally apply to all Users of JobBox. Specific conditions may apply based on whether you are a Candidate, Company, or HR Personnel, and such conditions will be explicitly detailed in this document.</p>
          <br></br>
          <h3>Requirements:</h3><br></br>
          <p>By using JobBox, Users confirm the following:</p>
          <ul>
            <li><strong>Candidates:</strong> Must be seeking employment or professional opportunities and must provide accurate information regarding their qualifications.</li>
            <li><strong>Companies:</strong> Must be legitimate entities seeking to recruit and hire employees through JobBox.</li>
            <li><strong>HR Personnel:</strong> Must be authorized representatives of Companies responsible for managing job postings and candidate interactions.</li>
            <li>All Users, regardless of category, must be legally recognized as adults under applicable law.</li>
          </ul>
          <h3>Account Registration:</h3><br></br>
          <p>To use the Service, Users must register or create a User account, providing all required data or information in a complete and truthful manner. Failure to do so will cause unavailability of the Service.</p>
          <p>Users are responsible for keeping their login credentials confidential and safe. For this reason, Users are also required to choose passwords that meet the highest standards of strength permitted by this Application.</p>
          <p>By registering, Users agree to be fully responsible for all activities that occur under their username and password. Users are required to immediately inform the Owner via the contact details if they think their personal information, including but not limited to User accounts, access credentials or personal data, have been violated, unduly disclosed, or stolen.</p>

          <h3>Conditions for Account Registration:</h3><br></br>
          <ul>
            <li>Accounts registered by bots or any other automated methods are not permitted.</li>
            <li>Unless otherwise specified, each User must register only one account.</li>
            <li>Unless explicitly permitted, a User account may not be shared with other persons.</li>
          </ul>
          <br></br>

          <h3>Account Termination:</h3><br></br>
          <p>Users can terminate their account and stop using the Service at any time by:</p>
          <ul>
            <li>Contacting the Owner directly at the contact details provided.</li>
          </ul>
          <br></br>

          <h3>Account Suspension and Deletion:</h3><br></br>
          <p>The Owner reserves the right, at its sole discretion, to suspend or delete at any time and without notice, User accounts that it deems inappropriate, offensive or in violation of these Terms.</p>
          <p>The suspension or deletion of User accounts shall not entitle Users to any claims for compensation, damages or reimbursement.</p>
          <p>The suspension or deletion of accounts due to causes attributable to the User does not exempt the User from paying any applicable fees or prices.</p>
          <br></br>

          <h3>Content on this Application:</h3><br></br>
          <p>Unless otherwise specified or clearly recognizable, all content available on this Application is owned or provided by the Owner or its licensors.</p>
          <p>The Owner undertakes its utmost effort to ensure that the content provided on this Application infringes no applicable legal provisions or third-party rights. However, it may not always be possible to achieve such a result.</p>
          <p>In such cases, Users are kindly asked to report related complaints using the contact details provided in this document.</p>
          <br></br>

          <h3>Rights Regarding Content on this Application - All Rights Reserved:</h3><br></br>
          <p>The Owner holds and reserves all intellectual property rights for any such content. Users may not use such content in any way that is not necessary or implicit in the proper use of the Service.</p>
          <ul>
            <li>Users may not copy, download, share (beyond the limits set forth below), modify, translate, transform, publish, transmit, sell, sublicense, edit, transfer/assign to third parties or create derivative works from the content available on this Application.</li>
            <li>Where explicitly stated on this Application, Users may download, copy and/or share some content available through this Application for personal and non-commercial use provided that copyright attributions and all other attributions requested by the Owner are correctly implemented.</li>
          </ul>
          <br></br>

          <h3>Content Provided by Users:</h3><br></br>
          <p>The Owner allows Users to upload, share, or provide their own content to this Application. By providing content, Users confirm they are legally allowed to do so and that their content does not infringe third-party rights.</p>
          <p>Users grant the Owner a worldwide, non-exclusive, free, sub-licensable and transferable license to use, display, reproduce, modify, adapt, publish and distribute such content in any medium, format or channel now known or later developed, for the purposes of operating and providing the Service and its functionalities.</p>
          <br></br>

          <h3>Removal of Content:</h3><br></br>
          <p>Users are responsible for the content they provide. The Owner has the right to remove content that it deems unlawful, offensive or in violation of these Terms, or otherwise harmful to the Service.</p>
          <br></br>

          <h3>Intellectual Property Rights:</h3><br></br>
          <p>The Owner and its licensors own all intellectual property rights related to the Service, including copyrights, trademarks, and any other proprietary rights.</p>
          <br></br>

          <h3>Limitation of Liability:</h3><br></br>
          <p>The Owner is not liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to the use of the Service. The Owner’s liability is limited to the fullest extent permitted by applicable law.</p>
          <br></br>

          <h3>Disclaimer of Warranties:</h3><br></br>
          <p>The Service is provided “as is” and “as available” without any warranties of any kind. The Owner does not guarantee the accuracy, completeness, or reliability of the Service.</p>
          <br></br>

          <h3>Governing Law:</h3><br></br>
          <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which the Owner is established, without regard to its conflict of law principles.</p>
          <br></br>

          <h3>Dispute Resolution:</h3><br></br>
          <p>Any disputes arising from these Terms or the use of the Service shall be resolved through amicable negotiations. If the dispute cannot be resolved, it shall be submitted to the competent court of the jurisdiction where the Owner is established.</p>
          <br></br>

          <h3>Amendments to these Terms:</h3><br></br>
          <p>The Owner reserves the right to amend these Terms at any time. Users will be notified of any changes and are required to review the updated Terms regularly.</p>
          <br></br>
          <h1>Terms and Conditions for Job Management</h1>
          <p>These Terms and Conditions govern the use of job management features on our platform for both HR professionals and candidates.
            By accessing or using these features, you agree to comply with these terms.
            If you do not agree with any part of these terms, please refrain from using the job management features.</p>
          <h3>Provision of Personal Data</h3>
          <p>To access or receive some of the Products provided via this Application as part of the Service, Users may be required to provide their personal data as indicated on this Application.</p>
          <br />
          <h5>Responsibilities of HR Professionals</h5>
          <ul>
            <li><strong>Job Postings:</strong> Ensuring that all job postings are accurate, non-discriminatory, and comply with applicable laws and regulations.</li>
            <li><strong>Job Management:</strong> Regularly updating job postings, removing filled or expired positions, and managing applications efficiently.</li>
            <li><strong>Compliance:</strong> Adhering to our platform’s guidelines and any relevant local, state, or national employment laws.</li>
            <li><strong>Fees and Payments:</strong> Ensuring timely payment for any fees associated with job postings or additional features.</li>
          </ul>
          <h5>Responsibilities of Candidates</h5>
          <ul>
            <li><strong>Application Accuracy:</strong> Providing truthful and accurate information in job applications.</li>
            <li><strong>Respectful Interaction:</strong> Communicating respectfully with HR professionals and other candidates.</li>
            <li><strong>Privacy:</strong> Understanding that personal information submitted in job applications is shared with HR professionals for the purpose of job application processing.</li>
          </ul>

          <h5>Job Posting and Application Guidelines</h5>
          <ul>
            <li><strong>Job Postings:</strong> All job postings must be clear and provide complete information about the job.</li>
            <li><strong>Application Process:</strong> Candidates must follow the instructions provided in job postings to apply.</li>
            <li><strong>Content Moderation:</strong> The platform reserves the right to remove job postings or applications that violate these terms.</li>
          </ul>


          <h5>Payment Terms for Candidates</h5>
          <h6>1. Payment for Job Applications</h6>
          <ul>
            <li><strong>Application Fee:</strong> Candidates are required to pay a fee to apply for more than seven jobs per day. The fee structure is as follows:
              <ul>
                <li>Single Application Fee: $10 per application after the initial seven free applications per day.</li>
                <li>Monthly Plan: $99 for unlimited applications within one month.</li>
                <li>Quarterly Plan: $299 for unlimited applications within three months.</li>
                <li>Annual Plan: $599 for unlimited applications within twelve months.</li>
              </ul>
            </li>
            <li><strong>Payment Methods:</strong> Payments can be made using:
              <ul>
                <li>Credit/Debit Cards: Visa, MasterCard, American Express, and Discover.</li>
                <li>PayPal: Secure payments through your PayPal account.</li>
                <li>Bank Transfers: Payments can be made via bank transfer where applicable.</li>
              </ul>
            </li>
            <li><strong>Payment Process:</strong> To pay for applications, candidates will need to:
              <ul>
                <li>Select the desired payment plan.</li>
                <li>Provide payment details through our secure payment gateway.</li>
                <li>Confirm the payment to activate the chosen plan.</li>
              </ul>
            </li>
          </ul>

          <h6>2. Payment for Subscription Plans</h6>
          <ul>
            <li><strong>Subscription Options:</strong> Candidates may choose from:
              <ul>
                <li>Monthly Subscription: $99 per month.</li>
                <li>Quarterly Subscription: $299 for three months.</li>
                <li>Annual Subscription: $599 for twelve months.</li>
              </ul>
            </li>
            <li><strong>Automatic Renewal:</strong> Subscriptions are automatically renewed based on the selected plan.</li>
            <li><strong>Cancellation and Refunds:</strong> Candidates may cancel their subscription at any time. No refunds will be issued for partial months or unused portions of the subscription period.</li>
          </ul>
          <h6>3. Payment and Refunds</h6>
          <ul>
            <li><strong>Fees:</strong> HR professionals are responsible for paying any applicable fees for job postings.</li>
            <li><strong>Refund Policy:</strong> Refunds for job posting fees are generally not provided unless there is an error on our part.</li>
          </ul>
          <h6>4. Payment Security</h6>
          <ul>
            <li><strong>Secure Transactions:</strong> All payments are processed through secure third-party services. We do not store any credit card information.</li>
            <li><strong>Failed Payments:</strong> If a payment fails or is refused, access to premium features or additional applications will be suspended until the payment issue is resolved.</li>
          </ul>

        </Card>
      </div>
      <div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default TermsAndConditions;
