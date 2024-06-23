import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const Button = ({ title, handlePress, style, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${style} ${
        isLoading ? "opacity-50" : ""
      } ${style}`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg `}>{title}</Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default Button;
