import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const PrivacyPolicyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Last Updated */}
        <View style={styles.lastUpdatedSection}>
          <Text style={styles.lastUpdatedText}>Last updated: January 15, 2025</Text>
        </View>

        {/* Privacy Content */}
        <View style={styles.privacySection}>
          <Text style={styles.privacyTitle}>Privacy Policy</Text>

          <Text style={styles.privacyText}>
            At AssignMint, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.subsectionTitle}>Personal Information</Text>
          <Text style={styles.privacyText}>
            We collect information you provide directly to us, such as when you create an account, complete your profile, or communicate with us:
          </Text>
          <Text style={styles.bulletPoint}>• Name, email address, and phone number</Text>
          <Text style={styles.bulletPoint}>• Profile information and academic background</Text>
          <Text style={styles.bulletPoint}>• Payment and billing information</Text>
          <Text style={styles.bulletPoint}>• Communication preferences</Text>

          <Text style={styles.subsectionTitle}>Usage Information</Text>
          <Text style={styles.privacyText}>
            We automatically collect certain information about your use of our platform:
          </Text>
          <Text style={styles.bulletPoint}>• Device information and IP address</Text>
          <Text style={styles.bulletPoint}>• Usage patterns and interactions</Text>
          <Text style={styles.bulletPoint}>• Log data and analytics</Text>
          <Text style={styles.bulletPoint}>• Cookies and similar technologies</Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.privacyText}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
          <Text style={styles.bulletPoint}>• Process transactions and payments</Text>
          <Text style={styles.bulletPoint}>• Facilitate communication between users</Text>
          <Text style={styles.bulletPoint}>• Improve our platform and user experience</Text>
          <Text style={styles.bulletPoint}>• Send important updates and notifications</Text>
          <Text style={styles.bulletPoint}>• Ensure platform security and prevent fraud</Text>

          <Text style={styles.sectionTitle}>3. Information Sharing and Disclosure</Text>
          <Text style={styles.privacyText}>
            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
          </Text>
          <Text style={styles.subsectionTitle}>With Other Users</Text>
          <Text style={styles.privacyText}>
            Your profile information may be visible to other users to facilitate task matching and communication.
          </Text>
          <Text style={styles.subsectionTitle}>Service Providers</Text>
          <Text style={styles.privacyText}>
            We work with trusted third-party service providers who assist us in operating our platform, processing payments, and providing customer support.
          </Text>
          <Text style={styles.subsectionTitle}>Legal Requirements</Text>
          <Text style={styles.privacyText}>
            We may disclose your information if required by law or to protect our rights, property, or safety.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.privacyText}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </Text>
          <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
          <Text style={styles.bulletPoint}>• Regular security assessments</Text>
          <Text style={styles.bulletPoint}>• Access controls and authentication</Text>
          <Text style={styles.bulletPoint}>• Secure data transmission protocols</Text>

          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.privacyText}>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We may retain certain information for legal, regulatory, or business purposes.
          </Text>

          <Text style={styles.sectionTitle}>6. Your Rights and Choices</Text>
          <Text style={styles.privacyText}>
            You have certain rights regarding your personal information:
          </Text>
          <Text style={styles.bulletPoint}>• Access and review your personal information</Text>
          <Text style={styles.bulletPoint}>• Update or correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Request deletion of your account</Text>
          <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Control cookie preferences</Text>

          <Text style={styles.sectionTitle}>7. Cookies and Tracking Technologies</Text>
          <Text style={styles.privacyText}>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
          </Text>

          <Text style={styles.sectionTitle}>8. Third-Party Links</Text>
          <Text style={styles.privacyText}>
            Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
          </Text>

          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.privacyText}>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>10. Children's Privacy</Text>
          <Text style={styles.privacyText}>
            Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
          </Text>

          <Text style={styles.sectionTitle}>11. Changes to This Privacy Policy</Text>
          <Text style={styles.privacyText}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our platform and updating the "Last updated" date.
          </Text>

          <Text style={styles.sectionTitle}>12. Contact Us</Text>
          <Text style={styles.privacyText}>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@assignmint.com</Text>
          <Text style={styles.contactInfo}>Data Protection Officer: dpo@assignmint.com</Text>
          <Text style={styles.contactInfo}>Address: 123 Assignment Street, Education City, EC 12345</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using AssignMint, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  lastUpdatedSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  privacySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  privacyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  privacyText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    color: '#007AFF',
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PrivacyPolicyScreen;
