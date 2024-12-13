import React from 'react'
import { Card } from 'react-bootstrap'
import CustomNavbar from './CustomNavbar'
import Footer from './Footer'

const PrivacyPolicy = () => {
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
                right: '100px',
            }}>
                <h1 className='text-center'>Privacy Policy</h1>
                {/* style={{ marginTop: '20px', width: '100%', height: "fit-content", marginLeft: '10px' }} */}
                <Card className='job-card' style={{ marginLeft: '130px', width: '90%',padding:'12px'}}>
                    <p><strong>Last Updated: [Date]</strong></p>
                    <p><strong>Welcome to jobbox .</strong> This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [Your Website URL] (the "Site") and use our services (the "Services"). Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site.</p>

                    <h3>Information We Collect</h3><br />
                    <h4>Personal Information:</h4>
                    <ul>
                        <li><strong>Account Information:</strong> When you register for an account, we collect personal details such as your name, email address, phone number, and job-related information.</li>
                        <li><strong>Application Information:</strong> We collect CVs, resumes, cover letters, and other application materials you submit, including your education, employment history, and skills.</li>
                        <li><strong>Communication:</strong> We may collect information from communications you have with us, such as emails or support requests.</li>
                    </ul>

                    <h4>Automatically Collected Information:</h4>
                    <ul>
                        <li><strong>Usage Data:</strong> We collect information about your interactions with our Site, including IP address, browser type, operating system, referring URLs, and pages visited.</li>
                        <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience on our Site and analyze usage patterns.</li>
                    </ul>

                    <h3>How We Use Your Information</h3>
                    <ul>
                        <li>Provide and manage our Services.</li>
                        <li>Process job applications and facilitate communication between job seekers and employers.</li>
                        <li>Send you updates, notifications, and marketing communications related to our Services.</li>
                        <li>Improve our Site and Services through analysis and feedback.</li>
                        <li>Comply with legal obligations and enforce our terms and policies.</li>
                    </ul>

                    <h3>Sharing Your Information</h3>
                    <ul>
                        <li><strong>Employers and Recruiters:</strong> To facilitate job applications and employment opportunities.</li>
                        <li><strong>Service Providers:</strong> Third parties who perform services on our behalf, such as hosting, data analysis, and marketing.</li>
                        <li><strong>Legal Requirements:</strong> If required by law or to protect our rights, we may disclose your information to comply with legal obligations.</li>
                    </ul>

                    <h3>Cookies and Tracking Technologies</h3>
                    <p>We use cookies and similar technologies to collect and store information about your preferences and usage patterns. You can manage your cookie preferences through your browser settings. For more information, refer to our Cookie Policy.</p>

                    <h3>Social Media Logins</h3>
                    <p>If you use social media accounts to register or log in, we may collect information from those accounts. This information is used as described in this Privacy Policy and according to the social media provider’s privacy policies.</p>

                    <h3>Third-Party Websites</h3>
                    <p>Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to review their privacy policies.</p>

                    <h3>Data Retention</h3>
                    <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.</p>

                    <h3>Security</h3>
                    <p>We implement reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

                    <h3>Children’s Privacy</h3>
                    <p>Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware of such information, we will take steps to delete it.</p>

                    <h3>Your Privacy Rights</h3>
                    <p>You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing activities. To exercise these rights, please contact us using the details below.</p>

                    <h3>Do-Not-Track Signals</h3>
                    <p>We do not currently respond to Do-Not-Track signals. If a standard for online tracking is adopted, we will update this Privacy Policy accordingly.</p>

                    <h3>Policy Updates</h3>
                    <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our Site. Your continued use of the Site after changes constitutes your acceptance of the updated policy.</p>

                    <h2>Contact Us</h2>
                    <p>If you have any questions or concerns about this Privacy Policy or our practices, </p>
                    <p>please contact us at:<a href="mailto:info@paisafund.com">info@paisafund.com</a></p>
            </Card>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default PrivacyPolicy
