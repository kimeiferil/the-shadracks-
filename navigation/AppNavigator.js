import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import EventsScreen from '../screens/EventsScreen';
import FamilyTreeScreen from '../screens/FamilyTreeScreen';
import ContactScreen from '../screens/ContactScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="FamilyTree" component={FamilyTreeScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  );
}
