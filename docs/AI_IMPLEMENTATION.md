# AI Implementation Guide

## Overview

This document describes the complete AI implementation for the AssignMint app, including backend services, frontend integration, and configuration requirements.

## Architecture

### Backend AI Service
- **Location**: `backend/src/ai/aiService.ts`
- **Technology**: OpenAI GPT-4o-mini API
- **Database**: Firebase Firestore for conversation persistence
- **Features**: Subject detection, contextual responses, session management

### Frontend AI Integration
- **Location**: `src/services/AIApiService.ts` and `src/hooks/useAIChat.ts`
- **Features**: Real-time chat, session management, error handling
- **UI**: Enhanced chat interface with connection status

## Setup Requirements

### 1. OpenAI API Key
You need an OpenAI API key to use the AI features:

```bash
# Add to backend/.env
OPENAI_API_KEY=your-openai-api-key-here
```

**To get an OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to your environment variables

### 2. Backend Dependencies
Install the required packages:

```bash
cd backend
npm install openai
```

### 3. Firebase Configuration
Ensure your Firebase project has Firestore enabled and proper security rules.

## Features

### 1. Smart Subject Detection
- **Automatic**: Detects academic subjects from user input
- **AI-Powered**: Uses OpenAI for accurate categorization
- **Fallback**: Keyword-based detection when AI is unavailable
- **Supported Subjects**: Math, Computer Science, English, Physics, Chemistry, Biology, History, Economics, Psychology

### 2. Tutor Behavior
The AI acts as an intelligent study tutor with these characteristics:

- **Step-by-step explanations** - Breaks down complex problems
- **Clarifying questions** - Asks for more details when needed
- **Context awareness** - Remembers conversation history
- **Concept building** - Focuses on understanding over answers
- **Encouraging tone** - Supportive and educational approach

### 3. Memory System
- **Short-term**: In-memory conversation context (last 10 messages)
- **Long-term**: Firestore persistence for chat sessions
- **Session Management**: Create, load, and delete chat sessions
- **Context Preservation**: AI remembers previous questions and builds on them

### 4. Error Handling
- **Connection Status**: Real-time monitoring of AI service health
- **Graceful Degradation**: Fallback responses when OpenAI is unavailable
- **User Feedback**: Clear error messages and retry options
- **Network Resilience**: Handles connection issues gracefully

## API Endpoints

### Backend Routes (`/ai`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sessions` | POST | Create new chat session |
| `/sessions` | GET | Get user's chat sessions |
| `/sessions/:id` | GET | Load specific session |
| `/sessions/:id` | DELETE | Delete session |
| `/chat` | POST | Send message and get AI response |
| `/process-image` | POST | Process image with OCR |
| `/process-document` | POST | Process document analysis |
| `/detect-subject` | POST | Detect subject from text |
| `/health` | GET | Check AI service health |

### Frontend Service Methods

```typescript
// Create new session
const sessionId = await aiApiService.createNewSession();

// Send message
const response = await aiApiService.sendMessage(message, sessionId, explanationMode);

// Load session
const messages = await aiApiService.loadSession(sessionId);

// Check connection
const isConnected = await aiApiService.testConnection();
```

## Configuration

### Environment Variables

#### Backend (`.env`)
```bash
# Required
OPENAI_API_KEY=your-openai-api-key

# Optional (for development)
REACT_APP_API_URL=http://localhost:3000
```

#### Frontend (`.env`)
```bash
# Optional (for development)
REACT_APP_API_URL=http://localhost:3000
```

### OpenAI Model Configuration
The service uses GPT-4o-mini by default. You can modify the model in `backend/src/ai/aiService.ts`:

```typescript
const response = await this.openai.chat.completions.create({
  model: 'gpt-4o-mini', // Change to 'gpt-4o' for more advanced responses
  // ... other options
});
```

## Usage Examples

### 1. Basic Chat
```typescript
// User sends a message
const response = await aiApiService.sendMessage(
  "Can you help me solve this math problem: 2x + 5 = 13?",
  sessionId,
  true // explanation mode
);

// AI responds with step-by-step solution
console.log(response.aiMessage.text);
```

