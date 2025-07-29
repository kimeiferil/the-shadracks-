import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function FamilyMember({ member }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: member.image }} style={styles.image} />
      <Text style={styles.name}>{member.name}</Text>
      {member.spouse && (
        <>
          <View style={styles.connector} />
          <Image source={{ uri: member.spouse.image }} style={styles.image} />
          <Text style={styles.name}>{member.spouse.name}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  connector: {
    height: 20,
    width: 2,
    backgroundColor: '#4b5563',
    marginVertical: 5,
  },
});
