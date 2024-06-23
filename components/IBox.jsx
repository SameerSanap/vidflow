import { View, Text } from "react-native";

export default function IBox({ title, subtitle, containerStyles, titleStyle }) {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyle}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
}
