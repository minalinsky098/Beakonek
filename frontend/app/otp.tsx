import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { OtpInput } from "react-native-otp-entry";

export default function Otp({ visible, onClose, otp, setOtp, error, onVerify, onResend }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center bg-black/50">

        <View className="bg-white w-[80%] rounded-2xl p-6 items-center">
            
          <Ionicons name="lock-closed" size={80} color="#FF6B2C"/>

          <TouchableOpacity 
             onPress={onClose} className="absolute top-3 right-3">
            <Text className="text-lg">✕</Text>
          </TouchableOpacity>

          <Text className="text-xl font-bold mt-4 text-center">
            Enter OTP code
          </Text>
          <Text className="text-sm mb-4 text-center">
            Enter the Code sent to your phone
          </Text>

          <View className="px-6">
             <OtpInput
               numberOfDigits={6}
               focusColor={error ? "red" : "#FF6B2C"}
               onTextChange={(text) => setOtp(text)}/>
          </View>

          {error ? (
          <Text className="text-red-500 text-sm mt-2 text-center">
          {error}
          </Text>
          ) : null}

          <TouchableOpacity
            onPress={onResend}>
            <Text className="text-black underline text-center mt-4">Resend Code?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#FF6B2C] rounded-lg p-2 w-40 mt-2"
            onPress={onVerify}>
            <Text className="text-white text-center">Enter</Text>
          </TouchableOpacity>

        </View>

      </View>
    </Modal>
  );
}