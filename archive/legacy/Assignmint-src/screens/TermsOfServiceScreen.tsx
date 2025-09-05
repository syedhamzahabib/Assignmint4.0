import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const TermsOfServiceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Last Updated */}
        <View style={styles.lastUpdatedSection}>
          <Text style={styles.lastUpdatedText}>Last updated: January 15, 2025</Text>
        </View>

        {/* Terms Content */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms of Service</Text>

          <Text style={styles.termsText}>
            Welcome to AssignMint. These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using AssignMint, you agree to be bound by these Terms.
          </Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.termsText}>
            By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not use our services.
          </Text>

          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.termsText}>
            AssignMint is a student-focused assignment marketplace that connects students who need help with their assignments with qualified individuals who can provide assistance. Our platform facilitates the posting, bidding, and completion of academic tasks.
          </Text>

          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.termsText}>
            You must create an account to use our services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.
          </Text>

          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.termsText}>
            As a user of AssignMint, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide accurate and truthful information</Text>
          <Text style={styles.bulletPoint}>• Respect intellectual property rights</Text>
          <Text style={styles.bulletPoint}>• Not engage in academic dishonesty</Text>
          <Text style={styles.bulletPoint}>• Comply with all applicable laws and regulations</Text>
          <Text style={styles.bulletPoint}>• Maintain appropriate behavior and communication</Text>

          <Text style={styles.sectionTitle}>5. Payment and Fees</Text>
          <Text style={styles.termsText}>
            AssignMint charges service fees on completed transactions. All payments are processed securely through our payment partners. Users are responsible for any applicable taxes on their earnings.
          </Text>

          <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
          <Text style={styles.termsText}>
            Users retain ownership of their original content. However, by using our platform, you grant AssignMint a license to use, display, and distribute your content as necessary to provide our services.
          </Text>

          <Text style={styles.sectionTitle}>7. Privacy and Data Protection</Text>
          <Text style={styles.termsText}>
            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </Text>

          <Text style={styles.sectionTitle}>8. Prohibited Activities</Text>
          <Text style={styles.termsText}>
            You may not use our services to:
          </Text>
          <Text style={styles.bulletPoint}>• Violate any laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Infringe on intellectual property rights</Text>
          <Text style={styles.bulletPoint}>• Engage in fraudulent activities</Text>
          <Text style={styles.bulletPoint}>• Harass or harm other users</Text>
          <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>

          <Text style={styles.sectionTitle}>9. Dispute Resolution</Text>
          <Text style={styles.termsText}>
            We encourage users to resolve disputes amicably. If a dispute cannot be resolved, it will be handled through our dispute resolution process. AssignMint reserves the right to make final decisions on disputes.
          </Text>

          <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
          <Text style={styles.termsText}>
            AssignMint is not liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability is limited to the amount you paid for our services in the 12 months preceding the claim.
          </Text>

          <Text style={styles.sectionTitle}>11. Termination</Text>
          <Text style={styles.termsText}>
            We may terminate or suspend your account at any time for violations of these Terms. You may also terminate your account at any time by contacting our support team.
          </Text>

          <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
          <Text style={styles.termsText}>
            We may update these Terms from time to time. We will notify users of significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new Terms.
          </Text>

          <Text style={styles.sectionTitle}>13. Governing Law</Text>
          <Text style={styles.termsText}>
            These Terms are governed by the laws of the jurisdiction in which AssignMint operates. Any disputes will be resolved in the courts of that jurisdiction.
          </Text>

          <Text style={styles.sectionTitle}>14. Contact Information</Text>
          <Text style={styles.termsText}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@assignmint.com</Text>
          <Text style={styles.contactInfo}>Address: 123 Assignment Street, Education City, EC 12345</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using AssignMint, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
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
  termsSection: {
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
  termsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  termsText: {
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

export default TermsOfServiceScreen;
