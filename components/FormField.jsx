import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";
export default function FormField({
  title,
  value,

  handleChange,
  placeholder,
  style,
  ...prop
}) {
  const [showpass, setShowpass] = useState(false);
  return (
    <View className={`space-y-2 ${style}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 border-2 bg-black rounded-2xl border-red-500 focus:border-secondary-200 flex-row">
        <TextInput
          className="flex-1 text-white"
          value={value}
          placeholderTextColor="gray"
          placeholder={placeholder}
          onChangeText={handleChange}
          secureTextEntry={title === "Password" && !showpass}
          keyboardType={prop.keyboardType}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowpass(!showpass)}>
            <Image
              source={!showpass ? icons.eye : icons.eyeHide}
              className="flex h-12 w-12 mt-2 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
