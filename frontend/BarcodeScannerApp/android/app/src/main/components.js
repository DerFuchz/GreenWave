import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import XLSX from 'xlsx';
import { writeFile, DocumentDirectoryPath } from 'react-native-fs';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const BarcodeScanner = () => {
    const [barcode, setBarcode] = useState('');

    const handleBarCodeRead = ({ data }) => {
        setBarcode(data);
        saveBarcodeToExcel(data);
    };

    const saveBarcodeToExcel = (barcodeData) => {
        const fileName = `${DocumentDirectoryPath}/barcodes.xlsx`;
        const data = [[barcodeData]];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Barcodes');
        const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
        writeFile(fileName, wbout, 'ascii')
            .then(() => console.log('Excel file written successfully'))
            .catch(error => console.log(error));
    };

    const checkCameraPermission = async () => {
        try {
            const result = await check(PERMISSIONS.ANDROID.CAMERA);
            if (result !== RESULTS.GRANTED) {
                const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
                return requestResult === RESULTS.GRANTED;
            }
            return true;
        } catch (error) {
            console.error('Camera permission error:', error);
            return false;
        }
    };

    const startScanning = async () => {
        const hasCameraPermission = await checkCameraPermission();
        if (!hasCameraPermission) {
            console.error('Camera permission not granted');
            return;
        }
    };

    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                onBarCodeRead={handleBarCodeRead}
                captureAudio={false}
            >
                <View style={styles.overlay}>
                    <Text style={styles.barcodeText}>{barcode}</Text>
                </View>
            </RNCamera>
            <Button title="Start Scanning" onPress={startScanning} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
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
        padding: 20,
        alignItems: 'center',
    },
    barcodeText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default BarcodeScanner;
