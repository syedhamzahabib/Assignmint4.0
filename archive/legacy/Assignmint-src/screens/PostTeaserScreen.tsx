import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../constants';
import { useAuthStore } from '../services/AuthStore';
import { analytics, ANALYTICS_EVENTS } from '../services/AnalyticsService';

interface PostTeaserScreenProps {
  navigation: any;
}

const PostTeaserScreen: React.FC<PostTeaserScreenProps> = ({ navigation }) => {
  const { setPendingRoute } = useAuthStore();

  useEffect(() => {
    // Track post teaser view
    analytics.track(ANALYTICS_EVENTS.POST_TEASER_VIEW);
  }, []);

  const handleSignUpToPost = () => {
    // Store the intended route for post-auth redirect
    setPendingRoute('Post', { fromGuest: true });
    navigation.navigate('SignUp');
  };

  const handleBrowseTasks = () => {
    navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={require('../../ios/Assignmint/Images.xcassets/postteaser.imageset/postteaser.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Upper half - empty to let background image show */}
          <View style={styles.upperHalf} />

          {/* Lower half - CTA buttons */}
          <View style={styles.lowerHalf}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSignUpToPost}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Sign up to post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleBrowseTasks}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Browse tasks first</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  upperHalf: {
    flex: 1,
  },
  lowerHalf: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    textAlign: 'center',
  },
});

export default PostTeaserScreen;
