# AssignMint Disaster Recovery Runbook

## Overview

This document provides step-by-step procedures for disaster recovery scenarios in the AssignMint backend system. It covers various failure modes and recovery procedures to ensure business continuity.

## Emergency Contacts

- **DevOps Lead**: [Contact Information]
- **Backend Team Lead**: [Contact Information]
- **System Administrator**: [Contact Information]
- **On-Call Engineer**: [Contact Information]

## Quick Reference

### Critical Services Status
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Search**: Algolia
- **Email**: SMTP Service
- **Webhooks**: Custom Webhook Service

### Recovery Time Objectives (RTO)
- **Critical Services**: 15 minutes
- **Non-Critical Services**: 1 hour
- **Full System Recovery**: 4 hours

### Recovery Point Objectives (RPO)
- **Database**: 5 minutes
- **File Storage**: 15 minutes
- **Search Index**: 1 hour

## 1. Database Failure Recovery

### Scenario: Firebase Firestore Unavailable

#### Symptoms
- API endpoints returning 500 errors
- Database connection timeouts
- Firestore console showing service disruption

#### Immediate Actions
1. **Check Firebase Status Page**
   ```bash
   # Check Firebase status
   curl -s https://status.firebase.google.com/ | grep -i "firestore"
   ```

2. **Verify Network Connectivity**
   ```bash
   # Test connection to Firebase
   curl -s "https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents" \
     -H "Authorization: Bearer $(gcloud auth print-access-token)"
   ```

3. **Check Environment Variables**
   ```bash
   # Verify Firebase credentials
   echo "FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID}"
   echo "FIREBASE_CLIENT_EMAIL: ${FIREBASE_CLIENT_EMAIL}"
   ```

#### Recovery Procedures

**Option 1: Credential Refresh**
```bash
# Regenerate Firebase service account key
gcloud iam service-accounts keys create key.json \
  --iam-account=${FIREBASE_CLIENT_EMAIL}

# Update environment variables
export FIREBASE_PRIVATE_KEY=$(cat key.json | jq -r '.private_key')
```

**Option 2: Switch to Backup Project**
```bash
# Update environment to backup project
export FIREBASE_PROJECT_ID=${BACKUP_PROJECT_ID}
export FIREBASE_CLIENT_EMAIL=${BACKUP_CLIENT_EMAIL}
export FIREBASE_PRIVATE_KEY=${BACKUP_PRIVATE_KEY}

# Restart backend service
npm run restart
```

**Option 3: Emergency Mode with Cached Data**
```bash
# Enable emergency mode (uses local cache)
export EMERGENCY_MODE=true
export USE_CACHE_ONLY=true

# Restart with reduced functionality
npm run start:emergency
```

#### Verification Steps
1. Test basic API endpoints
2. Verify database read/write operations
3. Check application logs for errors
4. Monitor system metrics

## 2. Authentication Service Failure

### Scenario: Firebase Auth Unavailable

#### Symptoms
- Users unable to login
- JWT token validation failures
- 401 errors on all authenticated endpoints

#### Immediate Actions
1. **Check Firebase Auth Status**
   ```bash
   # Test auth endpoint
   curl -s "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword" \
     -H "Content-Type: application/json" \
     -d '{"returnSecureToken":true}'
   ```

2. **Verify Service Account Permissions**
   ```bash
   # Check IAM permissions
   gcloud projects get-iam-policy ${PROJECT_ID} \
     --flatten="bindings[].members" \
     --filter="bindings.members:${FIREBASE_CLIENT_EMAIL}" \
     --format="table(bindings.role)"
   ```

#### Recovery Procedures

**Option 1: Service Account Recovery**
```bash
# Create new service account if needed
gcloud iam service-accounts create firebase-admin \
  --display-name="Firebase Admin SDK"

# Grant necessary permissions
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:firebase-admin@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"
```

**Option 2: Emergency Auth Mode**
```bash
# Enable emergency authentication (local validation)
export EMERGENCY_AUTH=true
export AUTH_BYPASS_SECRET=${EMERGENCY_SECRET}

# Restart with emergency auth
npm run start:emergency-auth
```

#### Verification Steps
1. Test user login flow
2. Verify token validation
3. Check user session management
4. Monitor authentication logs

## 3. Storage Service Failure

### Scenario: Firebase Storage Unavailable

#### Symptoms
- File uploads failing
- Image/attachment loading errors
- Storage-related API failures

#### Immediate Actions
1. **Check Storage Status**
   ```bash
   # Test storage bucket access
   gsutil ls gs://${STORAGE_BUCKET}
   ```

2. **Verify Bucket Permissions**
   ```bash
   # Check bucket IAM
   gsutil iam get gs://${STORAGE_BUCKET}
   ```

#### Recovery Procedures

**Option 1: Bucket Recovery**
```bash
# Recreate bucket if deleted
gsutil mb gs://${STORAGE_BUCKET}

# Set proper permissions
gsutil iam ch serviceAccount:${FIREBASE_CLIENT_EMAIL}:objectAdmin gs://${STORAGE_BUCKET}
```

