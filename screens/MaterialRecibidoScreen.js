import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";

const MaterialRecibidoScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Material Recibido</Text>
        <Text style={styles.subtitle}> Seleccione el tipo de reporte operativo </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Control de recepción de materiales</Text>
        <Text style={styles.infoText}> Registre el material recibido, genere reportes automáticos y adjunte
          fotografías de las guías de remisión para mantener la trazabilidad de
          cada proceso.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Opciones disponibles</Text>

      <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("RegistroMolienda")} >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>⚙️</Text>
        </View>

        <View style={styles.optionContent}>
          <Text style={styles.cardTitle}>Molienda</Text>
          <Text style={styles.cardText}> Registro de molinos chilenos, molino de bola, concentrados, origen,
            cantidades, guías y códigos de precintos.
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate("RegistroCarbonActivado")} >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🧪</Text>
        </View>

        <View style={styles.optionContent}>
          <Text style={styles.cardTitle}>Carbón Activado / Preñado</Text>
          <Text style={styles.cardText}> Registro de Big Bags, lotes, bultos, vehículos, guías y códigos de
            precintos para el control del proceso.
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()} >
        <Text style={styles.buttonBackText}>Volver al Panel Principal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MaterialRecibidoScreen;

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