// import { useEffect, useRef, useState } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
//   useCodeScanner
// } from "react-native-vision-camera";

// export default function App() {
//   const camera = useRef<Camera>(null);
//   const { hasPermission, requestPermission } = useCameraPermission();
//   const [isActive, setIsActive] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (!hasPermission) {
//         await requestPermission();
//       }
//       setIsActive(true);
//     })();
//   }, [hasPermission]);

//     const codeScanner = useCodeScanner({
//     codeTypes: ["qr", "ean-13"],
//     onCodeScanned: (codes) => {
//       console.log(`Scanned ${codes} codes!`);
//     },
//   });

//   const device = useCameraDevice("back");
//   if (!hasPermission) return <Text>No permission</Text>;
//   if (device == null) return <Text>No camera device</Text>;

//   return (
//     <View style={StyleSheet.absoluteFill}>
//       <Camera
//         ref={camera}
//         device={device}
//         isActive={isActive}
//         codeScanner={codeScanner}
//         style={StyleSheet.absoluteFill}
//         onError={(error) => console.error(error)}
//       />
//     </View>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

export default function App() {
  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(true); // Bật camera ban đầu
  const [scannedCode, setScannedCode] = useState<Code | null>(null); // Lưu mã đã scan

  // Xử lý quyền camera
  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission]);

  // Cấu hình scanner
  const codeScanner = useCodeScanner({
    codeTypes: ["qr","code-128"],
    onCodeScanned: (codes: Code[]) => {
      if (codes.length > 0 && !scannedCode) {
        setScannedCode(codes[0]); // Lưu mã đầu tiên scan được
        setIsActive(false); // Tắt camera
      }
    },
  });

  const device = useCameraDevice("back");

  // Nếu chưa có quyền hoặc không có camera
  if (!hasPermission) return <Text>No permission</Text>;
  if (device == null) return <Text>No camera device</Text>;

  // Nút "Scan lại"
  const handleRescan = () => {
    setScannedCode(null);
    setIsActive(true); // Bật lại camera
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Hiển thị camera khi chưa scan */}
      {isActive && (
        <Camera
          ref={camera}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          onError={(error) => console.error(error)}
        />
      )}

      {/* Hiển thị kết quả sau khi scan */}
      {scannedCode && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Scanned: {scannedCode.value} (Type: {scannedCode.type})
          </Text>
          <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
            <Text style={styles.rescanText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  resultText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },
  rescanButton: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 5,
  },
  rescanText: {
    color: "white",
    fontSize: 16,
  },
});
