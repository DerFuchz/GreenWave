import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState('');

  const handleBarCodeRead = ({ data }) => {
    setBarcode(data);
    sendBarcodeToServer(data);
  };

  const sendBarcodeToServer = async (barcode) => {
    try {
      await fetch('http://<YOUR_SERVER_IP>:3000/save-barcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={handleBarCodeRead}
      >
        <View style={styles.overlay}>
          <Text style={styles.barcodeText}>{barcode}</Text>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 18,
    color: 'white',
    padding: 10,
  },
});

export default BarcodeScanner;