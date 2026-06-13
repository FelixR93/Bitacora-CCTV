import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";

const MaterialEnviadoScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false} >

      <View style={styles.header}>
        <Text style={styles.title}>Material Enviado</Text>
        <Text style={styles.subtitle}> Seleccione el tipo de reporte operativo </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Control de salida de materiales</Text>
        <Text style={styles.infoText}> Registre los materiales enviados, genere el reporte automático y adjunte la guía correspondiente. </Text>
      </View>

      <Text style={styles.sectionTitle}>Opciones disponibles</Text>

      <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("RegistroRelave")} >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>📤</Text>
        </View>

        <View style={styles.optionContent}>
          <Text style={styles.cardTitle}>Relave</Text>
          <Text style={styles.cardText}> Registro de bultos de relave, guía, vehículo, destino y hora de salida. </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("RegistroCarbonDesactivado")} >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>⚫</Text>
        </View>

        <View style={styles.optionContent}>
          <Text style={styles.cardTitle}>Carbón Desactivado</Text>
          <Text style={styles.cardText}> Registro de bultos, vehículo, destino, guía emitida y observaciones. </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()} >
        <Text style={styles.buttonBackText}>Volver al Panel Principal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MaterialEnviadoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },

  header: {
    marginTop: 25,
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
  },

  infoCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    marginBottom: 25,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 15,
  },

  optionCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 20,
    elevation: 5,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 26,
  },

  optionContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
  },

  cardText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },

  arrow: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563eb",
    marginLeft: 10,
  },

  buttonBack: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    elevation: 3,
  },

  buttonBackText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});