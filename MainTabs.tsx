import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import AddTask from './screens/AddTask';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name='AddTask'
        component={AddTask}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
