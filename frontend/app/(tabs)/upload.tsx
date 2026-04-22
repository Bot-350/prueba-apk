import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, FONTS } from '../../src/theme';
import { useArt } from '../../src/store';
import { useAuth } from '../../src/auth';

export default function UploadScreen() {
  const { addArtwork } = useArt();
  const { user } = useAuth();
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'We need access to your gallery to pick an image.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.85,
        base64: true,
      });
      if (res.canceled) return;
      const asset = res.assets[0];
      if (asset.base64) {
        setImage(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        setImage(asset.uri);
      }
      if (asset.width && asset.height) setAspect(asset.width / asset.height);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not open gallery');
    }
  };

  const submit = async () => {
    if (!image) return Alert.alert('Missing image', 'Please pick an image.');
    if (!title.trim()) return Alert.alert('Missing title', 'Please enter a title.');
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) return Alert.alert('Invalid price', 'Please enter a valid price.');
    setSubmitting(true);
    try {
      await addArtwork({
        title: title.trim(),
        description: desc.trim() || 'No description',
        price: p,
        imageUrl: image,
        aspectRatio: aspect,
        author: user?.name || 'Anonymous',
        authorAvatar: user?.picture,
        uploadedBy: user?.user_id,
      });
      setImage(null);
      setTitle('');
      setDesc('');
      setPrice('');
      Alert.alert('Uploaded', 'Your artwork is now live!', [
        { text: 'View feed', onPress: () => router.push('/(tabs)') },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="upload-screen">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.h1}>Upload artwork</Text>
          <Text style={styles.sub}>Share your latest piece with the community.</Text>

          <TouchableOpacity
            style={styles.picker}
            onPress={pickImage}
            activeOpacity={0.85}
            testID="upload-pick-image"
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
            ) : (
              <View style={styles.pickerEmpty}>
                <ImagePlus color={COLORS.primary} size={36} strokeWidth={2} />
                <Text style={styles.pickerText}>Tap to choose from gallery</Text>
                <Text style={styles.pickerHint}>JPG or PNG • Any aspect ratio</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Title</Text>
          <TextInput
            testID="upload-input-title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Moonlit Harbor"
            placeholderTextColor={COLORS.textTertiary}
            style={styles.input}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            testID="upload-input-desc"
            value={desc}
            onChangeText={setDesc}
            placeholder="Tell the story behind your piece"
            placeholderTextColor={COLORS.textTertiary}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Price (USD)</Text>
          <TextInput
            testID="upload-input-price"
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            placeholderTextColor={COLORS.textTertiary}
            style={styles.input}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={[styles.submit, submitting && { opacity: 0.7 }]}
            onPress={submit}
            disabled={submitting}
            activeOpacity={0.9}
            testID="upload-submit-btn"
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <>
                <Check color={COLORS.onPrimary} size={18} strokeWidth={2.5} />
                <Text style={styles.submitText}>Upload artwork</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl2 },
  h1: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 28, letterSpacing: -0.5 },
  sub: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 14, marginTop: 4, marginBottom: SPACING.lg },
  picker: {
    borderRadius: RADII.lg, backgroundColor: COLORS.surface, overflow: 'hidden',
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed',
    marginBottom: SPACING.lg, minHeight: 220,
  },
  pickerEmpty: { padding: SPACING.xl, alignItems: 'center', justifyContent: 'center', gap: 8 },
  pickerText: { color: COLORS.text, fontFamily: FONTS.headingSemi, fontSize: 16, marginTop: 6 },
  pickerHint: { color: COLORS.textTertiary, fontFamily: FONTS.body, fontSize: 12 },
  preview: { width: '100%', height: 280 },
  label: { color: COLORS.textSecondary, fontFamily: FONTS.bodyMed, fontSize: 12, marginTop: SPACING.sm, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADII.md, padding: SPACING.md, color: COLORS.text,
    fontFamily: FONTS.body, fontSize: 15,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  submit: {
    marginTop: SPACING.xl, backgroundColor: COLORS.primary, borderRadius: RADII.full,
    paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6,
  },
  submitText: { color: COLORS.onPrimary, fontFamily: FONTS.headingSemi, fontSize: 16 },
});
