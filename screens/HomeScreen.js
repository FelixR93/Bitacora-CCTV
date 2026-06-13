import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const HomeScreen = ({ route, navigation }) => {
  const nombre = route?.params?.nombre || "Monitorista";

  const [totalNovedades, setTotalNovedades] = useState(0);
  const [totalMateriales, setTotalMateriales] = useState(0);

  const obtenerTotales = async () => {
    try {
      const novedadesSnapshot = await getDocs(collection(db, "novedades"));
      const materialesSnapshot = await getDocs(collection(db, "materiales"));

      setTotalNovedades(novedadesSnapshot.size);
      setTotalMateriales(materialesSnapshot.size);
    } catch (error) {
      console.error("Error al obtener totales: ", error);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerTotales();
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Bitácora CCTV</Text>
          <Text style={styles.company}>Bonanza</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <Text style={styles.userText}>{nombre}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalNovedades}</Text>
          <Text style={styles.statLabel}>Novedades</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumberGreen}>{totalMateriales}</Text>
          <Text style={styles.statLabel}>Materiales</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Operaciones</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("Registro")}
        >
          <Text style={styles.optionIcon}>📝</Text>
          <Text style={styles.optionTitle}>Registrar</Text>
          <Text style={styles.optionText}>Novedad CCTV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("MaterialRecibido")}
        >
          <Text style={styles.optionIcon}>📥</Text>
          <Text style={styles.optionTitle}>Material</Text>
          <Text style={styles.optionText}>Recibido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("MaterialEnviado")}
        >
          <Text style={styles.optionIcon}>📤</Text>
          <Text style={styles.optionTitle}>Material</Text>
          <Text style={styles.optionText}>Enviado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("Historial")}
        >
          <Text style={styles.optionIcon}>📋</Text>
          <Text style={styles.optionTitle}>Historial</Text>
          <Text style={styles.optionText}>Novedades</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Consultas</Text>

      <TouchableOpacity
        style={styles.fullCard}
        onPress={() => navigation.navigate("HistorialMateriales")}
      >
        <View>
          <Text style={styles.fullCardTitle}>Historial de Materiales</Text>
          <Text style={styles.fullCardText}>
            Consultar reportes de molienda, carbón, relave y materiales enviados.
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
  },

  company: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "600",
    marginTop: 2,
  },

  logoutButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 3,
  },

  logoutButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },

  welcomeCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    marginBottom: 18,
  },

  welcomeText: {
    fontSize: 15,
    color: "#64748b",
  },

  userText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 5,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    elevation: 5,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2563eb",
  },

  statNumberGreen: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#16a34a",
  },

  statLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  optionCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    elevation: 5,
    marginBottom: 14,
    minHeight: 135,
    justifyContent: "center",
  },

  optionIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
  },

  optionText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  fullCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fullCardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
  },

  fullCardText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 5,
    width: 260,
    lineHeight: 20,
  },

  arrow: {
    fontSize: 32,
    color: "#2563eb",
    fontWeight: "bold",
  },
});