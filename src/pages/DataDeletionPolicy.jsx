import React from 'react'
import { Card } from 'react-bootstrap'
import CustomNavbar from './CustomNavbar'
import HomeFooter from './HomeFooter'

const DataDeletionPolicy = () => {
    return (
        <div>
            <div>
                <CustomNavbar />
            </div>
            <div style={{
                marginTop: '80px', // Adjust this value to the height of your navbar
                height: 'calc(100vh - 60px)', // Make the content area take the remaining height
                overflowY: 'auto', // Enable vertical scrolling
                padding: '20px', // Add some padding for aesthetics
                boxSizing: 'border-box', // Ensure padding is included in the height calculation
                position: 'relative',
                right: '100px'
            }}>

                <h1 className='text-center'>Data Deletion Instructions</h1>
                <Card className='job-card' style={{ marginLeft: '130px', width: '90%', padding: '12px' }}>
                    <p>If you wish to delete your data associated with our app, please follow the instructions below:</p>
                    <ol>
                        <li>Send an email to <strong>privacy@jobbox.com</strong> with the subject "Data Deletion Request."</li>
                        <li>In the body of the email, include your registered email address and any additional details required for us to locate your account.</li>
                        <li>We will process your request and delete your data within 7 business days.</li>
                    </ol>
                    <p>If you have any questions or concerns, feel free to contact us at <strong>privacy@jobbox.com</strong>.</p>

                    <h1>Terms and Conditions of Jobbox</h1>
                    <p>These Terms govern:</p>
                    <ul>
                        <li>The use of this Application, and,</li>
                        <li>Any other related Agreement or legal relationship with the Owner.</li>
                    </ul>
                    <p>in a legally binding way. Capitalized words are defined in the relevant dedicated section of this document.</p>
                    <h4>The User must read this document carefully.</h4>

                    <h5>This Application is provided by:</h5>
                    <h6>Jobbox Paaratech Inc</h6>
                    <p>
                        <strong>Owner contact email:</strong>
                        <a href="mailto:info@paisafund.com">info@paisafund.com</a>
                    </p>

                    <h1>What Users Should Know at a Glance</h1>
                    <h3>Applicability of Provisions:</h3>
                    <p>Certain provisions in these Terms may apply specifically to different categories of Users, including:</p>
                    <ul>
                        <li><strong>Candidates:</strong> Individuals seeking employment through JobBox.</li>
                        <li><strong>Companies:</strong> Organizations posting job openings and managing their recruitment processes.</li>
                        <li><strong>HR Personnel:</strong> Individuals within Companies responsible for hiring and managing job postings.</li>
                    </ul>
                    <p>Provisions relevant to each category will be clearly specified. In the absence of such specification, the terms apply to all Users.</p>

                    <h3>Age Restriction:</h3>
                    <p>To access and use JobBox and its services, Users must be legally recognized as adults under applicable law.</p>

                    <h3>Right of Withdrawal:</h3>
                    <p>The right of withdrawal applies only to Users based in the European Union and is detailed in the relevant section of these Terms.</p>

                    <h3>Automatic Renewal:</h3>
                    <p>JobBox may utilize automatic renewal for subscription-based services. Details about the renewal period, cancellation procedures, and termination notice are provided in the relevant section of these Terms.</p>

                    <h3>General Terms:</h3>
                    <p>The terms outlined in this section generally apply to all Users of JobBox. Specific conditions may apply based on whether you are a Candidate, Company, or HR Personnel, and such conditions will be explicitly detailed in this document.</p>

                    <h3>Requirements:</h3>
                    <p>By using JobBox, Users confirm the following:</p>
                    <ul>
                        <li><strong>Candidates:</strong> Must be seeking employment or professional opportunities and must provide accurate information regarding their qualifications.</li>
                        <li><strong>Companies:</strong> Must be legitimate entities seeking to recruit and hire employees through JobBox.</li>
                        <li><strong>HR Personnel:</strong> Must be authorized representatives of Companies responsible for managing job postings and candidate interactions.</li>
                        <li>All Users, regardless of category, must be legally recognized as adults under applicable law.</li>
                    </ul>

                    <h3>Account Registration:</h3>
                    <p>To use the Service, Users must register or create a User account, providing all required data or information in a complete and truthful manner. Failure to do so will cause unavailability of the Service.</p>
                    <p>Users are responsible for keeping their login credentials confidential and safe. For this reason, Users are also required to choose passwords that meet the highest standards of strength permitted by this Application.</p>
                    <p>By registering, Users agree to be fully responsible for all activities that occur under their username and password. Users are required to immediately inform the Owner via the contact details if they think their personal information, including but not limited to User accounts, access credentials or personal data, have been violated, unduly disclosed, or stolen.</p>

                    <h3>Conditions for Account Registration:</h3>
                    <ul>
                        <li>Accounts registered by bots or any other automated methods are not permitted.</li>
                        <li>Unless otherwise specified, each User must register only one account.</li>
                        <li>Unless explicitly permitted, a User account may not be shared with other persons.</li>
                    </ul>

                    <h3>Account Termination:</h3>
                    <p>Users can terminate their account and stop using the Service at any time by contacting the Owner directly at the contact details provided.</p>

                    <h3>Account Suspension and Deletion:</h3>
                    <p>The Owner reserves the right, at its sole discretion, to suspend or delete at any time and without notice, User accounts that it deems inappropriate, offensive, or in violation of these Terms.</p>
                    <p>The suspension or deletion of User accounts shall not entitle Users to any claims for compensation, damages, or reimbursement.</p>
                    <p>The suspension or deletion of accounts due to causes attributable to the User does not exempt the User from paying any applicable fees or prices.</p>

                    <h3>Content on this Application:</h3>
                    <p>Unless otherwise specified or clearly recognizable, all content available on this Application is owned or provided by the Owner or its licensors.</p>
                    <p>The Owner undertakes its utmost effort to ensure that the content provided on this Application infringes no applicable legal provisions or third-party rights. However, it may not always be possible to achieve such a result.</p>
                    <p>In such cases, Users are kindly asked to report related complaints using the contact details provided in this document.</p>

                    <h3>Rights Regarding Content on this Application - All Rights Reserved:</h3>
                    <p>The Owner holds and reserves all intellectual property rights for any such content. Users may not use such content in any way that is not necessary or implicit in the proper use of the Service.</p>
                    <ul>
                        <li>Users may not copy, download, share (beyond the limits set forth below), modify, translate, transform, publish, transmit, sell, sublicense, edit, transfer/assign to third parties or create derivative works from the content available on this Application.</li>
                        <li>Where explicitly stated on this Application, Users may download, copy and/or share some content available through this Application for personal and non-commercial use provided that copyright attributions and all other attributions requested by the Owner are correctly implemented.</li>
                    </ul>

                    <h3>Content Provided by Users:</h3>
                    <p>The Owner allows Users to upload, share, or provide their own content to this Application. By providing content, Users confirm they are legally allowed to do so and that their content does not infringe third-party rights.</p>
                    <p>Users grant the Owner a worldwide, non-exclusive, free, sub-licensable and transferable license to use, display, reproduce, modify, adapt, publish and distribute such content in any medium, format or channel now known or later developed, for the purposes of operating and providing the Service and its functionalities.</p>

                    <h3>Removal of Content:</h3>
                    <p>Users are responsible for the content they provide. The Owner has the right to remove content that it deems unlawful, offensive, or in violation of these Terms, or otherwise harmful to the Service.</p>

                    <h3>Intellectual Property Rights:</h3>
                    <p>The Owner and its licensors own all intellectual property rights related to the Service, including copyrights, trademarks, and any other proprietary rights.</p>

                    <h3>Limitation of Liability:</h3>
                    <p>The Owner is not liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to the use of the Service. The Owner’s liability is limited to the fullest extent permitted by applicable law.</p>

                    <h3>Disclaimer of Warranties:</h3>
                    <p>The Service is provided “as is” and “as available” without any warranties of any kind. The Owner does not guarantee the accuracy, completeness, or reliability of the Service.</p>

                    <h3>Governing Law:</h3>
                    <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which the Owner is established, without regard to its conflict of law principles.</p>

                    <h3>Dispute Resolution:</h3>
                    <p>Any disputes arising from these Terms or the use of the Service shall be resolved through amicable negotiations. If the dispute cannot be resolved, it shall be submitted to the competent court of the jurisdiction where the Owner is established.</p>

                    <h3>Amendments to these Terms:</h3>
                    <p>The Owner reserves the right to amend these Terms at any time. Users will be notified of any changes and are required to review the updated Terms regularly.</p>
                </Card>
            </div>
            <div>
                <HomeFooter />
            </div>
        </div>
    )
}

export default DataDeletionPolicy
