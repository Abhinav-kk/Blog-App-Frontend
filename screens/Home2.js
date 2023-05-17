import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

export default function Home2() {
    const sheetRef = useRef(null);
    const [isOpened, setIsOpened] = useState(false);
    const snapPoints = ['60%'];

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
        setIsOpened(true);
    }, []);

    return (
        <View style={styles.container}>
            <Button title="Open Bottom Sheet" onPress={() => handleSnapPress(0)} />
            {
                isOpened ?
                    <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true} onClose={() => setIsOpened(false)}>
                        <BottomSheetView>
                            <Text>Content</Text>
                        </BottomSheetView>
                    </BottomSheet>
                    : <></>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#85AACC',
        justifyContent: "center",
        alignItems: "center",
    },
})