### 2. Subject Detection
```typescript
// Detect subject from text
const detection = await aiApiService.detectSubject(
  "Write a JavaScript function to sort an array"
);

console.log(detection.subject); // "Computer Science"
console.log(detection.confidence); // 0.95
```

### 3. Session Management
```typescript
// Create new session
const sessionId = await aiApiService.createNewSession();

// Load existing session
const messages = await aiApiService.loadSession(sessionId);

// Get user sessions
const sessions = await aiApiService.getUserSessions();
```

## Security Considerations

### 1. Authentication
- All AI endpoints require valid Firebase authentication
- User ID is extracted from JWT token
- Sessions are scoped to authenticated users

### 2. Rate Limiting
- Backend implements rate limiting (100 requests per 15 minutes)
- OpenAI API has its own rate limits
- Consider implementing user-specific rate limiting

### 3. Data Privacy
- User messages are stored in Firestore
- OpenAI may use data for service improvement (check their privacy policy)
- Consider implementing data retention policies

## Monitoring and Debugging

### 1. Health Checks
```bash
# Check AI service health
curl http://localhost:3000/ai/health
```

### 2. Logs
- Backend logs are handled by Winston
- Check console for frontend errors
- Monitor OpenAI API usage and costs

### 3. Common Issues

#### OpenAI API Errors
- **401 Unauthorized**: Check API key
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Check OpenAI service status

#### Connection Issues
- **Backend unavailable**: Check if server is running
- **Firebase connection**: Verify Firebase configuration
- **Network issues**: Check internet connectivity

## Performance Optimization

### 1. Token Management
- Limit conversation context to last 10 messages
- Implement message truncation for long conversations
- Consider implementing streaming responses

### 2. Caching
- Cache subject detection results
- Implement session caching
- Consider Redis for high-traffic scenarios

### 3. Response Optimization
- Use appropriate temperature settings for different modes
- Implement response length limits
- Consider async processing for heavy operations

## Future Enhancements

### 1. Advanced Features
- **Streaming responses** for real-time typing
- **Voice input/output** integration
- **Multi-language support**
- **Advanced document analysis**

### 2. Integration Opportunities
- **Google Vision API** for better OCR
- **Azure Cognitive Services** for document analysis
- **Custom fine-tuned models** for specific subjects

### 3. Analytics
- **Usage tracking** and analytics
- **Performance metrics**
- **User feedback collection**

## Troubleshooting

### 1. AI Not Responding
1. Check connection status in the UI
2. Verify OpenAI API key is valid
3. Check backend logs for errors
4. Ensure Firebase is properly configured

### 2. Slow Responses
1. Check OpenAI API response times
2. Monitor network latency
3. Consider upgrading to faster models
4. Implement response caching

### 3. Memory Issues
1. Check Firestore query performance
2. Implement pagination for large conversations
3. Monitor memory usage in the app
4. Clear old sessions periodically

## Support

For issues related to:
- **OpenAI API**: Check [OpenAI Status Page](https://status.openai.com/)
- **Firebase**: Check [Firebase Status](https://status.firebase.google.com/)
- **App-specific**: Check backend logs and frontend console

## Cost Considerations

### OpenAI API Pricing (as of 2024)
- **GPT-4o-mini**: $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
- **GPT-4o**: $0.0025 per 1K input tokens, $0.01 per 1K output tokens

### Cost Optimization
- Use GPT-4o-mini for most interactions
- Implement token counting and limits
- Monitor usage patterns
- Consider implementing user quotas

## Conclusion

This AI implementation provides a robust, scalable foundation for intelligent tutoring in the AssignMint app. The combination of OpenAI's advanced language models with Firebase's real-time database creates a powerful learning experience that remembers context and provides personalized assistance.

The system is designed to be resilient, with fallback mechanisms and comprehensive error handling, ensuring users always have a helpful experience even when external services are unavailable.