**Option 2: Emergency Storage Mode**
```bash
# Switch to local file storage
export STORAGE_MODE=local
export LOCAL_STORAGE_PATH=/tmp/emergency-storage

# Create emergency storage directory
mkdir -p ${LOCAL_STORAGE_PATH}
```

#### Verification Steps
1. Test file upload functionality
2. Verify file retrieval
3. Check storage permissions
4. Monitor storage usage

## 4. Search Service Failure

### Scenario: Algolia Search Unavailable

#### Symptoms
- Search functionality not working
- Search API timeouts
- Search results empty or errors

#### Immediate Actions
1. **Check Algolia Status**
   ```bash
   # Test Algolia connectivity
   curl -s "https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes" \
     -H "X-Algolia-API-Key: ${ALGOLIA_ADMIN_API_KEY}"
   ```

2. **Verify API Keys**
   ```bash
   # Check Algolia configuration
   echo "ALGOLIA_APP_ID: ${ALGOLIA_APP_ID}"
   echo "ALGOLIA_ADMIN_API_KEY: ${ALGOLIA_ADMIN_API_KEY}"
   ```

#### Recovery Procedures

**Option 1: API Key Recovery**
```bash
# Generate new API key if needed
# This must be done through Algolia dashboard
echo "Please generate new API key in Algolia dashboard"
```

**Option 2: Fallback Search Mode**
```bash
# Enable Firestore-only search
export SEARCH_MODE=firestore
export DISABLE_ALGOLIA=true

# Restart with fallback search
npm run start:fallback-search
```

#### Verification Steps
1. Test search functionality
2. Verify search results
3. Check search performance
4. Monitor search logs

## 5. Email Service Failure

### Scenario: SMTP Service Unavailable

#### Symptoms
- Email notifications not sending
- Password reset emails failing
- Welcome emails not delivered

#### Immediate Actions
1. **Check SMTP Status**
   ```bash
   # Test SMTP connection
   telnet ${SMTP_HOST} ${SMTP_PORT}
   ```

2. **Verify SMTP Credentials**
   ```bash
   # Check email configuration
   echo "SMTP_HOST: ${SMTP_HOST}"
   echo "SMTP_USER: ${SMTP_USER}"
   echo "SMTP_PASS: ${SMTP_PASS}"
   ```

#### Recovery Procedures

**Option 1: SMTP Recovery**
```bash
# Test with alternative SMTP service
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USER=${GMAIL_USER}
export SMTP_PASS=${GMAIL_APP_PASSWORD}
```

**Option 2: Emergency Email Mode**
```bash
# Enable email queuing (don't fail on email errors)
export EMAIL_QUEUE_MODE=true
export EMAIL_FAIL_GRACEFULLY=true

# Restart with email queuing
npm run start:email-queue
```

#### Verification Steps
1. Test email sending
2. Verify email delivery
3. Check email logs
4. Monitor email queue

## 6. Webhook Service Failure

### Scenario: Webhook Processing Failing

#### Symptoms
- External service integrations not working
- Payment webhooks failing
- Third-party notifications not received

#### Immediate Actions
1. **Check Webhook Status**
   ```bash
   # Check webhook processing
   curl -s "${BACKEND_URL}/admin/webhooks/status"
   ```

2. **Verify Webhook Secret**
   ```bash
   # Check webhook configuration
   echo "WEBHOOK_SECRET: ${WEBHOOK_SECRET}"
   ```

#### Recovery Procedures

**Option 1: Webhook Recovery**
```bash
# Regenerate webhook secret
export WEBHOOK_SECRET=$(openssl rand -hex 32)

# Restart webhook service
npm run restart:webhooks
```

**Option 2: Emergency Webhook Mode**
```bash
# Enable webhook queuing
export WEBHOOK_QUEUE_MODE=true
export WEBHOOK_RETRY_LIMIT=10

# Restart with webhook queuing
npm run start:webhook-queue
```

#### Verification Steps
1. Test webhook endpoints
2. Verify webhook processing
3. Check webhook logs
4. Monitor webhook queue

## 7. Full System Recovery

### Scenario: Complete System Failure

#### Symptoms
- All services unavailable
- Database connection lost
- Application not responding

#### Immediate Actions
1. **Assess Damage**
   ```bash
   # Check all service statuses
   ./scripts/health-check.sh
   ```

2. **Activate Emergency Procedures**
   ```bash
   # Enable emergency mode
   export EMERGENCY_MODE=true
   export MAINTENANCE_MODE=true
   ```

#### Recovery Procedures

**Phase 1: Core Services**
```bash
# 1. Restore database connectivity
./scripts/restore-db.sh

# 2. Restart authentication
./scripts/restart-auth.sh

# 3. Verify basic functionality
./scripts/verify-core.sh
```

**Phase 2: Supporting Services**
```bash
# 1. Restore search functionality
./scripts/restore-search.sh

# 2. Restore email service
./scripts/restore-email.sh

# 3. Restore webhook processing
./scripts/restore-webhooks.sh
```

