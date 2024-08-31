import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

export default function App() {
  const [qzrdAmount, setQzrdAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const conversionRate = 0.25; // ضریب تبدیل تتر به QZRD

  const connectWallet = async () => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
    });

    if (!connector.connected) {
      await connector.createSession();
    }

    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts } = payload.params[0];
      setWalletAddress(accounts[0]);
    });

    QRCodeModal.open(connector.uri);
  };

  const handleSwap = () => {
    const usdtAmount = qzrdAmount * conversionRate;
    alert(`شما ${usdtAmount} تتر دریافت خواهید کرد.`);
    // در اینجا می‌توانید تابعی برای تعامل با قرارداد هوشمند اجرا کنید
  };

  return (
    <View style={styles.container}>
      {walletAddress ? (
        <Text>کیف پول متصل شد: {walletAddress}</Text>
      ) : (
        <Button title="اتصال به کیف پول" onPress={connectWallet} />
      )}
      <Text style={styles.title}>مقدار QZRD را وارد کنید:</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={qzrdAmount}
        onChangeText={setQzrdAmount}
        placeholder="مقدار QZRD"
      />
      <Button title="تبدیل به تتر" onPress={handleSwap} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
  },
});
