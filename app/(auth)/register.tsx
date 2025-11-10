import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const router = useRouter();
  const { register: registerUser, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setError(null);
      setLoading(true);
      await registerUser({ email, password, confirmPassword, name });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 bg-primary px-6 justify-center">
            <View className="mb-10">
              <Text className="text-white text-3xl font-bold">Create your account</Text>
              <Text className="text-light-200 mt-2">Join the community and save your favorites.</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-light-100 mb-2">Name</Text>
                <TextInput
                  placeholder="Your name"
                  placeholderTextColor="#8E94A9"
                  value={name}
                  onChangeText={setName}
                  className="bg-secondary text-white rounded-2xl px-4 py-3"
                />
              </View>

              <View>
                <Text className="text-light-100 mb-2">Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor="#8E94A9"
                  value={email}
                  onChangeText={setEmail}
                  className="bg-secondary text-white rounded-2xl px-4 py-3"
                />
              </View>

              <View>
                <Text className="text-light-100 mb-2">Password</Text>
                <TextInput
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#8E94A9"
                  value={password}
                  onChangeText={setPassword}
                  className="bg-secondary text-white rounded-2xl px-4 py-3"
                />
              </View>

              <View>
                <Text className="text-light-100 mb-2">Confirm password</Text>
                <TextInput
                  secureTextEntry
                  placeholder="Repeat password"
                  placeholderTextColor="#8E94A9"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="bg-secondary text-white rounded-2xl px-4 py-3"
                />
              </View>
            </View>

            {error && <Text className="text-red-500 mt-4">{error}</Text>}

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="bg-blue-500 rounded-2xl py-4 mt-6 items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-base">Create account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={loading}
              className="border border-light-100 rounded-2xl py-4 mt-4 items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-base">Continue with Google</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-10">
              <Text className="text-light-200">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")} disabled={loading}>
                <Text className="text-blue-400 ml-2 font-semibold">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