**Phase 3: Full Recovery**
```bash
# 1. Disable emergency mode
export EMERGENCY_MODE=false
export MAINTENANCE_MODE=false

# 2. Restart all services
./scripts/restart-all.sh

# 3. Run full system tests
./scripts/system-test.sh
```

#### Verification Steps
1. Run comprehensive health checks
2. Test all major user flows
3. Verify data integrity
4. Monitor system performance

## 8. Data Recovery Procedures

### Database Recovery

#### Firestore Export/Import
```bash
# Export data
gcloud firestore export gs://${BACKUP_BUCKET}/firestore-backup-$(date +%Y%m%d)

# Import data
gcloud firestore import gs://${BACKUP_BUCKET}/firestore-backup-$(date +%Y%m%d)
```

#### Collection Recovery
```bash
# Restore specific collection
./scripts/restore-collection.sh users
./scripts/restore-collection.sh tasks
./scripts/restore-collection.sh ratings
```

### File Recovery

#### Storage Recovery
```bash
# List available backups
gsutil ls gs://${BACKUP_BUCKET}/storage-backups/

# Restore specific backup
gsutil -m cp -r gs://${BACKUP_BUCKET}/storage-backups/$(date +%Y%m%d)/* gs://${STORAGE_BUCKET}/
```

## 9. Monitoring and Alerting

### Health Check Scripts

#### Basic Health Check
```bash
#!/bin/bash
# scripts/health-check.sh

echo "Checking system health..."

# Check API endpoints
curl -f "${BACKEND_URL}/health" || echo "API health check failed"
curl -f "${BACKEND_URL}/admin/status" || echo "Admin status check failed"

# Check database
curl -f "${BACKEND_URL}/admin/db-status" || echo "Database status check failed"

# Check external services
curl -f "https://status.firebase.google.com/" || echo "Firebase status check failed"
```

#### Comprehensive Health Check
```bash
#!/bin/bash
# scripts/comprehensive-health-check.sh

echo "Running comprehensive health check..."

# Check all services
./scripts/check-db.sh
./scripts/check-auth.sh
./scripts/check-storage.sh
./scripts/check-search.sh
./scripts/check-email.sh
./scripts/check-webhooks.sh

# Generate health report
./scripts/generate-health-report.sh
```

### Alerting Configuration

#### Critical Alerts
- Database connection failure
- Authentication service down
- Storage service unavailable
- High error rate (>5%)
- Service response time >2s

#### Warning Alerts
- High CPU usage (>80%)
- High memory usage (>85%)
- High disk usage (>90%)
- Backup failures
- Migration failures

## 10. Post-Recovery Procedures

### System Verification
1. **Run Full Test Suite**
   ```bash
   npm run test:backend
   npm run test:integration
   npm run test:e2e
   ```

2. **Verify Data Integrity**
   ```bash
   ./scripts/verify-data-integrity.sh
   ./scripts/check-referential-integrity.sh
   ```

3. **Performance Testing**
   ```bash
   ./scripts/load-test.sh
   ./scripts/stress-test.sh
   ```

### Documentation Updates
1. Update incident log
2. Document lessons learned
3. Update recovery procedures
4. Review and improve monitoring

### Team Communication
1. Notify stakeholders of recovery
2. Schedule post-mortem meeting
3. Update status page
4. Communicate with users if needed

## 11. Prevention and Preparedness

### Regular Maintenance
- **Daily**: Health checks, log review
- **Weekly**: Backup verification, performance monitoring
- **Monthly**: Security updates, dependency updates
- **Quarterly**: Disaster recovery drills, documentation review

### Backup Strategy
- **Database**: Continuous backup with 5-minute RPO
- **Files**: Hourly incremental backups
- **Configuration**: Version controlled in Git
- **Code**: Multiple deployment environments

### Monitoring Strategy
- **Real-time**: Service health, error rates, performance
- **Near real-time**: Business metrics, user activity
- **Batch**: Analytics, reporting, trend analysis

## 12. Emergency Contacts and Escalation

### Escalation Matrix
1. **Level 1**: On-call engineer (15 minutes)
2. **Level 2**: Backend team lead (30 minutes)
3. **Level 3**: DevOps lead (1 hour)
4. **Level 4**: CTO/VP Engineering (2 hours)

### Communication Channels
- **Emergency**: Phone, SMS
- **Updates**: Slack, Email
- **Status**: Status page, Twitter
- **Documentation**: Internal wiki, runbooks

## Conclusion

This disaster recovery runbook provides comprehensive procedures for handling various failure scenarios. Regular review and updates are essential to ensure the procedures remain current and effective.

**Remember**: In an emergency, prioritize:
1. **Safety**: Ensure no data loss or corruption
2. **Communication**: Keep stakeholders informed
3. **Documentation**: Record all actions taken
4. **Learning**: Improve procedures based on experience

---

*Last Updated: [Date]*
*Next Review: [Date]*
*Version: 1.0*
