import { Link, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { FAB } from "@/components/ui/fab";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "500",
          },
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            height: 56,
          },
          headerTitleStyle: {
            fontFamily: 'Inter_Tight',
            fontWeight: 600,
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Goals",
            headerShown: true,
            headerRight: () => (
              <Link
                style={{
                  marginRight: 16,
                  
                }}
                href="/(goals)/new"
              >
                <View style={{height: 40, width: 40, borderRadius: 20, backgroundColor: Colors[colorScheme ?? 'light'].tint, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <MaterialSymbol size={24} name="add" color="#fff" />
                </View>
              </Link>
            ),
            
            tabBarIcon: ({ color, focused }) => (
              <MaterialSymbol name={focused ? "flag" : "flag"} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="visualization"
          options={{
            title: "Reports",
            tabBarIcon: ({ color, focused }) => (
              <MaterialSymbol
                name={
                  focused ? "arrow_upload_progress" : "arrow_upload_progress"
                }
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
